// ==========================================================================================
// Modelo para usuarios del sistema GV
// ==========================================================================================

// Importación de mongoose
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); // Plugin

// Esquema del usuario con validaciones

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['Administrador', 'Guardavalores', 'Usuario'],
    message: '{VALUE} no es un rol permitido'
};

// Definición del esquema o modelo
usuarioSchema = new Schema({
    // Campos de la colección: usuarios
    nombre: { type: String, required: [true, 'Nombre es requerido'] },
    apellidos: { type: String, required: [true, 'Apellidos requeridos'] },
    email: { type: String, unique: true, required: [true, 'Introduce un correo electrónico'] },
    password: { type: String, required: [true, 'Coloca una contraseña'] },
    img: { type: String, required: false },
    rol: { type: String, required: true, default: 'Usuario', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

// Se exporta el modelo
module.exports = mongoose.model('Usuario', usuarioSchema);
