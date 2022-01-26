const express = require('express');
const app = express();
const conexion = require('./database/db');
var favicon = require('serve-favicon');

app.listen(8888,()=>{
    console.log("Servidor iniciado en http://localhost:8888")
})

app.set('view engine','pug');

app.use('/', require('./router'));

app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(favicon('./public/favicon.ico'));