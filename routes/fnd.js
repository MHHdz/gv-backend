// ==========================================================================================
// CRUD de cartera vigente FND
// ==========================================================================================

// Importación de express
var express = require('express');

// Importación del método de autenticación
var midAutenticacion = require('../middlewares/autenticacion');

// Se levanta la ruta
var rutaFND = express();

// Importación del modelo de Acreditado FIRA Vigente
var AcreditadoFND = require('../models/fnd');

// ==========================================================================================
// Consulta donde se obtienen todos los acreditados vigentes de FND
// ==========================================================================================
rutaFND.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    AcreditadoFND.find({})
        .skip(desde) // Salta un numero de registros
        .limit(10)
        .populate('usuario', 'nombre apellidos email img')
        .exec( (err, acreditados) => {
            
            // Si hay un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los acreditados de FND',
                    errors: err
                });
            }

            // Conteo de registros
            AcreditadoFND.count({}, (err, conteo) => {

                // Si hay un error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar el total de acreditados de FND',
                        errors: err
                    });
                }

                // Regresa un arreglo de todos los usuarios
                res.status(200).json({
                    ok: true,
                    acreditados: acreditados,
                    contador: conteo
                });
            });
        });
});


// ==========================================================================================
// Se crea un nuevo acreditado
// ==========================================================================================
rutaFND.post('/', midAutenticacion.verificarToken, (req, res) => {
    // Todo lo que se mande de un http.post, lo recibe body
    var body = req.body;

    var acreditado = new AcreditadoFND({
        // Se mandan los parámetros respectivos
        noAcreditado: body.noAcreditado,
        noControl: body.noControl,
        noEFSY: body.noEFSY,
        sobre: body.sobre,
        archivero: body.archivero,
        cajon: body.cajon,
        acreditado: body.acreditado,
        monto: body.monto,
        tipoCredito: body.tipoCredito,
        situacion: body.situacion,
        firma: body.firma,
        vencimiento: body.vencimiento,
        
        estadoExpediente: body.estadoExpediente,
        anexoTC: body.anexoTC,
        contrato: body.contrato,
        endoso: body.endoso,
        ratificacion: body.ratificacion,
        statusR: body.statusR,
        anotacionesR: body.anotacionesR,
        protocolizacion: body.protocolizacion,
        statusP: body.statusP,
        anotacionesP: body.anotacionesP,
        garantiaRBM: body.garantiaRBM,
        statusRBM: body.statusRBM,
        garantiaRBI: body.garantiaRBI,
        statusRBI: body.statusRBI,
        pagare: body.pagare,
        pagareComentario: body.pagareComentario,
        cesion: body.cesion,
        fega: body.fega,
        otraDoc: body.otraDoc,
        statusOD: body.statusOD,
        garantias: body.garantias,
        statusG: body.statusG,
        observaciones: body.observaciones,
        
        usuario: req.usuario._id
    });

    // Se guarda el acreditado
    acreditado.save( (err, acreditadoGuardado) => {

        // Si hay un error al crear el nuevo documento o registro
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el nuevo acreditado',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            acreditado: acreditadoGuardado
        });
    });
});


// ==========================================================================================
// Consulta donde se obtiene un acreditado vigente de FND - Por su ID
// ==========================================================================================
rutaFND.get('/:id', (req, res) => {

    var id = req.params.id;

    AcreditadoFND.findById( id )
        .populate('usuario', 'nombre apellidos email img')
        .exec( (err, acredFND) => {

            // Si hay un error al hacer la consulta
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el acreditado',
                    errors: err
                });
            }

            // Si el acreditado no existe
            if (!acredFND) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El acreditado con ID:' + id + ' no existe',
                    errors: { message: 'No existe un acreditado en la BD con ese ID' }
                });
            }

            // Se obtiene la data del acreditado
            res.status(201).json({
                ok: true,
                acreditadoEncontrado: acredFND
            });
        })
});


// ==========================================================================================
// Se actualizan los datos de un acreditado, por medio de su ID
// ==========================================================================================
rutaFND.put('/:id', midAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id; // Se obtiene el id
    var body = req.body;

    // Se comprueba la existencia del acreditado en la BD
    AcreditadoFND.findById( id, (err, acreditadoEncontrado) => {

        // Si hay un error al hacer la consulta
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el acreditado',
                errors: err
            });
        }

        // Si el acreditado no existe
        if (!acreditadoEncontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El acreditado con ID:' + id + ' no existe',
                errors: { message: 'No existe un acreditado en la BD con ese ID' }
            });
        }

        // Se obtiene la data del acreditado

        acreditadoEncontrado.noAcreditado = body.noAcreditado;
        acreditadoEncontrado.noControl = body.noControl;
        acreditadoEncontrado.noEFSY = body.noEFSY;
        acreditadoEncontrado.sobre = body.sobre;
        acreditadoEncontrado.archivero = body.archivero;
        acreditadoEncontrado.cajon = body.cajon;
        acreditadoEncontrado.acreditado = body.acreditado;
        acreditadoEncontrado.monto = body.monto;
        acreditadoEncontrado.tipoCredito = body.tipoCredito;
        acreditadoEncontrado.situacion = body.situacion;
        acreditadoEncontrado.firma = body.firma;
        acreditadoEncontrado.vencimiento = body.vencimiento;
        
        acreditadoEncontrado.estadoExpediente = body.estadoExpediente;
        acreditadoEncontrado.anexoTC = body.anexoTC;
        acreditadoEncontrado.contrato = body.contrato;
        acreditadoEncontrado.endoso = body.endoso;
        acreditadoEncontrado.ratificacion = body.ratificacion;
        acreditadoEncontrado.statusR = body.statusR;
        acreditadoEncontrado.anotacionesR = body.anotacionesR;
        acreditadoEncontrado.protocolizacion = body.protocolizacion;
        acreditadoEncontrado.statusP = body.statusP;
        acreditadoEncontrado.anotacionesP = body.anotacionesP;
        acreditadoEncontrado.garantiaRBM = body.garantiaRBM;
        acreditadoEncontrado.statusRBM = body.statusRBM;
        acreditadoEncontrado.garantiaRBI = body.garantiaRBI;
        acreditadoEncontrado.statusRBI = body.statusRBI;
        acreditadoEncontrado.pagare = body.pagare;
        acreditadoEncontrado.pagareComentario = body.pagareComentario;
        acreditadoEncontrado.cesion = body.cesion;
        acreditadoEncontrado.fega = body.fega;
        acreditadoEncontrado.otraDoc = body.otraDoc;
        acreditadoEncontrado.statusOD = body.statusOD;
        acreditadoEncontrado.garantias = body.garantias;
        acreditadoEncontrado.statusG = body.statusG;
        acreditadoEncontrado.observaciones = body.observaciones;
        
        // Se identifica y actualiza el usuario que modificó al acreditado
        acreditadoEncontrado.usuario = req.usuario._id;


        acreditadoEncontrado.save( (err, acreditadoActualizado) => {

            // Si hay un problema al actualizar los datos
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar los datos del acreditado',
                    errors: err
                });
            }

            // Se actualiza la data del acreditado
            res.status(201).json({
                ok: true,
                acreditadoEncontrado: acreditadoActualizado
            });
        });
    });
});


// ==========================================================================================
// Se elimina un acreditado por medio del ID
// ==========================================================================================
// rutaFND.delete('/:id', midAutenticacion.verificarToken, (req, res) => {

//     var id = req.params.id; // Se obtiene el id

//     // Se comprueba la existencia del acreditado en la BD
//     AcreditadoFND.findByIdAndDelete(id, (err, acreditadoEliminado) => {

//         // Si hay un error al intentar borrar el acreditado
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al eliminar el acreditado',
//                 errors: err
//             });
//         }

//         // Si el acreditado no existe
//         if (!acreditadoEliminado) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'No existe un acreditado con el ID:' + id,
//                 errors: { message: 'No existe un acreditado en la BD con ese ID' }
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             acreditadoBorrado: acreditadoEliminado
//         });
//     });
// });

// Se exporta la ruta
module.exports = rutaFND;
