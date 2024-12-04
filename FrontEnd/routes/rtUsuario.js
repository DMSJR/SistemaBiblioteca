var express = require('express');
var router = express.Router();
var usuarioApp = require("../apps/usuario/controller/ctlUsuario");

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;

    if (!isLogged) {
        return res.redirect("/Login"); // Adicionado return para evitar continuar a execução
    }
    next();
}

/* GET métodos */
router.get('/ManutUsuario', authenticationMiddleware, usuarioApp.manutUsuario);
router.get('/InsertUsuario', authenticationMiddleware, usuarioApp.insertUsuario);
router.get('/ViewUsuario/:id', authenticationMiddleware, usuarioApp.ViewUsuario);
router.get('/UpdateUsuario/:id', authenticationMiddleware, usuarioApp.UpdateUsuario);

/* POST métodos */
router.post('/InsertUsuario', authenticationMiddleware, usuarioApp.insertUsuario);
router.post('/UpdateUsuario', authenticationMiddleware, usuarioApp.UpdateUsuario);
router.post('/DeleteUsuario', authenticationMiddleware, usuarioApp.DeleteUsuario);

module.exports = router;
