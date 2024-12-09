const mdlEmprestimos = require("../model/mdlEmprestimos");

const getAllEmprestimos = (req, res) =>
  (async () => {
    try {
      let registro = await mdlEmprestimos.getAllEmprestimos();
      for (let i = 0; i < registro.length; i++) {
        const row = registro[i];
        // Formatar data_emprestimo
        if (row.data_emprestimo) {
          row.data_emprestimo = row.data_emprestimo.toISOString().split('T')[0];
        }
        // Formatar data_devolucao
        if (row.data_devolucao) {
          row.data_devolucao = row.data_devolucao.toISOString().split('T')[0];
        } else {
          row.data_devolucao = null; // Valor padrão caso seja null
        }
      }
      res.json({ status: "ok", registro });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  })();


const getEmprestimoByID = (req, res) =>
  (async () => {
    const emprestimoID = parseInt(req.body.emprestimoid);
    let registro = await mdlEmprestimos.getEmprestimoByID(emprestimoID);
    res.json({ status: "ok", registro });
  })();

const getEmprestimoPorLivro = (req, res) =>
  (async () => {
    const livroID = parseInt(req.body.livroid);
    let { emprestimos, msg } = await mdlEmprestimos.getEmprestimoPorLivro(livroID);
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
