const axios = require("axios");
const moment = require("moment");


const manutAutor = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllAutores", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(error => {
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível"

      } else if (error.code === "ERR_BAD_REQUEST") {
        remoteMSG = "Autor não autenticado";

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
      title: "Manutenção de Autor",
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
        title: "Cadastro de Autor",
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
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/InsertAutor", regData, {
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




  const fetchAutorData = async (id, token) => {
    try {
      const response = await axios.post(
        process.env.SERVIDOR_DW3Back + "/GetAutorByID",
        { autor_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Dados de response:', response.data.registro);
      if (response.data.status === "ok") {
        response.data.registro.datanasc = moment(response.data.registro.datanasc).format("YYYY-MM-DD");
        return response.data.registro;
      } else {
        console.log("[fetchAutorData] Autor não encontrado.");
        throw new Error("Autor não encontrado");
      }
    } catch (error) {
      console.error("[fetchAutorData] Erro ao buscar dados do autor:", error.message);
      throw error;
    }
  };
  
  // Método ViewAutor
  const ViewAutor = async (req, res) => {
    const userName = req.session.userName;
    const token = req.session.token;
    const id = parseInt(req.params.id);
  
    try {
      const autorData = await fetchAutorData(id, token);
      res.render("autor/view/vwFRUDrAutor.njk", {
        title: "Visualização de Autor",
        data: autorData,
        disabled: true, // Campos desabilitados para visualização
        userName: userName,
      });
    } catch (error) {
      console.error("[ViewAutor] Erro:", error.message);
      res.status(500).send("Erro ao carregar a visualização do autor.");
    }
  };
  
  // Método UpdateAutor
  const UpdateAutor = async (req, res) => {
    const userName = req.session.userName;
    const token = req.session.token;
  
    if (req.method === "GET") {
      const id = parseInt(req.params.id);
  
      try {
        const autorData = await fetchAutorData(id, token);
        res.render("autor/view/vwFRUDrAutor.njk", {
          title: "Atualização de Autor",
          data: autorData,
          disabled: false, // Campos editáveis
          userName: userName,
        });
      } catch (error) {
        console.error("[UpdateAutor|GET] Erro:", error.message);
        res.status(500).send("Erro ao carregar o formulário de atualização do autor.");
      }
    } else if (req.method === "POST") {
      try {
        const regData = req.body;
        
        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/updateAutor",
          regData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000, // Timeout de 5 segundos
          }
        );
        console.log(regData);
  
        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        console.error("[UpdateAutor|POST] Erro ao atualizar dados do autor:", error.message);
        res.json({
          status: "Error",
          msg: error.message,
          data: null,
          erro: error.message,
        });
      }
    }
  };
  
  
  

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
