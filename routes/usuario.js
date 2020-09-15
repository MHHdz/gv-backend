// Importación de librerias
var express = require('express');
var bcrypt = require('bcryptjs');

// Importación del método
var midAutenticacion = require('../middlewares/autenticacion');


// Se levanta la ruta
var rutaUsuario = express();

// Importación del modelo de Usuario
var Usuario = require('../models/usuario');

// ==========================================================================================
// Consulta donde se obtienen todos los usuarios, sin mostrar el password
// ==========================================================================================
rutaUsuario.get('/', (req, res, next) => {

    // Parametro opcional: si no viene nada, usa el cero
    var desde = req.query.desde || 0;
    
    // Se harcodea para que sea un numero
    desde = Number(desde);

    Usuario.find({}, 'nombre apellidos email img rol')
        .skip(desde) // Salta un numero de registros
        .limit(5)
        .exec(
            (err, usuarios) => {
            
            // Si hay un error
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los usuarios',
                    errors: err
                });
            }

            // Conteo de registros
            Usuario.count({}, (err, conteo) => {

                // Si hay un error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar el numero de usuarios',
                        errors: err
                    });
                }

                // Regresa un arreglo de todos los usuarios
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    contador: conteo
                });
            });
        });
});


// ==========================================================================================
// Se crea un nuevo usuario
// ==========================================================================================
rutaUsuario.post('/', (req, res) => {
    // Todo lo que se mande de un http.post, lo recibe body
    var body = req.body;

    var usuario = new Usuario({
        // Se mandan los parámetros respectivos
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // Encriptación de una sola vía
        img: body.img,
        rol: body.rol
    });

    // Se guarda el usuario
    usuario.save( (err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el nuevo usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioAutorizado: req.usuario // Info. del usuario que ejecutó la petición
        });
    });
});


// ==========================================================================================
// Consulta donde se obtiene un acreditado vigente de FND - Por su ID
// ==========================================================================================
rutaUsuario.get('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findById( id )
        .populate('usuario', 'nombre apellidos email img')
        .exec( (err, us) => {

            // Si hay un error al hacer la consulta
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al estar buscando al usuario',
                    errors: err
                });
            }

            // Si el acreditado no existe
            if (!us) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con ID:' + id + ' no existe',
                    errors: { message: 'No existe un usuario en la BD con ese ID' }
                });
            }

            // Se obtiene la data del acreditado
            res.status(201).json({
                ok: true,
                usuarioEncontrado: us
            });
        })
});


// ==========================================================================================
// Se actualiza un usuario usando el ID
// ==========================================================================================
rutaUsuario.put('/:id', midAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id; // Se obtiene el id
    var body = req.body;

    // Se verifica la existencia del usuario
    Usuario.findById( id, (err, usuarioEncontrado) => {

        // Si hay un error al hacer la consulta
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        // Si el usuario no existe
        if (!usuarioEncontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con ID:' + id + ' no existe',
                errors: { message: 'No existe un usuario en la BD con ese ID' }
            });
        }

        // Se obtiene la data del usuario
        usuarioEncontrado.nombre = body.nombre;
        usuarioEncontrado.apellidos = body.apellidos;
        usuarioEncontrado.password = bcrypt.hashSync(body.password, 10); // Encriptación de una sola vía;
        usuarioEncontrado.email = body.email;
        usuarioEncontrado.rol = body.rol;

        usuarioEncontrado.save( (err, usuarioActualizado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            usuarioActualizado.password = ':(';

            res.status(201).json({
                ok: true,
                usuarioEncontrado: usuarioActualizado
            });
        });
    });
});


// ==========================================================================================
// Se elimina un usuario usando el ID
// ==========================================================================================
rutaUsuario.delete('/:id', midAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id; // Se obtiene el id

    Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el usuario',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con el ID:' + id,
                errors: { message: 'No existe un usuario en la BD con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });
    });
});

// Se exporta la ruta
module.exports = rutaUsuario;
