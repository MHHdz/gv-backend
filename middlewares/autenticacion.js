// Librerias
var jwt = require('jsonwebtoken');

// Constante
var SEED = require('../config/config').SEED;

// ==========================================================================================
// Middleware para verificar el token
// ==========================================================================================

// Se exporta el método verificarToken
exports.verificarToken = function(req, res, next) {

    // Almacena el token de la petición
    var token = req.query.token;

    // Comprobación del token
    jwt.verify( token, SEED, (err, decoded) => {

        // Si hay un error
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'El token no es válido',
                errors: err
            });
        }

        // Se extrae de decoded y se almacena la información del usuario que hizo la petición en el
        // request. Dicha información esta disponible en cualquier petición
        req.usuario = decoded.usuario;

        // Se continúa con los métodos de petición: post, put y delete
        next();
    });
}
    