const axios = require("axios");
const moment = require("moment");




const manutLivro = async (req, res) =>
 (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllLivros", {
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
      res.render("livro/view/vwManutLivros.njk", {
        title: "Manutenção de Livros",
        data: null,
        erro: remoteMSG, 
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }

    res.render("livro/view/vwManutLivros.njk", {
        title: "Manutenção de livro",
        data: resp.data.registro,
        erro: null,
        userName: userName,
      });
    })();



    const insertLivro = async (req, res) =>
    (async () => {
      if (req.method == "GET") {
        const token = req.session.token;
  
       
  
        return res.render("livro/view/vwFCrLivro.njk", {
          title: "Cadastro de livro",
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
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertLivro", regData, {
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
  

    const ViewLivro = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetLivroByID",
          {
            livroid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          const livro = await axios.get(
            process.env.SERVIDOR_DW3Back + "/GetAllLivros", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}` // Set JWT token in the header
            }
          });

          res.render("livro/view/vwFRUDrLivro.njk", {
            title: "Visualização de livro",
            data: response.data.livro[0],
            disabled: true,
            livro: livro.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlLivro|ViewLivro] ID de livro não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlLivro.js|ViewLivro] livro não localizado!" });
      console.log(
        "[ctlLivro.js|ViewLivro] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

  const UpdateLivro = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/GetLivroByID",
          {
            livroid: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {

          response.data.registro[0].datalivro = moment(response.data.registro[0].datalivro).format(
            "YYYY-MM-DD"
          );

          response.data.registro[0].datadevolucao = moment(response.data.registro[0].datadevolucao).format(
            "YYYY-MM-DD"
          );

          res.render("livro/view/vwFRUDrLivro.njk", {
            title: "Atualização de dados de livro",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlLivro|UpdateLivro] Dados não localizados");
        }
      } else {
        //@ POST
        const regData = req.body;
        const token = req.session.token;
        try {
          // @ Enviando dados para o servidor Backend
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateLivro", regData, {
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
          console.error('[ctlLivro.js|UpdateLivro] Erro ao atualizar dados de livro no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlLivro.js|UpdateLivro] Livro não localizada!" });
      console.log(
        "[ctlLivro.js|UpdateLivro] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const DeleteLivro = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteLivro", regData, {
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
  manutLivro,
  insertLivro,
  ViewLivro,
  UpdateLivro,
  DeleteLivro
};



//VER AS ROTAS AGORA