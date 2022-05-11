const { app, BrowserWindow, dialog, ipcMain, ipcRenderer } = require('electron');
const Electron = require('electron')
const fs = require('fs');
const nfe = require('./nfe')
const nfeLogger = require('./logger')
const Controller = require('./controller');
let controller;
//Inicia a janela dos programas
let win = null;
let winNfe = null;
//Tela inicial do programa - É trocada depois de selecionar o XML
const selecionaXML = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: "Pegador de notas",
      icon: __dirname + '/iconeFrutap.png',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
    })
    //win.removeMenu()
  
    win.loadFile('selecionaXML.html')
  }
const openWindowNfe = ()=> {
  winNfe = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Pegador de notas",
    icon: __dirname + '/iconeFrutap.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  }
  })
  //winNfe.removeMenu()
  winNfe.loadFile('./DadosXml.html')
}


app.whenReady().then(() => {
  selecionaXML()
  
})


//Espera o FRONTEND pedir o arquivo XML
ipcMain.on('getXmlFIle', (event,args) => {
  console.log(args);
  //Abre pasta inicial 
  dialog.showOpenDialog({
    properties:['openfile']
  }).then((files) => {
    if (files.canceled) {
      win.close()
    }
    console.log(files.filePaths[0])
    let file = files.filePaths[0]

    //Somente aceita .xml
    if (file.substring(file.length-4) == '.pdf') {
      dialog.showMessageBox(winNfe,{buttons:['Ok'],'message':"Erro fomato .pdf inválido"}).then((event) => {
        if (event.response == 0) {
          return(win.close())
        }
      })
      
    } else {
      //Inicia a leitura do XML 
      win.close()
      openWindowNfe()
      controller = new Controller(files.filePaths[0]);
      controller.getFolderInfo()
    }
   
  })
})

ipcMain.on('getXmlData', (event,args) => {
  event.reply('getXmlData',controller.getXml())
})

ipcMain.on('writeXml',(event,args) => {
  let notasFeitas = JSON.parse(args);
  //Lanca tela de pergunta ao usuario
  dialog.showMessageBox(winNfe,{buttons:['Sim','Não'],message:"Deseja salvar as notas?"}).then((event) => {
    let buttonPressed = event.response;
    if (buttonPressed === 0) {
      console.log('te');
      let nfeLog = new nfeLogger()
      for (const x in notasFeitas) {
        let nfe = notasFeitas[x];
        let pdfName = nfe['emitNome'] +" "+ nfe['emitUF'] +" "+ nfe['nfeNumber'] +" - "+ nfe['nfeMotivo']+".pdf";
        let xmlName = nfe['emitNome'] +" "+ nfe['emitUF'] +" "+ nfe['nfeNumber']+'.xml';
        
        fs.renameSync((nfe['location']+"\\"+nfe['xmlTitle']),nfe['location']+xmlName);
        fs.renameSync(nfe['location']+"\\"+nfe['title'],nfe['location']+pdfName);
        nfeLog.addLog(pdfName)
        
      }
      nfeLog.writeData()
      dialog.showMessageBox(winNfe,{buttons:['Ok'],'message':"Concluído"}).then((event) => {
        if (event.response == 0) {
          winNfe.close()
        }
      })
      
    }
  })
  
  
 
})

/*
ipcMain.on('writeXml',(event,args) => {
  args = JSON.parse(args)

  let pdfName = args['emitNome'] +" "+ args['emitUF'] +" "+ args['nfeNumber'] +" "+ args['nfeMotivo']+".pdf";
  let xmlName = args['emitNome'] +" "+ args['emitUF'] +" "+ args['nfeNumber']+'.xml';

  console.log("Caminho XML",(args['location']))
  //Falta renomear o xml e o pdf
  fs.renameSync((args['location']+"\\"+args['xmlTitle']),args['location']+xmlName);
  fs.renameSync(args['location']+"\\"+args['title'],args['location']+pdfName);
  args['xmlTitle'] = xmlName;
  args['title'] = pdfName;
  event.reply('writeXml',JSON.stringify(args));
})
8?*/
