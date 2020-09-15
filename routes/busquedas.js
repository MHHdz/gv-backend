// Importación de express
var express = require('express');

// Se levanta la ruta
var buscar = express();

// Se importan los modelos
var FIRA = require('../models/fira');
var FIRAve = require('../models/fira_vencida');
var FND = require('../models/fnd');
var Usuario = require('../models/usuario');

// ==========================================================================================
// Búsquedas por colección
// ==========================================================================================
buscar.get('/coleccion/:conjunto/:busqueda', (request, response) => {

    // Se obtiene la colección y el valor buscado
    var conjunto = request.params.conjunto;
    var busqueda = request.params.busqueda;
    var promesa; // Guardará la promesa a ejecutar, dependiendo del case.
    var regularExp = new RegExp( busqueda, 'i' );

    switch( conjunto ) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regularExp);
            break;
        
        case 'acreditadosFIRA':
            promesa = buscarAcreditadosFIRA(busqueda, regularExp);
            break;

        case 'acreditadosFIRAve':
            promesa = buscarAcreditadosFIRAve(busqueda, regularExp);
            break;

        case 'acreditadosFND':
            promesa = buscarAcreditadosFND(busqueda, regularExp);
            break;
        
        // En caso de no encontrar la colección, retorna un error

        default:
            return response.status(400).json({
                ok: false,
                mensaje: 'Colecciones de búsqueda disponible son: usuarios, acreditadosFIRA, acreditadosFIRAve y acreditadosFND',
                error: { message: 'La colección introducida no existe' }
            });
    }

    // Se recibe la data resultante de la búsqueda.
    promesa.then( data => {

        response.status(200).json({
            ok: true,
            [conjunto]: data
        });
    });


});



// ==========================================================================================
// Búsqueda general
// ==========================================================================================
buscar.get('/todo/:busqueda', (request, response, next) => {

    // Se extrae el parámetro de búsqueda
    var busqueda = request.params.busqueda;
    var regularExp = new RegExp( busqueda, 'i' ); // Insensible a mayúsculas

    // Arreglo de promesas que se pueden ejecutar y disparar un then
    Promise.all( [
            buscarAcreditadosFIRA(busqueda, regularExp),
            buscarAcreditadosFIRAve(busqueda,regularExp),
            buscarAcreditadosFND(busqueda, regularExp),
            buscarUsuarios(busqueda,regularExp) ])
        .then(registros => {

            response.status(200).json({
                ok: true,
                acreditadosFIRA: registros[0],
                acreditadosFIRAve: registros[1],
                acreditadosFND: registros[2],
                usuarios: registros[3]
            });
        });
});

// ==========================================================================================
// Procesos asíncronos de búsqueda en todas las colecciones - Promesas
// ==========================================================================================
function buscarAcreditadosFIRA( busqueda, regularExp ){

    return new Promise( (resolve, reject) => {

        FIRA.find({})
            .or([ {'acreditado': regularExp}, {'noControl': regularExp} ])
            .populate('usuario', 'nombre apaterno email')
            .exec((err, acreditados) => {
            
                if( err ) {
                    reject('Error al cargar los acreditados de Cartera Vigente FIRA', err);
                } else {
                    resolve(acreditados);
                }

            });
    });
}

function buscarAcreditadosFIRAve( busqueda, regularExp ){

    return new Promise( (resolve, reject) => {

        FIRAve.find({})
            .or([ {'acreditado': regularExp}, {'noControl': regularExp} ])
            .populate('usuario', 'nombre apaterno email')
            .exec((err, acreditados) => {
            
                if( err ) {
                    reject('Error al cargar los acreditados de Cartera Vencida FIRA', err);
                } else {
                    resolve(acreditados);
                }

            });
    });
}

function buscarAcreditadosFND( busqueda, regularExp ){

    return new Promise( (resolve, reject) => {

        FND.find({})
            .or([ {'acreditado': regularExp}, {'noControl': regularExp} ])
            .populate('usuario', 'nombre apaterno email')
            .exec((err, acreditados) => {
            
                if( err ) {
                    reject('Error al cargar los acreditados de FND', err);
                } else {
                    resolve(acreditados);
                }

            });
    });
}

function buscarUsuarios( busqueda, regularExp ){

    return new Promise( (resolve, reject) => {

        Usuario.find({}, 'nombre apaterno amaterno email rol')
                .or([ {'nombre': regularExp}, {'email': regularExp} ]) // Arreglo de condiciones
                .exec( (err, usuarios) => {

                    if( err ) {
                        reject('Error al cargar los usuarios', err);
                    } else {
                        resolve(usuarios);
                    }
                });
    });
}

// Se exporta la ruta
module.exports = buscar;
