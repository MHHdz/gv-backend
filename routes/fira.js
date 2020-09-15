// ==========================================================================================
// CRUD de cartera vigente FIRA
// ==========================================================================================

// Importación de express
var express = require('express');

// Importación del método de autenticación
var midAutenticacion = require('../middlewares/autenticacion');

// Se levanta la ruta
var rutaFIRA = express();

// Importación del modelo de Acreditado FIRA Vigente
var AcreditadoFIRA = require('../models/fira');

// ==========================================================================================
// Petición Get para comprobar que funciona la ruta
// ==========================================================================================
//    (ruta, callback)
// rutaFIRAvi.get('/', (request, response, next) => {
//     response.status(200).json({
//         ok: true,
//         mensaje: 'Petición realizada correctamente - FIRA Vigente'
//     });
// });


// ==========================================================================================
// Consulta donde se obtienen todos los acreditados vigentes FIRA
// ==========================================================================================
rutaFIRA.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    AcreditadoFIRA.find({})
        .skip(desde) // Salta un numero de registros
        .limit(10)
        .populate('usuario', 'nombre apellidos email img')
        .exec(
            (err, acreditados) => {
            
            // Si hay un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los acreditados FIRA de cartera vigente',
                    errors: err
                });
            }

            // Conteo de registros
            AcreditadoFIRA.count({}, (err, conteo) => {

                // Si hay un error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar el total de acreditados del good bank',
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
// Consulta donde se obtiene un acreditado vigente de FIRA - Por su ID
// ==========================================================================================
rutaFIRA.get('/:id', (req, res) => {

    var id = req.params.id;

    AcreditadoFIRA.findById(id)
        .populate('usuario', 'nombre apellidos email img')
        .exec( (err, acredFIRA) => {
            
            // Si hay un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar al acreditado',
                    errors: err
                });
            }

            // Si no se encontró el ID
            if (!acredFIRA) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El acreditado con ID ' + id + ' no existe',
                    errors: { message: 'No existe un acreditado en la BD con ese ID' }
                });
            }

            // Regresa los datos del acreditado con ese ID
            res.status(200).json({
                ok: true,
                acreditadoEncontrado: acredFIRA
            });

          
        });
});


// ==========================================================================================
// Se crea un nuevo acreditado
// ==========================================================================================
rutaFIRA.post('/', midAutenticacion.verificarToken, (req, res) => {
    // Todo lo que se mande de un http.post, lo recibe body
    var body = req.body;

    var acreditado = new AcreditadoFIRA({
        // Se mandan los parámetros respectivos
        noAcreditado: body.noAcreditado,
        noControl: body.noControl,
        sobre: body.sobre,
        archivero: body.archivero,
        cajon: body.cajon,
        acreditado: body.acreditado,
        monto: body.monto,
        tipoCredito: body.tipoCredito,
        estadoExpediente: body.estadoExpediente,
        situacion: body.situacion,
        firma: body.firma,
        vencimiento: body.vencimiento,

        anexoTC: body.anexoTC,
        caratulaC: body.caratulaC,
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
        pagaresComentario: body.pagaresComentario,
        seguro: body.seguro,
        statusS: body.statusS,
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
// Se actualizan los datos de un acreditado, por medio de su ID
// ==========================================================================================
rutaFIRA.put('/:id', midAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id; // Se obtiene el id
    var body = req.body;

    // Se comprueba la existencia del acreditado en la BD
    AcreditadoFIRA.findById( id, (err, acreditadoEncontrado) => {

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
        acreditadoEncontrado.sobre = body.sobre;
        acreditadoEncontrado.archivero = body.archivero;
        acreditadoEncontrado.cajon = body.cajon;
        acreditadoEncontrado.acreditado = body.acreditado;
        acreditadoEncontrado.monto = body.monto;
        acreditadoEncontrado.tipoCredito = body.tipoCredito;
        acreditadoEncontrado.estadoExpediente = body.estadoExpediente;
        acreditadoEncontrado.situacion = body.situacion;
        acreditadoEncontrado.firma = body.firma;
        acreditadoEncontrado.vencimiento = body.vencimiento;

        acreditadoEncontrado.anexoTC = body.anexoTC;
        acreditadoEncontrado.caratulaC = body.caratulaC;
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
        acreditadoEncontrado.pagaresComentario = body.pagaresComentario;
        acreditadoEncontrado.seguro = body.seguro;
        acreditadoEncontrado.statusS = body.statusS;
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
// rutaFIRA.delete('/:id', midAutenticacion.verificarToken, (req, res) => {

//     var id = req.params.id; // Se obtiene el id

//     // Se comprueba la existencia del acreditado en la BD
//     AcreditadoFIRA.findByIdAndDelete(id, (err, acreditadoEliminado) => {

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
module.exports = rutaFIRA;
