const fs = require('fs');
const path = require('path');
module.exports = class logger {
    constructor() {
        this.filePath = path.join(__dirname,'logs.json');
        console.log(this.filePath)
        if (!fs.existsSync(this.filePath)) {
            this.logData = {"logs":[]}
            fs.writeFileSync(this.filePath,JSON.stringify(this.logData))
            
        } else {
            this.logData = JSON.parse(fs.readFileSync(this.filePath,'utf-8'));
        }  
    }
    addLog(log) {
        this.logData.logs.push(log);
    }
    writeData() {
        fs.writeFileSync(this.filePath,JSON.stringify(this.logData))
    }
}