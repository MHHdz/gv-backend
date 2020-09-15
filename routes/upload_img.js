// Importaciones de expres
var express = require('express');
var fileUpload = require('express-fileupload');

// Importación de fileSystem y path
var fs = require('fs');
var path = require('path');

// Se levanta la ruta
var uploadImg = express();

// Se importa los esquemas de las entidades
var modeloUsuario = require('../models/usuario');

// Default options - Middleware
uploadImg.use(fileUpload());

// ==========================================================================================
// Subir la imagen de los usuarios
// ==========================================================================================
uploadImg.put('/usuarios/:id', (request, response) => {
    
    // Se obtiene el id del usuario, pasado por URL
    var id = request.params.id;

    // Si no viene la imágen
    if (!request.files) {

        return response.status(400).json({
            ok: false,
            mensaje: 'No seleccionó una imagen',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Se obtiene la imagen
    var img = request.files.imagen; // imagen es el nombre que se manda de Postman
    var nombreSeparado = img.name.split('.');
    var extensionImg = nombreSeparado[ nombreSeparado.length - 1 ];

    // Se especifican las extensiones aceptadas
    var extensionesValidas = ['jpg', 'jpeg', 'png', 'bmp'];

    // Se valida la extensión de la imagen
    if (extensionesValidas.indexOf( extensionImg ) < 0 ) {
        
        return response.status(400).json({
            ok: false,
            mensaje: 'Tipo de archivo no válido',
            errors: { 
                message: 'Seleccione una imagen con extensión ' + extensionesValidas.join(', '),
                ext: 'Se recibió un .' + extensionImg
            }
        });
    }

    // Se asigna un nombre personalizado a la imagen
    var nombreImagen = `${ id }-${ new Date().getTime() }.${ extensionImg }`;

    // Se mueve el archivo del temporal a un path específico
    var ruta = `./uploads/usuarios/${ nombreImagen }`;

    img.mv( ruta, (err) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al mover la imagen',
                errors: err
            });
        }

        // En este punto, la imagen ya esta cargada

        // Se llama a la función para enviar los parámetros
        imagenUsuarios(id, response, nombreImagen);
    });
    
});

// Método que grabar en la coleccion usuarios el nombre de la imagen subida
function imagenUsuarios(id, res, nombreImagen) {

    console.log('1' + id);
    console.log('2'+res);
    console.log('3'+nombreImagen);

    // Se busca al usuario con el id especificado
    modeloUsuario.findById(id, (err, usuarioBD) => {

        // Si hay un error
        if (err) {

            borrarArchivo(nombreImagen, 'usuarios');

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        // Si no se encontró el usuario en la BD
        if (!usuarioBD) {

            borrarArchivo(nombreImagen, 'usuarios');

            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontró el usuario en la BD',
                err: 'No existe el usuario con ID ' + id
            });
        }

        console.log( '4'+usuarioBD.img );
        borrarArchivo(usuarioBD.img, 'usuarios');

        // Se actualiza el nombre de la imagen en el campo y se graba en la BD
        usuarioBD.img = nombreImagen;
        console.log( '5'+usuarioBD.img );

        usuarioBD.save( (err, imgActualizada) => {
            console.log( '6'+imgActualizada );

            // Se oculta el password
            imgActualizada.password = ':(';

            res.status(200).json({
                ok: true,
                mensaje: 'Imagen actualizada',
                usuario: imgActualizada,
                img: nombreImagen
            });
        });

    });

}

// Método que borra un archivo que ya existe
function borrarArchivo(nombreArchivo, coleccion) {

    // Ruta que posiblemente ya existe
    var pathArchivo = path.resolve(__dirname, `../uploads/${ coleccion }/${ nombreArchivo }`);

    // Si el archivo ya existe (path), se borra para colocar el nuevo archivo
    if (fs.existsSync(pathArchivo)) {
        fs.unlinkSync(pathArchivo);
    }
}

// Se exporta la ruta
module.exports = uploadImg;
