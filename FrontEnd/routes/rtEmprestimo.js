var express = require('express');
var router = express.Router();
var emprestimoApp = require("../apps/emprestimo/controller/ctlemprestimo");

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    const isLogged = req.session.isLogged;

    if (!isLogged) {
        return res.redirect("/Login"); // Adicionado return para evitar continuar a execução
    }
    next();
}

/* GET métodos */
router.get('/ManutEmprestimo', authenticationMiddleware, emprestimoApp.manutemprestimo);
router.get('/InsertEmprestimo', authenticationMiddleware, emprestimoApp.insertemprestimo);
router.get('/ViewEmprestimo/:id', authenticationMiddleware, emprestimoApp.Viewemprestimo);
router.get('/UpdateEmpretimo/:id', authenticationMiddleware, emprestimoApp.UpdateEmprestimo);

/* POST métodos */
router.post('/Insertemprestimo', authenticationMiddleware, emprestimoApp.insertemprestimo);
router.post('/UpdateEmprestimo', authenticationMiddleware, emprestimoApp.UpdateEmprestimo);
router.post('/DeleteEmprestimo', authenticationMiddleware, emprestimoApp.DeleteEmprestimo);

module.exports = router;
