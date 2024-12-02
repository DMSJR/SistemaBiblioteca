
const mdlLivro_autor = require("../model/mdlLivro_autor.js");

const getAutoresPorLivro = (req, res) =>
  (async () => {
    const livroID = parseInt(req.body.livroid);

    // Validação básica
    if (isNaN(livroID)) {
      return res.status(400).json({ status: "error", message: "ID do livro inválido" });
    }

    const { autores, msg } = await mdlLivro_autor.getAutoresPorLivro(livroID);

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

    const { linhasAfetadas, msg } = await mdlLivro_autor.addAutorAoLivro(livroid, autorid);

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

    const { livros, msg } = await mdlLivro_autor.getLivrosPorAutor(autorID);

    if (msg !== "ok") {
      return res.status(500).json({ status: "error", message: msg });
    }

    res.json({ status: "ok", livros });
  })();
  const deleteAutorDoLivro = (req, res) =>
    (async () => {
      const { livroid, autorid } = req.body;
  
      // Validação básica
      if (!livroid || !autorid || isNaN(livroid) || isNaN(autorid)) {
        return res.status(400).json({ status: "error", message: "IDs inválidos" });
      }
  
      const { linhasAfetadas, msg } = await mdlLivro_autor.deleteAutorDoLivro(livroid, autorid);
  
      if (linhasAfetadas <= 0) {
        return res.status(500).json({ status: "error", message: msg });
      }
  
      res.json({ status: "ok", linhasAfetadas });
    })();
  module.exports = {
    getAutoresPorLivro,
    getLivrosPorAutor,
    addAutorAoLivro,
    deleteAutorDoLivro
  };