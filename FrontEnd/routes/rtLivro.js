var express = require('express');
var router = express.Router();
var livroApp = require("../apps/livro/controller/ctlLivro");

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
router.get('/ManutLivro', authenticationMiddleware, livroApp.manutLivro);
router.get('/InsertLivro', authenticationMiddleware, livroApp.insertLivro);
router.get('/viewLivro/:id', authenticationMiddleware, livroApp.ViewLivro);
router.get('/updateLivro/:id', authenticationMiddleware, livroApp.UpdateLivro);
router.get('/addautor/:id', authenticationMiddleware, livroApp.addAutor);

/* POST métodos */
router.post('/InsertLivro', authenticationMiddleware, livroApp.insertLivro);
router.post('/UpdateLivro', authenticationMiddleware, livroApp.UpdateLivro);
router.post('/DeleteLivro', authenticationMiddleware, livroApp.DeleteLivro);
router.post('/addautor', authenticationMiddleware, livroApp.addAutor);
router.post('/deleteAutorDoLivro', authenticationMiddleware, livroApp.deleteAutorDoLivro);

module.exports = router;
