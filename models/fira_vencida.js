// ==========================================================================================
// Modelo para expediente de acreditados FIRA - Cartera Vencida
// ==========================================================================================

// Importación de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator'); // Plugin
const { strict } = require('assert');

// Esquema del acreditado con validaciones

var tiposCredito = {
    values: ['Avio', 'Refaccionario', 'Reestructura Avio', 'Reestructura Refaccionario'],
    message: '{VALUE} no es un rol permitido'
};

var estadosValidos = {
    values: ['Bueno', 'Regular', 'Malo', 'Desconocido'],
    message: '{VALUE} no es un estado válido'
};

var situacionesValidas = {
    values: ['Vigente', 'Vencido', 'Pagado'],
    message: '{VALUE} no es una situación válida'
};

var statusDocumentacion = {
    values: ['Faltante', 'Custodia', 'Préstamo', 'Prórroga', 'Liberado', 'N/A'],
    message: '{VALUE} no es un status válida'
};

var estratosValidos = {
    values: ['Tramo 1', 'Tramo2', 'Tramo 3', 'Tramo 4 - FONAGA-FEGA', 'Cartera Propia'],
    message: '{VALUE} no es un estrato válido'
};

var opcionesDuplicados = {
    values: ['Con duplicados', 'Sin duplicados'],
    message: '{VALUE} no es una opción válida'
};

// Definición del esquema o modelo
var acreditadoFIRAveSchema = new Schema({
    // Campos de la colección: acreditadosFIRAvi
    noAcreditado: { type: Number, unique: true, required: [true, 'Número del acreditado requerido'] },
    noControl: { type: String, unique: true, required: [true, 'Número de control requerido'] },
    sobre: { type: Number, required: [true, 'Número de sobre requerido'] },
    archivero: { type: Number, required: [true, 'Ubicación en archivero requerida'] },
    cajon: { type: String, required: [true, 'Ubicación en cajón requerida'] },
    acreditado: { type: String, required: [true, 'Nombre del acreditado requerido'] },
    monto: { type: Number, required: [true, 'Monto requerido'] },
    tipoCredito: { type: String, required: [true, 'Tipo de crédito requerido'], enum: tiposCredito },
    estadoExpediente: { type: String, required: [true, 'Estado del expediente requerido'], enum: estadosValidos, default: 'Desconocido' },
    situacion: { type: String, required: [true, 'Situación del acreditado requerida'], enum: situacionesValidas, default: 'Vencido' },
    estrato: { type: String, required: [true, 'Estrato requerido'], enum: estratosValidos },
    firma: { type: String, required: [true, 'Fecha de firma requerida'] },
    vencimiento: { type: String, required: [true, 'Fecha de vencimiento requerida'] },

    contratoOriginal: { type: String, required: [true, 'Confirmación del contrato original requerida'], default: 'Faltante', enum: statusDocumentacion },
    noContratoOriginal: { type: Number, required: false },
    copiaContrato: { type: String, required: [true, 'Confirmación de copia del contrato requerida'], default: 'Faltante', enum: statusDocumentacion },
    noCopiaContrato: { type: Number, required: false },
    convenioOriginal: { type: String, required: [true, 'Confirmación del convenio original requerida'], default: 'Faltante', enum: statusDocumentacion },
    noConvenioOriginal: { type: Number, required: false },
    copiaConvenio: { type: String, required: [true, 'Confirmación de copia del convenio requerida'], default: 'Faltante', enum: statusDocumentacion },
    noCopiaConvenio: { type: Number, required: false },
    ratifConvenio: { type: String, required: false },
    pagareOriginal: { type: String, required: [true, 'Confirmación de posesión del pagaré original requerida'], default: 'Faltante', enum: statusDocumentacion },
    noPagareOriginal: { type: String, required: false },
    copiaPagare: { type: String, required: [true, 'Confirmación de copia del pagaré requerida'], default: 'Faltante', enum: statusDocumentacion },
    noCopiaPagare: { type: String, required: false },
    duplicadosPagare: { type: String, required: [true, 'Confirmación de existencia de duplicados requerida'], default: 'Sin duplicados', enum: opcionesDuplicados },
    juegosPagare: { type: Number, required: false },
    tantosPagare: { type: String, required: false },
    endoso: { type: String, required: [true, 'Confirmación de posesión del endoso requerida'], default: 'Faltante', enum: statusDocumentacion },
    noEndoso: { type: Number, required: false },
    recibo: { type: String, required: [true, 'Confirmación de posesión del recibo requerida'], default: 'Faltante', enum: statusDocumentacion },
    noRecibo: { type: Number, required: false },
    ratificacion: { type: String, required: false },
    statusR: { type: String, required: false, default: 'Faltante', enum: statusDocumentacion },
    protocolizacion: { type: String, required: false },
    statusP: { type: String, required: false, default: 'Faltante', enum: statusDocumentacion },
    boleta: { type: String, required: [true, 'Boleta registral requerida'] },
    statusB: { type: String, required: [true, 'Confirmación de posesión de la boleta registral'], default: 'Faltante', enum: statusDocumentacion },
    solicitudCredito: { type: String, required: [true, 'Confirmación de existencia de solicitudes de crédito requerida'], default: 'Faltante', enum: statusDocumentacion },
    noSolicitudes: { type: Number, required: false },
    otraDoc: { type: String, required: false },
    statusOD: { type: String, required: false, default: 'Faltante', enum: statusDocumentacion },
    observaciones: { type: String, required: false },
    
    // Registro del usuario que creó un nuevo expediente de acreditado
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'acreditadosFIRAve' });

acreditadoFIRAveSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

// Se exporta el modelo
module.exports = mongoose.model('FIRAvencida', acreditadoFIRAveSchema);
