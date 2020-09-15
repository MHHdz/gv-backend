// Importaciones de expres
var express = require('express');

// Importación de fileSystem y path
var fs = require('fs');
var path = require('path');


var fotos = express();

fotos.get('/usuarios/:img', (req, res) => {

    var img = req.params.img;

    var pathImg = path.resolve(__dirname, `../uploads/usuarios/${ img }`);

    if (fs.existsSync( pathImg )) {
        res.sendFile(pathImg);
    } else {

        var noImgPath = path.resolve(__dirname, '../assets/no-image-profile.png')
        // Muestra una imagen genérica, en caso de que no exista la imagen buscada
        res.sendFile(noImgPath);
    }

});

module.exports = fotos;