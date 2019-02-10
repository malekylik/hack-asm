const _ = require('lodash');

const lang = require('./lang');
const parsing = require('./parsing');
const stringUtil = require('../util/string');

const removeCommentFromLine = (inst = '') => {
    let i = inst.indexOf(lang.COMMENTS_SYMBOL);
    return i === -1 ? inst : inst.slice(0, i);
}

const removeComments = (asm = '') => {
    const strsArr = new Array(stringUtil.lineCount(asm));

    let withoutComment = '';
    let i = 0;

    stringUtil.forEachLine(asm, (line) => {
        withoutComment = removeCommentFromLine(line).trim();

        if (withoutComment !== '') strsArr[i++] = withoutComment;
    });

    const validStrs = [];
    let isLast = false;
    i = 0;

    while (i < strsArr.length && strsArr[i]) {
        isLast = !strsArr[i + 1] || i + 1 >= strsArr.length;
        validStrs.push(isLast ? strsArr[i++] : strsArr[i++] + '\n');
    }

    const charCount = stringUtil.strsLength(validStrs);
    const strBin = new Uint8Array(charCount);

    stringUtil.writeStrsToBinaryStr(strBin, validStrs);

    return stringUtil.fromBinToStr(strBin);
}

const compileInstruction = (line = '') => {
    switch (parsing.instructionType(line)) {
        case lang.INSTRUCTION_TYPE.A: return parsing.convertAInstructionFromTextToBin(line);
        case lang.INSTRUCTION_TYPE.C: return parsing.convertCInstructionFromTextToBin(line);
    }

    return 'errorInstruction'
}

const preCompile = (asm = '', substituter = []) => {
    const lines = [];
    let i = 0;
    let subs = '';

    stringUtil.forEachLine(asm, (line, nextLine) => {
        subs = line;

        for (i = 0; i < substituter.length; i++) {
            subs = substituter[i](subs);
        }

        if (subs) lines.push(Boolean(nextLine) ? subs + '\n' : subs);
    });

    const binStr = new Uint8Array(stringUtil.strsLength(lines));
    stringUtil.writeStrsToBinaryStr(binStr, lines)

    return stringUtil.fromBinToStr(binStr);
}

const getFreeVariableLocation = (freeMemoryPointer, maxMemory) => freeMemoryPointer < maxMemory ? freeMemoryPointer : null;
const getFreeVariableLocationHack = _.partial(getFreeVariableLocation, _, lang.RAM_SIZE);

const createVariablesDictionary = (asm, freeMemoryPointer, labels) => {
    const variables = new Map();
    let p = freeMemoryPointer;

    stringUtil.forEachLine(asm, (line) => {
        if (parsing.isVariable(line) && !parsing.isPredefSymbol(line)) {
            const variable = parsing.getVariableNameFromTextAInstruction(line);
            
            if (!variables.has(variable) && !labels.has(variable)) {
                const value = getFreeVariableLocationHack(p);
                variables.set(variable, value);
    
                p = value !== null ? value + 1 : p;
            }
        }
    });

    return variables;
}

const createLabelsDictionary = (asm) => {
    let lineNumber = 0;
    const labels = new Map();

    stringUtil.forEachLine(asm, (line) => {
        if (parsing.isLabelDefenition(line)) {
            labels.set(parsing.getLebelName(line), lineNumber);
        } else {
            lineNumber += 1;
        }
    });

    return labels;
}

const substituteLabelDefinition = (line = '') => parsing.isLabelDefenition(line) ? '' : line;
const substitutePredefSymbols = (line = '') => parsing.isPredefSymbol(line) ? parsing.convertPredefSymbolToAInstruction(line) : line;
const substituteSymbols = (line, labels, variables) => {
    if (parsing.isVariable(line)) {
        const name = parsing.getVariableNameFromTextAInstruction(line);

        return parsing.convertSymbolToAInstruction(labels.get(name) || variables.get(name));
    }

    return line;
}

const compile = (asm = '') => {
    const asmWithoutComments = removeComments(asm);
    const labels = createLabelsDictionary(asmWithoutComments);
    const variables = createVariablesDictionary(asmWithoutComments, lang.VARIABLE_START, labels);
    const asmSub = preCompile(asmWithoutComments, [
        substituteLabelDefinition,
        substitutePredefSymbols,
        _.partial(substituteSymbols, _, labels, variables),
    ]);

    const lineCount = stringUtil.lineCount(asmSub);
    const strBin = new Uint8Array(lineCount * lang.INSRUCTION_SIZE + lineCount - 1).fill((' ').charCodeAt(0));
    const compiledStrs = [];

    stringUtil.forEachLine(asmSub, (line, nextLine) => compiledStrs.push(Boolean(nextLine) ? compileInstruction(line) + '\n' : compileInstruction(line)));
    stringUtil.writeStrsToBinaryStr(strBin, compiledStrs);

    return strBin;
}

module.exports = {
    compileInstruction,
    compile,
};
