const _ = require('lodash');

const lang = require('./lang');
const numberUtil = require('../util/number');

const instructionType = (line = ' ') => {
    if (line[0] === '@') return lang.INSTRUCTION_TYPE.A;

    return lang.INSTRUCTION_TYPE.C;
}

const getAddressFromTextAInstruction = (instruction) => _.trimEnd(instruction.slice(1));
const getAddressFromTextAInstructionInBin = _.flowRight([_.partial(_.padStart, _, lang.INSRUCTION_SIZE - lang.HACK_OPCODE.OPCODE_SIZE, '0'), numberUtil.decToBin, (_.toInteger) , getAddressFromTextAInstruction]);
const converterAInstructionFromTextToBin = getAddressFromTextAInstructionInBin;

const getVariableNameFromTextAInstruction = getAddressFromTextAInstruction;
const isVariable = (line = ' ') => line[0] === '@' && (/[a-zA-Z]+/).test(line.slice(1));
const isPredefSymbol = (line = '') => isVariable(line) && Boolean(lang.getSymbol(getVariableNameFromTextAInstruction(line)));
const isLabelDefenition = (line) => {
    const trimmed = _.trimEnd(line);
    return (trimmed[0] === '(') && (trimmed[trimmed.length - 1] === ')');
};
const getLebelName = (line) => line.slice(line.indexOf('(') + 1, line.indexOf(')'));
const getPredefSymbol = (variable = '') => (lang.getSymbol(getVariableNameFromTextAInstruction(variable))) || 'errorPredefSymbol';
const convertPredefSymbolToAInstruction = (variable = '') => `@${getPredefSymbol(variable)}`;
const convertSymbolToAInstruction = (mem) => `@${mem}`;

const getJumpFromTextCInstruction = (instruction = '') => {
    const i = instruction.indexOf(';');
    return i !== -1 ? instruction.slice(i + 1, i + 1 + 3) : '';
};
const converJumpTextToBin = (jmp = null) => lang.getJumpCode(jmp) || 'jmpError';
const getJumpFromTextCInstructionInBin = _.flowRight([converJumpTextToBin, getJumpFromTextCInstruction]);

const getDestFromTextCInstruction = (instruction = '') => {
    const i = instruction.indexOf('=');
    return i !== -1 ? instruction.slice(0, i) : null;
}
const joinDestBits = (A = 0, D = 0, M = 0) => `${A}${D}${M}`;
const convertDestTextToBin = (dest = '') => {
    let A = 0;
    let D = 0;
    let M = 0;

    _.forEach(dest, (char) => {
        switch (char) {
            case 'A': A = 1; break;
            case 'D': D = 1; break;
            case 'M': M = 1; break;
        }
    });

    return joinDestBits(A, D, M);
}
const getDestFromTextCInstructionInBin = _.flowRight([convertDestTextToBin, getDestFromTextCInstruction]);

const getCompFromTextCInstruction = (instruction = '') => {
    let eqIndex = instruction.indexOf('=');
    let semicolonIndex = instruction.indexOf(';');

    eqIndex = eqIndex === -1 ? 0 : eqIndex + 1;
    if (semicolonIndex === -1) semicolonIndex = instruction.length;
    
    return instruction.slice(eqIndex, semicolonIndex);
}

const convertCompTextToBin = (comp = '') => lang.getCompCode(comp) || 'compError';
const getCompFromTextCInstructionInBin = _.flowRight([convertCompTextToBin, getCompFromTextCInstruction]);

const RESERVER_C_INSTRUCTION_BIST = '11';
const converterCInstructionFromTextToBin = (cInst = '') => `${RESERVER_C_INSTRUCTION_BIST}${getCompFromTextCInstructionInBin(cInst)}${getDestFromTextCInstructionInBin(cInst)}${getJumpFromTextCInstructionInBin(cInst)}`;

const convertInstructionFromTextToBin = (
    opcode = '',
    converter = (instruction) => {},
    instruction = ''
) => `${opcode}${converter(instruction)}`;
const convertAInstructionFromTextToBin = _.partial(
    convertInstructionFromTextToBin,
    lang.getInstructionOpcode(lang.INSTRUCTION_TYPE.A),
    converterAInstructionFromTextToBin,
);
const convertCInstructionFromTextToBin = _.partial(
    convertInstructionFromTextToBin,
    lang.getInstructionOpcode(lang.INSTRUCTION_TYPE.C),
    converterCInstructionFromTextToBin
);

module.exports = {
    instructionType,
    isVariable,
    isPredefSymbol,
    isLabelDefenition,
    getLebelName,
    getVariableNameFromTextAInstruction,
    convertPredefSymbolToAInstruction,
    convertSymbolToAInstruction,
    convertAInstructionFromTextToBin,
    convertCInstructionFromTextToBin,
};
