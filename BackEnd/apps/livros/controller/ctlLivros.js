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
    console.log("Corpo da requisição:", req.body); 
    const livroID = parseInt(req.body.livroid);
    
    let registro = await mdlLivros.getLivroByID(livroID);
    console.log("Livro encontrado:", registro);

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

module.exports = {
  getAllLivros,
  getLivroByID,
  insertLivro,
  updateLivro,
  deleteLivro
};
