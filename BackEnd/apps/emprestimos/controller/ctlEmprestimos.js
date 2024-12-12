const mdlEmprestimos = require("../model/mdlEmprestimos");

const getAllEmprestimos = (req, res) =>
  (async () => {
    let registro = await mdlEmprestimos.getAllEmprestimos();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];     
      const formattedDateEmprestimo = row.data_emprestimo.toISOString().split('T')[0];
      row.data_emprestimo = formattedDateEmprestimo;
      const formattedDateDevolucao = row.data_devolucao.toISOString().split('T')[0];
      row.data_devolucao = formattedDateDevolucao;
    }
    res.json({ status: "ok", registro });
  })();

const getEmprestimoByID = (req, res) =>
  (async () => {
    const emprestimoID = parseInt(req.body.emprestimoid);
    let registro = await mdlEmprestimos.getEmprestimoByID(emprestimoID);
    res.json({ status: "ok", registro });
  })();

const getEmprestimoPorLivro = (req, res) =>
  (async () => {
    const livro_id = parseInt(req.body.livro_id);
    let { emprestimos, msg } = await mdlEmprestimos.getEmprestimoPorLivro(livro_id);
    res.json({ status: msg, emprestimos });
  })();

const getEmprestimoPorUsuario = (req, res) =>
  (async () => {
    const usuarioID = parseInt(req.body.usuarioid);
    let { emprestimos, msg } = await mdlEmprestimos.getEmprestimoPorUsuario(usuarioID);
    res.json({ status: msg, emprestimos });
  })();

const insertEmprestimo = (request, res) =>
  (async () => {
    const emprestimoREG = request.body;
    let { msg, linhasAfetadas } = await mdlEmprestimos.insertEmprestimo(emprestimoREG);
    res.json({ status: msg, linhasAfetadas });
  })();

const updateEmprestimo = (request, res) =>
  (async () => {
    const emprestimoREG = request.body;
    let { msg, linhasAfetadas } = await mdlEmprestimos.UpdateEmprestimo(emprestimoREG);
    res.json({ status: msg, linhasAfetadas });
  })();

const deleteEmprestimo = (request, res) =>
  (async () => {
    const emprestimoREG = request.body;
    let { msg, linhasAfetadas } = await mdlEmprestimos.DeleteEmprestimo(emprestimoREG);
    res.json({ status: msg, linhasAfetadas });
  })();

module.exports = {
  getAllEmprestimos,
  getEmprestimoByID,
  getEmprestimoPorLivro,
  getEmprestimoPorUsuario,
  insertEmprestimo,
  updateEmprestimo,
  deleteEmprestimo,
};
