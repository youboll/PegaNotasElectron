const {exec} = require('child_process')
module.exports = async function (nome,destination) {
    nome = nome.replace(/ /g,'%20');
    destination = destination.replace(/ /g,'%20')
    let commandString = "python index.py -n " + nome + " -o " + destination;
    setTimeout(async () => {
        exec(commandString,(error) => {
            if (error) {throw error}
        })
    },500)
    
}