// ==========================================================================================
// CRUD de cartera vencida FIRA
// ==========================================================================================

// Importación de express
var express = require('express');

// Importación del método de autenticación
var midAutenticacion = require('../middlewares/autenticacion');

// Se levanta la ruta
var rutaFIRAve = express();

// Importación del modelo de Acreditado FIRA Vigente
var AcreditadoFIRAve = require('../models/fira_vencida');

// ==========================================================================================
// Consulta donde se obtienen todos los acreditados vencidos FIRA
// ==========================================================================================
rutaFIRAve.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    AcreditadoFIRAve.find({})
        .skip(desde) // Salta un numero de registros
        .limit(10)
        .populate('usuario', 'nombre apellidos email img')
        .exec(
            (err, acreditados) => {
            
            // Si hay un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los acreditados FIRA de cartera vencida',
                    errors: err
                });
            }

            // Conteo de registros
            AcreditadoFIRAve.count({}, (err, conteo) => {

                // Si hay un error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar el total de acreditados del bad bank',
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
// Consulta donde se obtiene un acreditado vencido de FIRA - Por su ID
// ==========================================================================================
rutaFIRAve.get('/:id', (req, res) => {

    var id = req.params.id;

    AcreditadoFIRAve.findById(id)
        .populate('usuario', 'nombre apellidos email img')
        .exec( (err, acredFIRAv) => {
            
            // Si hay un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar al acreditado',
                    errors: err
                });
            }

            // Si no se encontró el ID
            if (!acredFIRAv) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El acreditado con ID ' + id + ' no existe',
                    errors: { message: 'No existe un acreditado en la BD con ese ID' }
                });
            }

            // Regresa los datos del acreditado con ese ID
            res.status(200).json({
                ok: true,
                acreditadoEncontrado: acredFIRAv
            });

          
        });
});


// ==========================================================================================
// Se crea un nuevo acreditado
// ==========================================================================================
rutaFIRAve.post('/', midAutenticacion.verificarToken, (req, res) => {
    // Todo lo que se mande de un http.post, lo recibe body
    var body = req.body;

    var acreditado = new AcreditadoFIRAve({
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
        estrato: body.estrato,
        firma: body.firma,
        vencimiento: body.vencimiento,

        contratoOriginal: body.contratoOriginal,
        noContratoOriginal: body.noContratoOriginal,
        copiaContrato: body.copiaContrato,
        noCopiaContrato: body.noCopiaContrato,
        convenioOriginal: body.convenioOriginal,
        noConvenioOriginal: body.noConvenioOriginal,
        copiaConvenio: body.copiaConvenio,
        noCopiaConvenio: body.noCopiaConvenio,
        ratifConvenio: body.ratifConvenio,
        pagareOriginal: body.pagareOriginal,
        noPagareOriginal: body.noPagareOriginal,
        copiaPagare: body.copiaPagare,
        noCopiaPagare: body.noCopiaPagare,
        duplicadosPagare: body.duplicadosPagare,
        juegosPagare: body.juegosPagare,
        tantosPagare: body.tantosPagare,
        endoso: body.endoso,
        noEndoso: body.noEndoso,
        recibo: body.recibo,
        noRecibo: body.noRecibo,
        ratificacion: body.ratificacion,
        statusR: body.statusR,
        protocolizacion: body.protocolizacion,
        statusP: body.statusP,
        boleta: body.boleta,
        statusB: body.statusB,
        solicitudCredito: body.solicitudCredito,
        noSolicitudes: body.noSolicitudes,
        otraDoc: body.otraDoc,
        statusOD: body.statusOD,
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
rutaFIRAve.put('/:id', midAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id; // Se obtiene el id
    var body = req.body;

    // Se comprueba la existencia del acreditado en la BD
    AcreditadoFIRAve.findById( id, (err, acreditadoEncontrado) => {

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
        acreditadoEncontrado.estrato = body.estrato;
        acreditadoEncontrado.firma = body.firma;
        acreditadoEncontrado.vencimiento = body.vencimiento;

        acreditadoEncontrado.contratoOriginal = body.contratoOriginal;
        acreditadoEncontrado.noContratoOriginal = body.noContratoOriginal;
        acreditadoEncontrado.copiaContrato = body.copiaContrato;
        acreditadoEncontrado.noCopiaContrato = body.noCopiaContrato;
        acreditadoEncontrado.convenioOriginal = body.convenioOriginal;
        acreditadoEncontrado.noConvenioOriginal = body.noConvenioOriginal;
        acreditadoEncontrado.copiaConvenio = body.copiaConvenio;
        acreditadoEncontrado.noCopiaConvenio = body.noCopiaConvenio;
        acreditadoEncontrado.ratifConvenio = body.ratifConvenio;
        acreditadoEncontrado.pagareOriginal = body.pagareOriginal;
        acreditadoEncontrado.noPagareOriginal = body.noPagareOriginal;
        acreditadoEncontrado.copiaPagare = body.copiaPagare;
        acreditadoEncontrado.noCopiaPagare = body.noCopiaPagare;
        acreditadoEncontrado.duplicadosPagare = body.duplicadosPagare;
        acreditadoEncontrado.juegosPagare = body.juegosPagare;
        acreditadoEncontrado.tantosPagare = body.tantosPagare;
        acreditadoEncontrado.endoso = body.endoso;
        acreditadoEncontrado.noEndoso = body.noEndoso;
        acreditadoEncontrado.recibo = body.recibo;
        acreditadoEncontrado.noRecibo = body.noRecibo;
        acreditadoEncontrado.ratificacion = body.ratificacion;
        acreditadoEncontrado.statusR = body.statusR;
        acreditadoEncontrado.protocolizacion = body.protocolizacion;
        acreditadoEncontrado.statusP = body.statusP;
        acreditadoEncontrado.boleta = body.boleta;
        acreditadoEncontrado.statusB = body.statusB;
        acreditadoEncontrado.solicitudCredito = body.solicitudCredito;
        acreditadoEncontrado.noSolicitudes = body.noSolicitudes;
        acreditadoEncontrado.otraDoc = body.otraDoc;
        acreditadoEncontrado.statusOD = body.statusOD
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
rutaFIRAve.delete('/:id', midAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id; // Se obtiene el id

    // Se comprueba la existencia del acreditado en la BD
    AcreditadoFIRAve.findByIdAndDelete(id, (err, acreditadoEliminado) => {

        // Si hay un error al intentar borrar el acreditado
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el acreditado',
                errors: err
            });
        }

        // Si el acreditado no existe
        if (!acreditadoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un acreditado con el ID:' + id,
                errors: { message: 'No existe un acreditado en la BD con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            acreditadoBorrado: acreditadoEliminado
        });
    });
});




// Se exporta la ruta
module.exports = rutaFIRAve;