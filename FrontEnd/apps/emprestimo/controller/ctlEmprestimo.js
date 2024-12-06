const axios = require("axios");
const moment = require("moment");




const manutEmprestimo = async (req, res) =>
 (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllEmprestimos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      }
    }).catch(error => {
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível"

      } else if (error.code === "ERR_BAD_REQUEST") {
        remoteMSG = "Usuário não autenticado";

      } else {
        remoteMSG = error;
      }
      res.render("emprestimo/view/vwManutEmprestimo.njk", {
        title: "Manutenção de Emprestimo",
        data: null,
        erro: remoteMSG, 
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }

    res.render("emprestimo/view/vwManutEmprestimo.njk", {
        title: "Manutenção de emprestimo",
        data: resp.data.registro,
        erro: null,
        userName: userName,
      });
    })();



    const insertEmprestimo = async (req, res) =>
    (async () => {
      if (req.method == "GET") {
        const token = req.session.token;
  
       
  
        return res.render("emprestimo/view/vwFCrEmprestimo.njk", {
          title: "Cadastro de emprestimo",
          data: null,
          erro: null, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
          userName: req.session.userName,
        });
  
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
  
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertEmprestimo", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000, // @ 5 segundos de timeout
          });
  
          //console.log('[ctlAlunos|InsertAlunos] Dados retornados:', response.data);
  
          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          console.error('Erro ao inserir dados no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    })();
  

    const ViewEmprestimo = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetEmprestimoByID",
          {
            emprestimoid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          const emprestimo = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllEmprestimos", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].dataemprestimo = moment(response.data.registro[0].dataemprestimo).format(
            "YYYY-MM-DD");

          response.data.registro[0].datadevolucao = moment(response.data.registro[0].datadevolucao).format(
            "YYYY-MM-DD");

          res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
            title: "Visualização de emprestimo",
            data: response.data.emprestimo[0],
            disabled: true,
            emprestimo: emprestimo.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlEmprestimo|ViewEmprestimo] ID de emprestimo não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlEmprestimo.js|ViewEmprestimo] emprestimo não localizado!" });
      console.log(
        "[ctlEmprestimo.js|ViewEmprestimo] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

  const UpdateEmprestimo = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetEmprestimoByID",
          {
            emprestimoid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {

          response.data.registro[0].dataemprestimo = moment(response.data.registro[0].dataemprestimo).format(
            "YYYY-MM-DD"
          );

          response.data.registro[0].datadevolucao = moment(response.data.registro[0].datadevolucao).format(
            "YYYY-MM-DD"
          );

          res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
            title: "Atualização de dados de emprestimo",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlEmprestimo|UpdateEmprestimo] Dados não localizados");
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateEmprestimo", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000, // @ 5 segundos de timeout
          });

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          console.error('[ctlEmprestimo.js|UpdateEmprestimo] Erro ao atualizar dados de emprestimo no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlEmprestimo.js|UpdateEmprestimo] Emprestimo não localizada!" });
      console.log(
        "[ctlEmprestimo.js|UpdateEmprestimo] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteEmprestimo = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteEmprestimo", regData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        timeout: 5000,
      });

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error('Erro na conexão:', error.response?.data || error.message);
      const erroMsg = error.response?.data || error.message;
      res.json({
        status: "Error",
        msg: "Falha ao conectar ao servidor backend",
        data: null,
        erro: erroMsg,
      });
    }
  })();

module.exports = {
  manutEmprestimo,
  insertEmprestimo,
  ViewEmprestimo,
  UpdateEmprestimo,
  DeleteEmprestimo
};
