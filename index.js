const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const util = require('util');

const io = require('./src/io/io');
const hack = require('./src/hack/hack');

const logFileWarning = (filePath = '') => console.log(`File '${filePath}' doesn't exist. Try again`);
const readFilePath = _.partial(io.readFilePath, _, logFileWarning);
const readFile = util.promisify(fs.readFile);

(async () => {
    const rl = io.getReadLine();
    const filePath = await readFilePath(rl);
    rl.close();

    const parsedPath = path.parse(filePath);

    const asmSource = await readFile(filePath, 'utf-8');
    const bin = hack.compile(asmSource);
    
    fs.writeFile(path.join(parsedPath.dir, `${parsedPath.name}.hack`), bin, (e) => {
        if (e) console.error(e);
    });
})();
