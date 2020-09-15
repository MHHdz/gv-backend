// Importación de express
var express = require('express');

// Se levanta la ruta
var rutaPrincipal = express();

//    (ruta, callback)
rutaPrincipal.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
});

// Se exporta la ruta
module.exports = rutaPrincipal;
