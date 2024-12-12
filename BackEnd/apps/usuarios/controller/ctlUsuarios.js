const mdlUsuarios = require("../model/mdlUsuarios");

const getAllUsuarios = (req, res) =>
  (async () => {
    let registro = await mdlUsuarios.getAllUsuarios();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i]; // Current row      
      const formattedDate = row.datanasc.toISOString().split('T')[0];
      row.datanasc = formattedDate;
      
    }
    res.json({ status: "ok", "registro": registro });
  })();

const getUsuarioByID = (req, res) =>
  (async () => {
    const usuario_id = parseInt(req.body.usuario_id);
    let registro = await mdlUsuarios.getUsuarioByID(usuario_id);


    res.json({ status: "ok", "registro": registro });
  })();

const insertUsuario = (request, res) =>
  (async () => {
    //@ Atenção: aqui já começamos a utilizar a variável msg para retornar erros de banco de dados.
    const usuarioREG = request.body;
    let { msg, linhasAfetadas } = await mdlUsuarios.insertUsuario(usuarioREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateUsuario = (request, res) =>
  (async () => {
    const usuarioREG = request.body;
    let { msg, linhasAfetadas } = await mdlUsuarios.UpdateUsuario(usuarioREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deleteUsuario = (request, res) =>
  (async () => {
    const usuarioREG = request.body;
    let { msg, linhasAfetadas } = await mdlUsuarios.DeleteUsuario(usuarioREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllUsuarios,
  getUsuarioByID,
  insertUsuario,
  updateUsuario,
  deleteUsuario
};
