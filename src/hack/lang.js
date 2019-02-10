const HACK_OPCODE = {
    A_OPCODE: '0',
    C_OPCODE: '1',
    OPCODE_SIZE: 1,
}

const INSTRUCTION_TYPE = {
    A: 'A',
    C: 'C',
}

const JMP_CODES = {
    '': '000',
    JGT: '001',
    JEQ: '010',
    JGE: '011',
    JLT: '100',
    JNE: '101',
    JLE: '110',
    JMP: '111',
};

const COMP_CODE = {
    '0': '0101010',
    '1': '0111111',
    '-1': '0111010',
    'D': '0001100',
    'A': '0110000',
    '!D': '0001101',
    '!A': '0110001',
    '-D': '0001111',
    '-A': '0110011',
    'D+1': '0011111',
    'A+1': '0110111',
    'D-1': '0001110',
    'A-1': '0110010',
    'D+A': '0000010',
    'D-A': '0010011',
    'A-D': '0000111',
    'D&A': '0000000',
    'D|A': '0010101',
    'M': '1110000',
    '!M': '1110001',
    '-M': '1110011',
    'M+1': '1110111',
    'M-1': '1110010',
    'D+M': '1000010',
    'D-M': '1010011',
    'M-D': '1000111',
    'D&M': '1000000',
    'D|M': '1010101',
}

const PREDEF_SYMBOLS = {
    R0: '0',
    R1: '1',
    R2: '2',
    R3: '3',
    R4: '4',
    R5: '5',
    R6: '6',
    R7: '7',
    R8: '8',
    R9: '9',
    R10: '10',
    R11: '11',
    R12: '12',
    R13: '13',
    R14: '14',
    R15: '15',
    SCREEN: '16384',
    KBD: '24576',
    SP: '0',
    LCL: '1',
    ARG: '2',
    THIS: '3',
    THAT: '4',
}

const COMMENTS_SYMBOL = '//';
const INSRUCTION_SIZE = 16;
const VARIABLE_START = 16;
const RAM_SIZE = 16384;

const getSymbol = (label) => PREDEF_SYMBOLS[label];
const getJumpCode = (jmp) => JMP_CODES[jmp];
const getCompCode = (comp) => COMP_CODE[comp];

const getInstructionOpcode = (instructionType) => {
    switch (instructionType) {
        case INSTRUCTION_TYPE.A: return HACK_OPCODE.A_OPCODE;
        case INSTRUCTION_TYPE.C: return HACK_OPCODE.C_OPCODE;
        default: return '';
    }
}

module.exports = {
    HACK_OPCODE,
    INSRUCTION_SIZE,
    INSTRUCTION_TYPE,
    COMMENTS_SYMBOL,
    VARIABLE_START,
    RAM_SIZE,
    getJumpCode,
    getCompCode,
    getSymbol,
    getInstructionOpcode,
};
