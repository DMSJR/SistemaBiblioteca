const axios = require("axios");
const moment = require("moment");


const manutEmprestimo = async (req, res) => {
  try {
    const userName = req.session.userName;
    const token = req.session.token;

    // Buscar todos os empréstimos
    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllEmprestimos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(resp.data);
    // Verificar se a resposta é válida
    if (!resp || !resp.data || !resp.data.registro) {
      throw new Error("Dados de empréstimos não encontrados.");
    }

    // Buscar o nome do usuário para cada empréstimo
    const registrosComNomes = await Promise.all(
      resp.data.registro.map(async (emprestimo) => {
        try {
          const responseUser = await axios.post(
            process.env.SERVIDOR_DW3Back + "/GetUsuarioByID",
            { usuarioid: emprestimo.usuario_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Adicionar o nome do usuário ao registro do empréstimo
          emprestimo.userName = responseUser.data.registro?.nome || "Nome não encontrado";
        } catch (error) {
          console.error(`Erro ao buscar nome do usuário ${emprestimo.usuario_id}:`, error.message);
          emprestimo.userName = "Erro ao carregar nome";
        }
        return emprestimo;
      })
    );

    // Buscar o título do livro para cada empréstimo
    const registrosComLivro = await Promise.all(
      registrosComNomes.map(async (emprestimo) => {
        try {
          const responseLivro = await axios.post(
            process.env.SERVIDOR_DW3Back + "/GetLivroByID",
            { livroid: emprestimo.livro_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Adicionar o título do livro ao registro do empréstimo
          emprestimo.livro = responseLivro.data.registro?.titulo || "Livro não encontrado";
        } catch (error) {
          console.error(`Erro ao buscar livro ${emprestimo.livro_id}:`, error.message);
          emprestimo.livro = "Erro ao carregar livro";
        }
        return emprestimo;
      })
    );

    // Buscar os autores para cada livro
    const registrosComAutor = await Promise.all(
      registrosComLivro.map(async (emprestimo) => {
        try {
          const responseAutor = await axios.post(
            process.env.SERVIDOR_DW3Back + "/getAutoresPorLivro",
            { livroid: emprestimo.livro_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Concatena os nomes dos autores em uma string
          const autores = responseAutor.data.autores.map((autor) => autor.nome).join(", ");
          emprestimo.autor = autores || "Autor(es) não encontrado(s)";
        } catch (error) {
          console.error(`Erro ao buscar autores do livro ${emprestimo.livro_id}:`, error.message);
          emprestimo.autor = "Erro ao carregar autores";
        }
        return emprestimo;
      })
    );

    // Renderizar a página com os dados modificados
    res.render("emprestimo/view/vwManutEmprestimo.njk", {
      title: "Manutenção de Empréstimos",
      data: registrosComAutor,
      erro: null,
      userName: userName,
    });
  } catch (error) {
    console.error("Erro ao buscar dados de empréstimos:", error.message);
    res.render("emprestimo/view/vwManutEmprestimo.njk", {
      title: "Manutenção de Empréstimos",
      data: null,
      erro: "Erro ao carregar dados de empréstimos.",
      userName: req.session.userName,
    });
  }
};



const insertEmprestimo = async (req, res) => {
  if (req.method === "GET") {
    const token = req.session.token;

    try {
      // Buscar todos os usuários
      const usuariosResponse = await axios.get(`${process.env.SERVIDOR_DW3Back}/GetAllUsuarios`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Buscar todos os livros
      const livrosResponse = await axios.get(`${process.env.SERVIDOR_DW3Back}/GetAllLivros`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Adicionar os nomes dos autores a cada livro via requisição ao backend (POST)
      const livrosComAutores = await Promise.all(
        livrosResponse.data.registro.map(async (livro) => {
          try {
            const autoresResponse = await axios.post(
              `${process.env.SERVIDOR_DW3Back}/getAutoresPorLivro`,
              { livroid: livro.livro_id }, // Corpo da requisição POST
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(` Response para autores:`, JSON.stringify(autoresResponse.data, null, 2));

            const nomesAutores = autoresResponse.data.autores
              .map((autor) => autor.nome)
              .join(", ");
            return {
              ...livro,
              nomesAutores: nomesAutores || "Desconhecido",
            };
          } catch (error) {
            console.error(`[insertEmprestimo] Erro ao buscar autores para o livro ${livro.livro_id}:`, error.message);
            return {
              ...livro,
              nomesAutores: "Erro ao carregar autores",
            };
          }
        })
      );

      // Renderizar a página de cadastro com os dados
      return res.render("emprestimo/view/vwFCrEmprestimo.njk", {
        title: "Cadastro de Empréstimo",
        data: null,
        usuarios: usuariosResponse.data.registro, // Lista de usuários
        livros: livrosComAutores,               // Lista de livros com autores
        erro: null,
        userName: req.session.userName,
      });
    } catch (error) {
      console.error("[insertEmprestimo] Erro ao buscar dados:", error.message);
      return res.render("emprestimo/view/vwFCrEmprestimo.njk", {
        title: "Cadastro de Empréstimo",
        data: null,
        usuarios: [],
        livros: [],
        erro: "Erro ao carregar dados de usuários e livros.",
        userName: req.session.userName,
      });
    }
  } else {
    // POST: Salvar o empréstimo (mantém igual)
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(`${process.env.SERVIDOR_DW3Back}/insertEmprestimo`, regData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      console.error("[insertEmprestimo] Erro ao salvar dados:", error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: "Erro ao salvar o empréstimo.",
      });
    }
  }
};




const ViewEmprestimo = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  try {
    if (req.method === "GET") {
      const id = parseInt(req.params.id, 10);

      // Busca do empréstimo pelo ID
      const emprestimoResponse = await axios.post(
        `${process.env.SERVIDOR_DW3Back}/getEmprestimoByID`,
        { emprestimoid: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (emprestimoResponse.data.status === "ok") {
        const emprestimo = emprestimoResponse.data.registro;
        // Formatar datas
        emprestimo.dataemprestimo = moment(emprestimo.dataemprestimo).format("YYYY-MM-DD");
        emprestimo.datadevolucao = moment(emprestimo.datadevolucao).format("YYYY-MM-DD");

        // Busca do nome do livro
        const livroResponse = await axios.post(
          `${process.env.SERVIDOR_DW3Back}/getLivroByID`,
          { livroid: emprestimo.livro_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (livroResponse.data.status === "ok") {
          emprestimo.nomelivro = livroResponse.data.registro.titulo;

          // Busca dos autores do livro
          const autoresResponse = await axios.post(
            `${process.env.SERVIDOR_DW3Back}/getAutoresPorLivro`,
            { livroid: emprestimo.livro_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Resposta completa de autoresResponse:", autoresResponse.data);


          if (autoresResponse.data.status === "ok") {
            emprestimo.autores = autoresResponse.data.autores.map((autor) => autor.nome).join(", ");
          } else {
            emprestimo.autores = "Autores não encontrados.";
          }
        } else {
          emprestimo.nomelivro = "Livro não encontrado.";
        }
        console.log("Requisição enviada:", emprestimo);
        // Busca do nome do usuário
        const usuarioResponse = await axios.post(
          `${process.env.SERVIDOR_DW3Back}/getUsuarioByID`,
          { usuarioid: emprestimo.usuario_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Requisição enviada:", {
          usuarioid: emprestimo.usuario_id,
        });
        console.log("usuario", usuarioResponse.data.registro.nome);
        if (usuarioResponse.data.status === "ok") {
          emprestimo.nomeusuario = usuarioResponse.data.registro.nome;
        } else {
          emprestimo.nomeusuario = "Usuário não encontrado.";
        }
        // Buscar todos os usuários
        const usuariosResponse = await axios.get(`${process.env.SERVIDOR_DW3Back}/getAllUsuarios`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Buscar todos os livros
        const livrosResponse = await axios.get(`${process.env.SERVIDOR_DW3Back}/getAllLivros`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // Renderizar a página com todos os dados integrados
        return res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
          title: "Visualização de Empréstimo",
          data: emprestimo,
          usuarios: usuariosResponse.data.registro, // Lista de usuários
          livros: livrosResponse.data.registro,
          disabled: true,
          userName,
        });
      } else {
        console.error("[ViewEmprestimo] ID de empréstimo não localizado!");
        return res.status(404).json({ status: "Erro", msg: "Empréstimo não encontrado." });
      }
    }
  } catch (erro) {
    console.error("[ViewEmprestimo] Erro ao buscar ou processar os dados:", erro.message);
    return res.status(500).json({ status: "Erro", msg: "Erro ao buscar empréstimo." });
  }
};


const UpdateEmprestimo = async (req, res) => {
  const userName = req.session.userName;
  const token = req.session.token;

  if (req.method === "GET") {
    try {
      const id = parseInt(req.params.id, 10);

      // Buscar dados do empréstimo
      const emprestimoResponse = await axios.post(
        `${process.env.SERVIDOR_DW3Back}/getEmprestimoByID`,
        { emprestimoid: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (emprestimoResponse.data.status === "ok") {
        const emprestimo = emprestimoResponse.data.registro;

        // Formatando datas
        emprestimo.dataemprestimo = moment(emprestimo.dataemprestimo).format("YYYY-MM-DD");
        emprestimo.datadevolucao = moment(emprestimo.datadevolucao).format("YYYY-MM-DD");

        // Buscar nome do livro
        const livroResponse = await axios.post(
          `${process.env.SERVIDOR_DW3Back}/getLivroByID`,
          { livroid: emprestimo.livro_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (livroResponse.data.status === "ok") {
          emprestimo.nomelivro = livroResponse.data.registro.titulo;

          // Buscar autores do livro
          const autoresResponse = await axios.post(
            `${process.env.SERVIDOR_DW3Back}/getAutoresPorLivro`,
            { livroid: emprestimo.livro_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (autoresResponse.data.status === "ok") {
            emprestimo.autores = autoresResponse.data.autores.map((autor) => autor.nome).join(", ");
          } else {
            emprestimo.autores = "Autores não encontrados.";
          }
        } else {
          emprestimo.nomelivro = "Livro não encontrado.";
        }

        // Buscar nome do usuário
        const usuarioResponse = await axios.post(
          `${process.env.SERVIDOR_DW3Back}/getUsuarioByID`,
          { usuarioid: emprestimo.usuario_id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (usuarioResponse.data.status === "ok") {
          emprestimo.nomeusuario = usuarioResponse.data.registro.nome;
        } else {
          emprestimo.nomeusuario = "Usuário não encontrado.";
        }

        // Buscar todos os usuários
        const usuariosResponse = await axios.get(`${process.env.SERVIDOR_DW3Back}/getAllUsuarios`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Buscar todos os livros
        const livrosResponse = await axios.get(`${process.env.SERVIDOR_DW3Back}/getAllLivros`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Renderizar a página de atualização com os dados completos
        return res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
          title: "Atualização de Empréstimo",
          data: emprestimo,
          usuarios: usuariosResponse.data.registro, // Lista de usuários
          livros: livrosResponse.data.registro,     // Lista de livros
          disabled: false,
          userName,
        });
      } else {
        console.error("[UpdateEmprestimo] Empréstimo não localizado!");
        return res.json({ status: "Erro", msg: "Empréstimo não localizado!" });
      }
    } catch (error) {
      console.error("[UpdateEmprestimo] Erro ao buscar dados:", error.message);
      res.json({ status: "Erro ao buscar dados do empréstimo." });
    }
  } else {
    // POST: Atualizar o empréstimo
    const regData = req.body;
    console.log(regData)
    try {
      const response = await axios.post(`${process.env.SERVIDOR_DW3Back}/UpdateEmprestimo`, regData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000, // Timeout de 5 segundos
      });

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error("[UpdateEmprestimo] Erro ao atualizar dados:", error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: "Erro ao atualizar o empréstimo.",
      });
    }
  }
};


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
