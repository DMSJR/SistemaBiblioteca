
const mdlLivro_autor = require("../model/mdlLivro_autor.js");

const getAutoresPorLivro = (req, res) =>
  (async () => {
    const livro_id = parseInt(req.body.livro_id);

    // Validação básica
    if (isNaN(livro_id)) {
      return res.status(400).json({ status: "error", message: "ID do livro inválido" });
    }

    const { autores, msg } = await mdlLivro_autor.getAutoresPorLivro(livro_id);

    if (msg !== "ok") {
      return res.status(500).json({ status: "error", message: msg });
    }

    res.json({ status: "ok", autores });
  })();

// Método para adicionar um autor a um livro
const addAutorAoLivro = (req, res) =>
  (async () => {
    const { livro_id, autor_id } = req.body;

    // Validação básica
    if (!livro_id || !autor_id || isNaN(livro_id) || isNaN(autor_id)) {
      return res.status(400).json({ status: "error", message: "IDs inválidos" });
    }

    const { linhasAfetadas, msg } = await mdlLivro_autor.addAutorAoLivro(livro_id, autor_id);

    if (linhasAfetadas <= 0) {
      return res.status(500).json({ status: "error", message: msg });
    }

    res.json({ status: "ok", linhasAfetadas });
  })();
const getLivrosPorAutor = (req, res) =>
  (async () => {
    const autor_id = parseInt(req.body.autor_id);

    // Validação básica
    if (isNaN(autor_id)) {
      return res.status(400).json({ status: "error", message: "ID do autor inválido" });
    }

    const { livros, msg } = await mdlLivro_autor.getLivrosPorAutor(autor_id);

    if (msg !== "ok") {
      return res.status(500).json({ status: "error", message: msg });
    }

    res.json({ status: "ok", livros });
  })();
  const deleteAutorDoLivro = (req, res) =>
    (async () => {
      const { livro_id, autor_id } = req.body;
  
      // Validação básica
      if (!livro_id || !autor_id || isNaN(livro_id) || isNaN(autor_id)) {
        return res.status(400).json({ status: "error", message: "IDs inválidos" });
      }
  
      const { linhasAfetadas, msg } = await mdlLivro_autor.deleteAutorDoLivro(livro_id, autor_id);
  
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