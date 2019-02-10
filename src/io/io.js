const readline = require('readline');
const fs = require('fs');
const _ = require('lodash');

const getReadLine = () => (
    readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
);

const readLine = (rl, prompt = '') => new Promise(resolve => rl.question(prompt, answer => resolve(answer)));

const readHackFilePath = _.partial(readLine, _, 'Enter path to hack asm file: ');
const readFilePath = async (rl, warningHandler = (filePath) => {}) => {
    let filePath = '';

    filePath = await readHackFilePath(rl);
    while (!fs.existsSync(filePath)) {
        warningHandler(filePath);
        
        filePath = await readHackFilePath(rl);
    }

    return filePath;
}

module.exports = {
    getReadLine,
    readLine,
    readFilePath,
};
