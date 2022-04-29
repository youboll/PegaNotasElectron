const { throws } = require('assert');
const fs = require('fs')
const {XMLParser} = require('fast-xml-parser');
const pdf = require('./geraPdf')
module.exports = class nfe {
    constructor(location) {
        let parser = new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@_'});
        let file = fs.readFileSync(location,'utf-8');
        let xmlObj = parser.parse(file,{parseAttributeValue:true});

        this.emitNome = xmlObj.nfeProc.NFe.infNFe.emit.xNome;
        this.emitUF = xmlObj.nfeProc.NFe.infNFe.emit.enderEmit.UF;
        this.nfeNumber = xmlObj.nfeProc.NFe.infNFe.ide.nNF;
        this.nfeChave = xmlObj.nfeProc.NFe.infNFe['@_Id'].substring(3); //Tira os primeiros numeros
        this.nfeDesc = xmlObj.nfeProc.NFe.infNFe.infAdic.infCpl;
        this.xmlTitle = this.getFileData(location);
        this.location = this.breakLocation(location);
        this.title = this.getPdfName();
        this.generatePdf()
        
    }
    getAllData() {
        return({'nfeChafe':this.nfeChave,'emitNome':this.emitNome,'emitUF':this.emitUF,'nfeNumber':this.nfeNumber,'location':this.location,titles:{'pdfName':this.title,'xmlName':this.xmlTitle}})
    }
    //Desconstroi a localizacao padrao do arquivo e o nome antigo
    getFileData(location) {
        let locationParts = location.split('\\');
    
        let oldName = locationParts[locationParts.length-1]
        return(oldName)
        
    }
    breakLocation(location) {
        let locationParts = location.split('\\');
        let finalLocation = "";
        for (let x=0;x<locationParts.length-1;x++) {
            if (x ==0) {
                finalLocation = finalLocation + locationParts[x]   
            } else {
                finalLocation = finalLocation+"\\" + locationParts[x]   
            }
            
        }
        return(finalLocation)
    }
    isCnpj(text) {
        if (text.length == 50 || isNaN(parseFloat(text)) == false) {
            return(true)
        } else {
            return(false)
        }

    }
    getPdfName () {
       return(this.xmlTitle.substring(0,this.xmlTitle.length-9) + "_danfe.pdf")
    }
    generatePdf () {
        pdf((this.location +"\\"+ this.xmlTitle),(this.location +"\\"+ this.title))
    }
}