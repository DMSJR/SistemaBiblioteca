// DEBUG=srvFront:* npm start
var createError = require('http-errors');
var nunjucks = require("nunjucks")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');



const envFilePath = path.resolve(__dirname, './.env');
require('dotenv').config({ path: envFilePath });

const port = process.env.PORT
var rtIndex = require('./routes/rtIndex');
var rtEmprestimo = require('./routes/rtEmprestimo');
var rtUsuario = require('./routes/rtUsuario');

jwtchave = process.env.JWTCHAVE;



var app = express();

nunjucks.configure('apps', {
    autoescape: true,
    express: app,
    watch: true
});

app.use(express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWTCHAVE, 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);


//@ Descreve os grupos de rotas do SIAD
app.use('/', rtIndex);
app.use('/emprestimo', rtEmprestimo);
app.use('/usuario', rtUsuario);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
