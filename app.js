// ==========================================================================================
// Se inicializa el servidor de express
// ==========================================================================================

// Requires - Importación de librerias para que funcione la aplicación
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const path = require('path');

// Inicializar variables - Uso de la libreria
var app = express();

// Middleware del CORS - Back y Front conectados
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Configuración Body Parser
// parse para application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importación de rutas
var appRoutes = require('./routes/principal');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var firaRoutes = require('./routes/fira');
var firaVeRoutes = require('./routes/fira_vencida');
var fndRoutes = require('./routes/fnd');
var busquedaRoutes = require('./routes/busquedas');
var uploadRoutes = require('./routes/uploads');
var uploadImgRoutes = require('./routes/upload_img');
var fotografiasRoutes = require('./routes/fotografias');

// Conexión a la BD: guardavaloresDB
mongoose.connection.openUri('mongodb://localhost:27017/guardavaloresDB', ( err, response ) => {
    
    if (err) throw err;

    console.log('Base de Datos: \x1b[32m%s\x1b[0m','online');
});


// Definición de Rutas - Middleware
app.use('/usuario', usuarioRoutes);
app.use('/fira', firaRoutes);
app.use('/fira_vencida', firaVeRoutes);
app.use('/fnd', fndRoutes)
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/archivos', uploadRoutes);
app.use('/imagen', uploadImgRoutes);
app.use('/fotografia', fotografiasRoutes);
app.use('/', appRoutes);

// Agregado al final
app.get('*', (req, res) => {
    res.sendFile( path.resolve(__dirname,'public/index.html') );
});

// Escuchar peticiones - express
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});
