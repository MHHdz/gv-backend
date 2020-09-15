// ==========================================================================================
// Modelo para expediente de acreditados FIRA - Cartera Vigente
// ==========================================================================================

// Importación de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator'); // Plugin

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

// Definición del esquema o modelo
var acreditadoFNDviSchema = new Schema({
    // Campos de la colección: acreditadosFND
    noAcreditado: { type: Number, unique: true, required: [true, 'Número del acreditado requerido'] },
    noControl: { type: String, unique: true, required: [true, 'Número de control requerido'] },
    noEFSY: { type: String, unique: true, required: [true, 'Numero de cliente EFSY'] },
    sobre: { type: Number, required: [true, 'Número de sobre requerido'] },
    archivero: { type: Number, required: [true, 'Ubicación en archivero requerida'] },
    cajon: { type: String, required: [true, 'Ubicación en cajón requerida'] },
    acreditado: { type: String, required: [true, 'Nombre del acreditado requerido'] },
    monto: { type: Number, required: [true, 'Monto requerido'] },
    tipoCredito: { type: String, required: [true, 'Tipo de crédito requerido'], enum: tiposCredito },
    situacion: { type: String, required: [true, 'Situación del acreditado requerida'], enum: situacionesValidas },
    firma: { type: String, required: false },
    vencimiento: { type: String, required: false },
    
    estadoExpediente: { type: String, required: false, enum: estadosValidos, default: 'Desconocido' },
    anexoTC: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    contrato: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    ratificacion: { type: String, required: false },
    statusR: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    anotacionesR: { type: String, required: false },
    protocolizacion: { type: String, required: false },
    statusP: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    anotacionesP: { type: String, required: false },
    garantiaRBM: { type: String, required: false },
    statusRBM: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    garantiaRBI: { type: String, required: false },
    statusRBI: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    pagare: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    pagareComentario: { type: String, required: false },
    cesion: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    endoso: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    fega: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    otraDoc: { type: String, required: false },
    statusOD: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    garantias: { type: String, required: false },
    statusG: { type: String, required: false, enum: statusDocumentacion, default: 'Faltante' },
    observaciones: { type: String, required: false },
    
    // Registro del usuario que creó un nuevo expediente de acreditado
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { collection: 'acreditadosFND' });

acreditadoFNDviSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

// Se exporta el modelo
module.exports = mongoose.model('FNDvigente', acreditadoFNDviSchema);
