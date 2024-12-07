const axios = require("axios");
const moment = require("moment");


const manutUsuario = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllUsuarios", {
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
    console.log('Dados do registro:', resp.data.registro);

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
          process.env.SERVIDOR_DW3Back + "/getUsuarioByID",
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
          

          response.data.registro.datanasc = moment(response.data.registro.datanasc).format(
            "YYYY-MM-DD"
          );
          

          res.render("usuario/view/vwFRUDrUsuario.njk", {
            title: "Visualização de usuarios",
            data: response.data.registro,
            disabled: true,

            userName: userName,
          });
        } else {
          console.log("[ctlUsuario|ViewUsuario] ID de Usuario não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlUsuario.js|ViewUsuario] Usuario não localizado!" });
      console.log(
        "[ctlUsuario.js|ViewAUsuario] Try Catch: Erro não identificado",
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

          response.data.registro.datanasc = moment(response.data.registro.datanasc).format(
            "YYYY-MM-DD"
          );

          res.render("usuario/view/vwFRUDrUsuario.njk", {
            title: "Atualização de dados de usuário",
            data: response.data.registro,
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
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateUsuario", regData, {
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
