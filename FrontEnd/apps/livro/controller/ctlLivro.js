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
        remoteMSG = "Livro não autenticado";

      } else {
        remoteMSG = error;
      }
      res.render("livro/view/vwManutLivro.njk", {
        title: "Manutenção de Livro",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }
    //console.log('Dados do registro:', resp.data.registro);

    res.render("livro/view/vwManutLivro.njk", {
      title: "Manutenção de Livro",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();



const insertLivro = async (req, res) =>
  (async () => {
    const token = req.session.token;

    if (req.method === "GET") {
      try {
        // Buscar todos os autores no backend
        const response = await axios.get(process.env.SERVIDOR_DW3Back + "/GetAllAutores", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === "ok") {
          const autores = response.data; // Supondo que os autores vêm neste campo
          console.log(response.data);
          return res.render("livro/view/vwFCrLivro.njk", {
            title: "Cadastro de Livro",
            data: autores,
            erro: null, // Caso tenha erro, a mensagem será mostrada na página html como um Alert
            userName: req.session.userName,
            // Envia os autores para o template
          });
        } else {
          console.error("[insertLivro] Erro ao buscar autores: Lista vazia ou erro na API");
          return res.render("livro/view/vwFCrLivro.njk", {
            title: "Cadastro de Livro",
            data: null,
            erro: "Erro ao buscar a lista de autores",
            userName: req.session.userName,
            autores: [],
          });
        }
      } catch (error) {
        console.error("[insertLivro] Erro na comunicação com o backend ao buscar autores:", error.message);
        return res.render("livro/view/vwFCrLivro.njk", {
          title: "Cadastro de Livro",
          data: null,
          erro: `Erro ao buscar a lista de autores: ${error.message}`,
          userName: req.session.userName,
          autores: [],
        });
      }
    } else {
      // @ POST - Cadastro do Livro
      const regData = req.body;

      try {
        // Enviar dados do livro para o backend
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/InsertLivro", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000, // Timeout de 5 segundos
        });

        // Captura o livro_id da resposta
        const responseData = {
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          livro_id: response.data.livro_id,
          erro: null,
        };

        console.log(responseData.livro_id); // Agora deve exibir corretamente o livro_id
        res.json(responseData);
      } catch (error) {
        console.error("[insertLivro] Erro ao inserir dados no backend:", error.message);
        res.json({
          status: "Error",
          msg: error.message,
          data: null,
          livro_id: null,
          erro: null,
        });
      }
    }
  })();



  const fetchLivroData = async (id, token) => {
    try {
      // Realizar ambas as requisições em paralelo: um para buscar os dados do livro e outro para os autores
      const [livroResponse, autoresResponse] = await Promise.all([
        axios.post(
          `${process.env.SERVIDOR_DW3Back}/getLivroByID`,
          { livro_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        axios.get(`${process.env.SERVIDOR_DW3Back}/GetAllAutores`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
  
      // Verificar se a resposta do livro está ok
      if (livroResponse.data.status === "ok") {
        const livroData = livroResponse.data.registro;
  
        // Formatar a data de nascimento do autor, se necessário
        livroData.datanasc = moment(livroData.datanasc).format("YYYY-MM-DD");
  
        // Verificar se a resposta dos autores está ok
        if (autoresResponse.data.status === "ok") {
          const autores = autoresResponse.data.registro;
  
          // Retornar o livroData junto com os autores
          return {
            livroData,
            autores,
          };
        } else {
          console.log("[fetchLivroData] Erro ao buscar a lista de autores.");
          throw new Error("Erro ao buscar a lista de autores");
        }
      } else {
        console.log("[fetchLivroData] Livro não encontrado.");
        throw new Error("Livro não encontrado");
      }
    } catch (error) {
      console.error("[fetchLivroData] Erro ao buscar dados do livro ou dos autores:", error.message);
      throw error;
    }
  };
  
const ViewLivro = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;
  const id = parseInt(req.params.id);

  try {
    const { livroData, autores }  = await fetchLivroData(id, token);
    res.render("livro/view/vwFRUDrLivro.njk", {
      title: "Visualização de Livro",
      data: livroData,
      dataAutores: autores,
      disabled: true, // Campos desabilitados para visualização
      userName: userName,
    });
  } catch (error) {
    console.error("[ViewLivro] Erro:", error.message);
    res.status(500).send("Erro ao carregar a visualização do livro.");
  }
};
const UpdateLivro = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  if (req.method === "GET") {
    const id = parseInt(req.params.id);

    try {
      const { livroData, autores }  = await fetchLivroData(id, token);
      console.log(autores);
      res.render("livro/view/vwFRUDrLivro.njk", {
        title: "Atualização de Livro",
        data: livroData,
        dataAutores: autores,
        disabled: false, // Campos editáveis
        userName: userName,
      });
    } catch (error) {
      console.error("[UpdateLivro|GET] Erro:", error.message);
      res.status(500).send("Erro ao carregar o formulário de atualização do livro.");
    }
  } else if (req.method === "POST") {
    try {
      const regData = req.body;

      const response = await axios.post(
        `${process.env.SERVIDOR_DW3Back}/updateLivro`,
        regData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000, // Timeout de 5 segundos
        }
      );

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error("[UpdateLivro|POST] Erro ao atualizar dados do livro:", error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: error.message,
      });
    }
  }
};


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


const addAutor = async (req, res) => {
  const { livro_id, autor_id } = req.body;
  const token = req.session.token;
 

  try {
    const response = await axios.post(
      `${process.env.SERVIDOR_DW3Back}/addAutorAoLivro`,
      { livro_id, autor_id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data.status === "ok") {
      res.json({
        status: "ok",
        msg: "Autor adicionado com sucesso!",
        autor: response.data.autor
      });
    } else {
      res.json({
        status: "error",
        msg: response.data.msg
      });
    }
  } catch (error) {
    console.error("Erro ao adicionar autor:", error.message);
    res.json({
      status: "error",
      msg: `Erro de conexão: ${error.message}`
    });
  }
};
const deleteAutorDoLivro = async (req, res) => {
  const { livro_id, autor_id } = req.body;
  const token = req.session.token;
  

  try {
    const response = await axios.post(
      `${process.env.SERVIDOR_DW3Back}/deleteAutorDoLivro`,
      { livro_id, autor_id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data.status === "ok") {
      res.json({
        status: "ok",
        msg: "Autor removido com sucesso!",
        autor: response.data.autor
      });
    } else {
      res.json({
        status: "error",
        msg: response.data.msg
      });
    }
  } catch (error) {
    console.error("Erro ao remover autor:", error.message);
    res.json({
      status: "error",
      msg: `Erro de conexão: ${error.message}`
    });
  }
};

module.exports = {
  manutLivro,
  insertLivro,
  ViewLivro,
  UpdateLivro,
  DeleteLivro,
  addAutor,
  deleteAutorDoLivro
};
