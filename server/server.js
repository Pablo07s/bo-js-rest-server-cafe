require('./config/config');

// Dependencias
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


// Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Habilitar rutas publicas
app.use( express.static(__dirname + '../public') );

// Obtengo la informacion 
app.use(require ('./routes/index'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
  if(err) throw err;

  console.log('DB ONLINE ON', process.env.NODE_ENV);
});

// Inicializacion del server
app.listen(process.env.PORT, () => {
  console.log('Servidor corriendo en el puerto', process.env.PORT);
});

