//Armazena dados operacionais do programa - Notas Deletaas, pasta base etc..
const { throws } = require('assert');
const fs = require('fs');
const nfe = require('./nfe');
const Nfe = require('./nfe');
module.exports = class controller {
    constructor(path) {
        let baseParts = path.split('\\');
        let baseDir = ""
        for (let x=0;x<baseParts.length;x++) {
            if (x==0) {baseDir = baseDir+ baseParts[x];} else {baseDir = baseDir+"\\"+ baseParts[x];}
            if (x == baseParts.length -3) {break;}
            //Nao pegar os dois ultimos membros do endereco
        }
        this.path = baseDir
    }
    getFolderInfo() {
        let dirData = fs.readdirSync(this.path,{withFileTypes:true});
        this.notas = [];
        for (let x=0;x<dirData.length;x++) {
            let CNPJXMLS = []
            let CNPJData = fs.readdirSync(this.path+'\\'+dirData[x].name,{withFileTypes:true});
            
            //Itera por dentro da pasta para remover PDF e outras coisas não utilizadas
            for (let y=0;y<CNPJData.length;y++) {
                if (CNPJData[y].name.substring((CNPJData[y].name.length-4)) == '.xml') {
                    //Caso o arquivo for XML adicione ele a lista de XMLs do CNPJ
                    let xmlUsefulData = new Nfe((this.path+'\\'+dirData[x].name+'\\'+CNPJData[y].name))
                    xmlUsefulData.location = this.path+'\\'+dirData[x].name+'\\';
                    xmlUsefulData.getAllData()
                    CNPJXMLS.push(xmlUsefulData)
                }
            }
            let cnpj = dirData[x].name;
            this.notas.push({[cnpj]:CNPJXMLS})
            
        }
        this.dirContent = dirData;
        this.dirCounter = 1;
        console.log(this.notas)
    }
    getXml() {
        return(this.notas)
    }
    
}