const { TextDecoder } = require('util');

const lineGiver = (src = '', startLine = 0) => {
    let lineCount = 0;
    let i = 0;

    while (i < src.length && lineCount < startLine) {
        if (src[i] === '\n') lineCount++;

        i += 1;
    }

    return () => {
        const start = i;
        while (i < src.length && src[i++] !== '\n');

        return start === i ? null : src.slice(start, src[i - 1] !== '\n' ? i : i - 1);
    }
}

const lineCount = (src = '') => {
    let lineCount = 0;
    let lastLineEnd = 0;
    let i = 0;

    while (i < src.length) {
        if (src[i] === '\n') { 
            lineCount += 1;
            lastLineEnd = i;
        }

        i += 1;
    }

    return lastLineEnd !== i ? lineCount + 1 : lineCount;
}

const strsLength = (strs = []) => {
    let length = 0;

    for (let i = 0; i < strs.length; i++) length += strs[i].length;

    return length;
}

const writeStrToBinaryStr = (binaryStr, line = '', start = 0) => {
    if (start >= binaryStr.length) return binaryStr.length;
    
    let i = start;
    let j = 0;

    while (j < line.length && i < binaryStr.length) {
        binaryStr[i] = line.charCodeAt(j);
        i += 1;
        j += 1;
    }

    return i;
}

const writeStrsToBinaryStr = (binaryStr, strs = [], start = 0) => {
    let p = start;
    
    for (let i = 0; i < strs.length && p < binaryStr.length; i++) {
        p = writeStrToBinaryStr(binaryStr, strs[i], p);
    }

    return p;
}

const fromBinToStr = (strBin) => new TextDecoder("utf-8").decode(strBin);
const forEachLine = (lines, callback = (line, nextLine) => {}) => {
    const asmStrs = lineGiver(lines);
    let s = asmStrs();
    let nextLine = asmStrs();

    while (s) {
        callback(s, nextLine);
        s = nextLine;
        nextLine = asmStrs();
    }
}

module.exports = {
    lineGiver,
    lineCount,
    strsLength,
    writeStrToBinaryStr,
    writeStrsToBinaryStr,
    fromBinToStr,
    forEachLine,
};
