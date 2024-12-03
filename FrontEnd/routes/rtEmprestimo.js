var express = require('express');
var router = express.Router();
var emprestimoApp = require("../apps/emprestimo/controller/ctlEmprestimo");

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
router.get('/ManutEmprestimo', authenticationMiddleware, emprestimoApp.manutEmprestimo);
router.get('/InsertEmprestimo', authenticationMiddleware, emprestimoApp.insertEmprestimo);
router.get('/ViewEmprestimo/:id', authenticationMiddleware, emprestimoApp.ViewEmprestimo);
router.get('/UpdateEmprestimo/:id', authenticationMiddleware, emprestimoApp.UpdateEmprestimo);

/* POST métodos */
router.post('/InsertEmprestimo', authenticationMiddleware, emprestimoApp.insertEmprestimo);
router.post('/UpdateEmprestimo', authenticationMiddleware, emprestimoApp.UpdateEmprestimo);
router.post('/DeleteEmprestimo', authenticationMiddleware, emprestimoApp.DeleteEmprestimo);

module.exports = router;
