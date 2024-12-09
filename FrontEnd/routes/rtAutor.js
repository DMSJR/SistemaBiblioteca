var express = require('express');
var router = express.Router();
var autorApp = require("../apps/autor/controller/ctlAutor");

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
router.get('/ManutAutor', authenticationMiddleware, autorApp.manutAutor);
router.get('/InsertAutor', authenticationMiddleware, autorApp.insertAutor);
router.get('/ViewAutor/:id', authenticationMiddleware, autorApp.ViewAutor);
router.get('/UpdateAutor/:id', authenticationMiddleware, autorApp.UpdateAutor);

/* POST métodos */
router.post('/InsertAutor', authenticationMiddleware, autorApp.insertAutor);
router.post('/UpdateAutor', authenticationMiddleware, autorApp.UpdateAutor);
router.post('/DeleteAutor', authenticationMiddleware, autorApp.DeleteAutor);

module.exports = router;
