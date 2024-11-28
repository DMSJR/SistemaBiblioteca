const mdlAutores = require("../model/mdlAutores");

const getAllAutores = (req, res) =>
  (async () => {
    let registro = await mdlAutores.getAllAutores();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i]; // Current row      
      const formattedDate = row.datanasc.toISOString().split('T')[0];
      row.datanasc = formattedDate;
      
    }
    res.json({ status: "ok", "registro": registro });
  })();

const getAutorByID = (req, res) =>
  (async () => {
    const autorID = parseInt(req.body.autorid);
    let registro = await mdlAutores.getAutorByID(autorID);


    res.json({ status: "ok", "registro": registro });
  })();

const insertAutor = (request, res) =>
  (async () => {
    //@ Atenção: aqui já começamos a utilizar a variável msg para retornar erros de banco de dados.
    const autorREG = request.body;
    let { msg, linhasAfetadas } = await mdlAutores.insertAutor(autorREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateAutor = (request, res) =>
  (async () => {
    const autorREG = request.body;
    let { msg, linhasAfetadas } = await mdlAutores.UpdateAutor(autorREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deleteAutor = (request, res) =>
  (async () => {
    const autorREG = request.body;
    let { msg, linhasAfetadas } = await mdlAutores.DeleteAutor(autorREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllAutores,
  getAutorByID,
  insertAutor,
  updateAutor,
  deleteAutor
};
