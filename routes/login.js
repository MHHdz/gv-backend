// Librerias
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Constante
var SEED = require('../config/config').SEED;

var rutaLogin = express();
var Usuario = require('../models/usuario');

rutaLogin.post('/', (req, res) => {
    // La petición http.post lo recibe body
    var body = req.body;

    // Se verifica que exista un usuario con el correo electrónico introducido
    Usuario.findOne({ email: body.email}, (err, usuarioLocalizado) => {

        // Si hay un error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error durante el proceso de búsqueda del usuario',
                errors: err
            });
        }

        // Si no existe el usuario con el correo electrónico introducido
        if (!usuarioLocalizado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese correo electrónico',
                errors: err
            });
        }

        // Si existe el usuario, se verifica la contraseña - regresa un booleano
        if (!bcrypt.compareSync( body.password, usuarioLocalizado.password )) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La contraseña del usuario es incorrecta',
                errors: err
            });
        }

        // Si hay un match del correo y el password, se crea un token
        usuarioLocalizado.password = 'Hi'; // Se evita mandar el password en el token
        //                          Payload,        Seed,   vigencia: 4 hora
        var token = jwt.sign({ usuario: usuarioLocalizado }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: usuarioLocalizado,
            token: token,
            id: usuarioLocalizado._id
        });
    });
});



module.exports = rutaLogin;