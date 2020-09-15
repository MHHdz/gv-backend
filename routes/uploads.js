// Importaciones de expres
var express = require('express');
var fileUpload = require('express-fileupload');

// Importación de fileSystem y path
var fs = require('fs');
var path = require('path');

// Se levanta la ruta
var upload = express();

// Se importa los esquemas de las entidades
var modeloUsuario = require('../models/usuario');
var modeloFIRA = require('../models/fira');
var modeloFND = require('../models/fnd');

// Default options - Middleware
upload.use(fileUpload());


// ==========================================================================================
// Subir la documentación de los acreditados
// ==========================================================================================
upload.put('/:fondeador/:id', (request, response) => {

    // Se obtienen los 2 parámetros obligatorios
    var fondeador = request.params.fondeador;
    var id = request.params.id;

    // Si no vienen archivos
    if (!request.files) {
        
        return response.status(400).json({
            ok: false,
            mensaje: 'No se seleccionó ningún archivo',
            errors: { message: 'Debe de seleccionar un archivo' }
        });
    }

    // Validación del fondeador
    var fondeadores = ['FIRA', 'FND', 'usuarios'];

    if (fondeadores.indexOf(fondeador) < 0) {

        return response.status(400).json({
            ok: false,
            err: {
                message: 'Los fondeadores permitidos son: ' + fondeadores.join(', ')
            }
        });
    }

    // Se obtiene el archivo
    var archivos = request.files.archivo; // archivo es el nombre que se manda de Postman

    var nombreDividido = archivos.name.split('.');
    var extension = nombreDividido[ nombreDividido.length - 1 ];
    var extensionValida = 'jpg';

    // Si la extensión del archivo es válida
    if (extension != extensionValida) {

        return response.status(400).json({
            ok: false,
            err: {
                message: 'La extensión permitida de los archivos es .pdf',
                ext: 'Se recibió un .' + extension
            }
        });
    }

    // Se le cambia el nombre al archivo
    var nombreArchivo = `${ id }-${ new Date().getTime() }.${ extension }`;

    // Se mueve el archivo del temporal a un path específico
    var ruta = `./uploads/${ fondeador }/${ nombreArchivo }`;

    archivos.mv( ruta, (err) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        // En este punto, el archivo ya esta cargado

        // Ahora se especifica que colección se quiere actualizar, con un switch
        switch( fondeador ) {

            case 'FIRA':
                archivosFIRA(id, response, nombreArchivo);
                break;
            
            case 'FND':
                archivosFND(id, response, nombreArchivo);
                break;

            // En caso de no encontrar un fondeador válido, retorna un error
            default:
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Los fondeadores actuales son: FIRA y FND',
                    error: { message: 'El fondeador introducido no existe' }
                });
        }
    });
});

// Método para grabar en la colección acreditadosFIRA el nombre del archivo subido
function archivosFIRA(id, response, nombreArchivo) {

    console.log('1' + id);
    console.log('2'+response);
    console.log('3'+nombreArchivo);

    modeloFIRA.findById(id, (err, acreditadoFira) => {

        // Si existe un error
        if ( err ) {

            borrarArchivo(nombreArchivo, 'FIRA');
            
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el acreditado',
                errors: err
            });
        }

        // Se verifica que exista el acreditado
        if (!acreditadoFira) {
            
            borrarArchivo(nombreArchivo, 'FIRA');

            return response.status(400).json({
                ok: false,
                mensaje: 'No se encontró el acreditado en la BD',
                err: 'El acreditado con id:' + id + ' no existe' 
            });
        }

        // Se llama a la función para verificar si la ruta del archivo ya existe, y eliminar el 
        // archivo en caso de que el usuario lo actualice
        console.log( '4'+acreditadoFira.contratoFile );
        borrarArchivo(acreditadoFira.contratoFile, 'FIRA');

        // Se actualiza el nombre del archivo en el campo y se graba en la BD
        acreditadoFira.contratoFile = nombreArchivo;
        console.log( '5'+acreditadoFira.contratoFile );

        acreditadoFira.save( (err, archivoActualizado) => {
            console.log( '6'+archivoActualizado );
            response.json({
                ok: true,
                archivo: archivoActualizado,
                contrato: nombreArchivo
            });
        });

    });
}

// Método para grabar en la colección acreditadosFND el nombre del archivo subido
function archivosFND(id, response, nombreArchivo) {

    modeloFND.findById(id, (err, acreditadoFnd) => {

        // Si existe un error
        if ( err ) {

            borrarArchivo(nombreArchivo, 'FND');
            
            return response.status(500).json({
                ok: false,
                errors: err
            });
        }

        if (!acreditadoFnd) {
            
            borrarArchivo(nombreArchivo, 'FND');

            return response.status(400).json({
                ok: false,
                err: 'El acreditado con id:' + id + ' no existe' 
            });
        }

        borrarArchivo(acreditadoFnd.contratoFile, 'FND');

        acreditadoFnd.contratoFile = nombreArchivo;

        acreditadoFnd.save( (err, archivoActualizado) => {
            response.json({
                ok: true,
                archivo: archivoActualizado,
                contrato: nombreArchivo
            });
        });

    });
}

// Método que borra un archivo que ya existe
function borrarArchivo(nombreArchivo, fondeador) {

    // Ruta que posiblemente ya existe
    var pathArchivo = path.resolve(__dirname, `../uploads/${ fondeador }/${ nombreArchivo }`);

    // Si el archivo ya existe (path), se borra para colocar el nuevo archivo
    if (fs.existsSync(pathArchivo)) {
        fs.unlinkSync(pathArchivo);
    }
}

// Se exporta la ruta
module.exports = upload;
