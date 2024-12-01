const mdlLivros = require("../model/mdlLivros");

const getAllLivros = (req, res) =>
  (async () => {
    let registro = await mdlLivros.getAllLivros();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i]; // Current row      
      const formattedDate = row.data_publicacao.toISOString().split('T')[0];
      row.data_publicacao = formattedDate;

    }
    res.json({ status: "ok", "registro": registro });
  })();

const getLivroByID = (req, res) =>
  (async () => {
    const livroID = parseInt(req.body.livroid);
    let registro = await mdlLivros.getLivroByID(livroID);


    res.json({ status: "ok", "registro": registro });
  })();

const insertLivro = (request, res) =>
  (async () => {
    //@ Atenção: aqui já começamos a utilizar a variável msg para retornar erros de banco de dados.
    const livroREG = request.body;
    let { msg, linhasAfetadas } = await mdlLivros.insertLivro(livroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateLivro = (request, res) =>
  (async () => {
    const livroREG = request.body;
    let { msg, linhasAfetadas } = await mdlLivros.UpdateLivro(livroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deleteLivro = (request, res) =>
  (async () => {
    const livroREG = request.body;
    let { msg, linhasAfetadas } = await mdlLivros.DeleteLivro(livroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();
const getAutoresPorLivro = (req, res) =>
  (async () => {
    const livroID = parseInt(req.body.livroid);

    // Validação básica
    if (isNaN(livroID)) {
      return res.status(400).json({ status: "error", message: "ID do livro inválido" });
    }

    const { autores, msg } = await mdlLivros.getAutoresPorLivro(livroID);

    if (msg !== "ok") {
      return res.status(500).json({ status: "error", message: msg });
    }

    res.json({ status: "ok", autores });
  })();

// Método para adicionar um autor a um livro
const addAutorAoLivro = (req, res) =>
  (async () => {
    const { livroid, autorid } = req.body;

    // Validação básica
    if (!livroid || !autorid || isNaN(livroid) || isNaN(autorid)) {
      return res.status(400).json({ status: "error", message: "IDs inválidos" });
    }

    const { linhasAfetadas, msg } = await mdlLivros.addAutorAoLivro(livroid, autorid);

    if (linhasAfetadas <= 0) {
      return res.status(500).json({ status: "error", message: msg });
    }

    res.json({ status: "ok", linhasAfetadas });
  })();
const getLivrosPorAutor = (req, res) =>
  (async () => {
    const autorID = parseInt(req.body.autorid);

    // Validação básica
    if (isNaN(autorID)) {
      return res.status(400).json({ status: "error", message: "ID do autor inválido" });
    }

    const { livros, msg } = await mdlLivros.getLivrosPorAutor(autorID);

    if (msg !== "ok") {
      return res.status(500).json({ status: "error", message: msg });
    }

    res.json({ status: "ok", livros });
  })();
module.exports = {
  getAllLivros,
  getLivroByID,
  insertLivro,
  updateLivro,
  deleteLivro,
  getAutoresPorLivro,
  getLivrosPorAutor,
  addAutorAoLivro
};
