

function getXmlFile() {
    const Electron = require('electron');
    Electron.ipcRenderer.sendSync('getXmlFIle')
    Electron.ipcRenderer.on('getXmlFIle',(event,args) => {
        
    })
}