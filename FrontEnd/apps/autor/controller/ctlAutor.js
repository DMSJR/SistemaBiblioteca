const axios = require("axios");
const moment = require("moment");




const manutAutor = async (req, res) =>
 (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllAutor", {
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
      res.render("autor/view/vwManutAutor.njk", {
        title: "Manutenção de Autor",
        data: null,
        erro: remoteMSG, 
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }

    res.render("autor/view/vwManutAutor.njk", {
        title: "Manutenção de autor",
        data: resp.data.registro,
        erro: null,
        userName: userName,
      });
    })();



    const insertAutor = async (req, res) =>
    (async () => {
      if (req.method == "GET") {
        const token = req.session.token;
  
       
  
        return res.render("autor/view/vwFCrAutor.njk", {
          title: "Cadastro de autor",
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
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertAutor", regData, {
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
  

    const ViewAutor = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetAutorByID",
          {
            autorid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          const autor = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllAutor", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          res.render("autor/view/vwFRUDrAutor.njk", {
            title: "Visualização de autor",
            data: response.data.autor[0],
            disabled: true,
            autor: autor.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlAutor|ViewAutor] ID de autor não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlAutor.js|ViewAutor] autor não localizado!" });
      console.log(
        "[ctlAutor.js|ViewAutor] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

  const UpdateAutor = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetAutorByID",
          {
            autorid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {

          response.data.registro[0].dataautor = moment(response.data.registro[0].dataautor).format(
            "YYYY-MM-DD"
          );

          response.data.registro[0].datadevolucao = moment(response.data.registro[0].datadevolucao).format(
            "YYYY-MM-DD"
          );

          res.render("autor/view/vwFRUDrAutor.njk", {
            title: "Atualização de dados de autor",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlAutor|UpdateAutor] Dados não localizados");
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateAutor", regData, {
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
          console.error('[ctlAutor.js|UpdateAutor] Erro ao atualizar dados de autor no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlAutor.js|UpdateAutor] Autor não localizada!" });
      console.log(
        "[ctlAutor.js|UpdateAutor] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteAutor = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteAutor", regData, {
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
  manutAutor,
  insertAutor,
  ViewAutor,
  UpdateAutor,
  DeleteAutor
};