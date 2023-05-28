const { dialog } = require('electron');
const cryptoJs = require("crypto-js");
const fs = require('fs');

class Encrypter {
    constructor(key) {
        this.key = key;
        this.iv = cryptoJs.lib.WordArray.random(16);
    }

    encrypt(file) {
        const data = fs.readFileSync(file);
        const encryptedData = cryptoJs.AES.encrypt(data, this.key, {
            iv: this.iv,
            mode: cryptoJs.mode.CBC,
            padding: cryptoJs.pad.Pkcs7,
        });
        return encryptedData;
    }

    getEncFile() {
        const filePaths = dialog.showOpenDialogSync({
            properties: ['openFile'],
            filters: [{ name: 'All Files', extensions: ['*'] }],
        });
        const filePath = filePaths[0];
        const encryptedData = this.encrypt(filePath);
        const encFilePath = `${filePath}.enc`;
        fs.writeFileSync(encFilePath, encryptedData.toString());
        return encFilePath;
    }
}

module.exports = Encrypter;