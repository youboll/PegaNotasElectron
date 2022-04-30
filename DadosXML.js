const Electron = require('electron');


//Cria uma stack das notas feitas e as envia para o MAIN quando tudo estiver pronto
class notasFeitasStack {
    constructor () {
        this.stack = [];
    }
    addNfe (obj) {
        this.stack.push(obj)
    }
    removeNfe() {
        this.stack.pop()
    }
    sendAllData() {        
            Electron.ipcRenderer.send('writeXml',JSON.stringify(this.stack));
            
        
    }

}


const nfeStack = new notasFeitasStack();


window.addEventListener('load', function () {
    writeXmlData()
    console.log('teste')
  })
window.counter = 1;
function writeXmlData () {
     window.nNFE = document.querySelector('#nfeNumero');
     window.emitNFE = document.querySelector('#nfeEmitent');
     window.ufNFE = document.querySelector('#nfeUf');
     window.descNFE = document.querySelector('#descricao');
     window.nfeMotivo = document.querySelector('#nfeMotivo');
     window.natOp = document.querySelector('.natOp');
    Electron.ipcRenderer.send('getXmlData');
    Electron.ipcRenderer.on('getXmlData',(event,args) => {
        //Escrevendo dados XML na tela
        window.dadosNota = args
        window.nfeCounter = 0;
        window.cnpjCounter =0;
        document.querySelector('.loader').remove();
        writeOnScreen();
        
    })
}
function writeOnScreen() {

    if (window.dadosNota[window.cnpjCounter] == undefined) {
        return(nfeStack.sendAllData())
    }
    window.nfeMotivo.value = ""
    //Colocar em váriavel global para pegar no trigger 'Enter' abaixo
    let nfeKeyName = Object.keys(window.dadosNota[window.cnpjCounter])[0];
    window.cnpjData = window.dadosNota[window.cnpjCounter][nfeKeyName];
    if (window.cnpjData[window.nfeCounter] == undefined) {
        window.nfeCounter = 0;
        window.cnpjCounter++;
        return(writeOnScreen());
    } else {
        window.curruentNFE = window.cnpjData[window.nfeCounter]
        nNFE.value = curruentNFE.nfeNumber.toLocaleString();;
        emitNFE.value = curruentNFE.emitNome;
        ufNFE.value = curruentNFE.emitUF;
        descNFE.innerHTML = curruentNFE.nfeDesc;
        window.natOp.innerHTML = curruentNFE.natOpe;
    }
    
    
}

function fromDomtoStack() {
    let writeXmlData= {
        'emitNome':emitNFE.value.toUpperCase(),
        'emitUF':ufNFE.value,
        'nfeNumber':nNFE.value,
        'nfeMotivo':nfeMotivo.value,
        'location': window.curruentNFE.location,
        'xmlTitle': window.curruentNFE.xmlTitle,
        'title': window.curruentNFE.title
    }
    nfeStack.addNfe(writeXmlData);
    window.nfeCounter++;
    writeOnScreen();
}

window.onkeypress =  (event) => {
    if (event.code == 'Enter') {
        fromDomtoStack()
    }
}



function previousNfe() {
 if (window.nfeCounter != 0) {
     window.nfeCounter--;
     nfeStack.removeNfe()
     writeOnScreen()
 } else if(window.cnpjCounter !=0) {
     window.cnpjCounter--;
     let nfeKeyName = Object.keys(window.dadosNota[window.cnpjCounter])[0];
     window.cnpjData = window.dadosNota[window.cnpjCounter][nfeKeyName];
     console.log(window.nfeCounter,window.cnpjCounter)
     window.nfeCounter = window.cnpjData.length-1;
     nfeStack.removeNfe()
     writeOnScreen()
 }
}
function nextNfe() {
    fromDomtoStack()
}
/*
window.onkeypress = async (event) => {
    if (event.code == 'Enter' && window.travaEnter == false) {
        console.log("nfe atual: ",window.curruentNFE)
        console.log("NOTA: ",window.nfeCounter," CNPJ: ",window.cnpjCounter)
        let writeXmlData= {
            'emitNome':emitNFE.value,
            'emitUF':ufNFE.value,
            'nfeNumber':nNFE.value,
            'nfeMotivo':nfeMotivo.value,
            'location': window.curruentNFE.location,
            'xmlTitle': window.curruentNFE.xmlTitle,
            'title': window.curruentNFE.title
        }
        Electron.ipcRenderer.send('writeXml',JSON.stringify(writeXmlData));
        await Electron.ipcRenderer.on('writeXml',async (event,args) => {
            let nfeKeyName = Object.keys(window.dadosNota[window.cnpjCounter])[0];
            window.dadosNota[window.cnpjCounter][nfeKeyName][window.nfeCounter];
            window.curruentNFE = JSON.parse(args)
           
            window.travaEnter = true;
            window.nfeCounter++;
            await writeOnScreen();
        })
        
        

    }
}
*/