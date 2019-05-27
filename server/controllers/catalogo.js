var model=require('../models/catalogo')
module.exports={
    obtenerUsuario:obtenerUsuario
}

function obtenerUsuario (){
    return new Promise(function(resolve, reject){
        model.obtenerUsuario()
        .then(function(res){
            resolve(res)
        })
    })
}
