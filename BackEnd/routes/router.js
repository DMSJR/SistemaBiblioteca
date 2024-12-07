const express = require("express");
const routerApp = express.Router();

const appUsuarios = require("../apps/usuarios/controller/ctlUsuarios");
const appLivros = require("../apps/livros/controller/ctlLivros");
const appAutores = require("../apps/autores/controller/ctlAutores");
const appEmprestimos = require("../apps/emprestimos/controller/ctlEmprestimos");

const appLivro_autor = require("../apps/livro_autor/controller/ctlLivro_autor");

const appLogin = require("../apps/login/controller/ctlLogin");




// middleware that is specific to this router
routerApp.use((req, res, next) => {
  next();
});



//Rotas de Usuarios
routerApp.get("/getAllUsuarios", appLogin.AutenticaJWT, appUsuarios.getAllUsuarios);
routerApp.post("/getUsuarioByID", appLogin.AutenticaJWT, appUsuarios.getUsuarioByID);
routerApp.post("/insertUsuario", appLogin.AutenticaJWT, appUsuarios.insertUsuario);
routerApp.post("/updateUsuario", appLogin.AutenticaJWT, appUsuarios.updateUsuario);
routerApp.post("/DeleteUsuario", appLogin.AutenticaJWT, appUsuarios.deleteUsuario);

//Rotas de Livros
routerApp.get("/getAllLivros", appLogin.AutenticaJWT, appLivros.getAllLivros);
routerApp.get("/getLivroByID", appLogin.AutenticaJWT, appLivros.getLivroByID);
routerApp.post("/insertLivro", appLogin.AutenticaJWT, appLivros.insertLivro);
routerApp.post("/updateLivro", appLogin.AutenticaJWT, appLivros.updateLivro);
routerApp.post("/DeleteLivro", appLogin.AutenticaJWT, appLivros.deleteLivro);




//Rotas de Autores
routerApp.get("/getAllAutores", appLogin.AutenticaJWT, appAutores.getAllAutores);
routerApp.get("/getAutorByID", appLogin.AutenticaJWT, appAutores.getAutorByID);
routerApp.post("/insertAutor", appLogin.AutenticaJWT, appAutores.insertAutor);
routerApp.post("/updateAutor", appLogin.AutenticaJWT, appAutores.updateAutor);
routerApp.post("/DeleteAutor", appLogin.AutenticaJWT, appAutores.deleteAutor);


//Rotas de Emprestimos
routerApp.get("/getAllEmprestimos", appLogin.AutenticaJWT, appEmprestimos.getAllEmprestimos);
routerApp.get("/getEmprestimoByID", appLogin.AutenticaJWT, appEmprestimos.getEmprestimoByID);
routerApp.post("/insertEmprestimo", appLogin.AutenticaJWT, appEmprestimos.insertEmprestimo);
routerApp.post("/updateEmprestimo", appLogin.AutenticaJWT, appEmprestimos.updateEmprestimo);
routerApp.post("/DeleteEmprestimo", appLogin.AutenticaJWT, appEmprestimos.deleteEmprestimo);


// Rota Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

// Rota livro_autor
routerApp.post("/addAutorAoLivro", appLogin.AutenticaJWT, appLivro_autor.addAutorAoLivro);
routerApp.get("/getAutoresPorLivro", appLogin.AutenticaJWT, appLivro_autor.getAutoresPorLivro);
routerApp.get("/getLivrosPorAutor", appLogin.AutenticaJWT, appLivro_autor.getLivrosPorAutor);
routerApp.post("/deleteAutorDoLivro", appLogin.AutenticaJWT, appLivro_autor.deleteAutorDoLivro);


module.exports = routerApp;