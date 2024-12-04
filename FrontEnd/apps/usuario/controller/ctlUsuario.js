const axios = require("axios");
const moment = require("moment");


const manutUsuario = async (req, res) =>
 (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllUsuario", {
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
      res.render("usuario/view/vwManutUsuario.njk", {
        title: "Manutenção de Usuário",
        data: null,
        erro: remoteMSG, 
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }

    res.render("usuario/view/vwManutUsuario.njk", {
        title: "Manutenção de Usuário",
        data: resp.data.registro,
        erro: null,
        userName: userName,
      });
    })();



    const insertUsuario = async (req, res) =>
    (async () => {
      if (req.method == "GET") {
        const token = req.session.token;
        
  
        return res.render("usuario/view/vwFCrUsuario.njk", {
          title: "Cadastro de Usuário",
          data: null,
          erro: null, //@ Caso tenha da erro, a mensagem será mostrada na página html como um Alert
          agencia: usuario.data.registro,
          userName: null,
        });
  
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
  
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/InsertUsuario", regData, {
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
  

    const ViewUsuario = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetUsuarioByID",
          {
            usuarioid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          const usuario = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllUsuarios", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          response.data.registro[0].datanasc = moment(response.data.registro[0].datanasc).format(
            "YYYY-MM-DD");


          res.render("usuario/view/vwFRUDrUsuario.njk", {
            title: "Visualização de Usuários",
            data: response.data.usuario[0],
            disabled: true,
            usauario: usuario.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlUsuario|ViewUsuario] ID de usuário não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlUsuario.js|ViewUsuario] usuario não localizado!" });
      console.log(
        "[ctlUsuario.js|ViewUsuario] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

  const UpdateUsuario = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetUsuarioByID",
          {
            usuarioid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {

          response.data.registro[0].datanasc = moment(response.data.registro[0].datanasc).format(
            "YYYY-MM-DD"
          );

          res.render("usuario/view/vwFRUDrUsuario.njk", {
            title: "Atualização de dados de usuário",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlUsuario|UpdateUsuario] Dados não localizados");
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/UpdateUsuario", regData, {
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
          console.error('[ctlUsuario.js|UpdateUsuario] Erro ao atualizar dados de usuario no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlUsuario.js|UpdateUsuario] Usuario não localizada!" });
      console.log(
        "[ctlUsuario.js|UpdateUsuario] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteUsuario = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteUsuario", regData, {
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
  manutUsuario,
  insertUsuario,
  ViewUsuario,
  UpdateUsuario,
  DeleteUsuario
};
