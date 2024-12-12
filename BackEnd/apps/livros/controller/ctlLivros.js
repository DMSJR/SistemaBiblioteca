const mdlLivros = require("../model/mdlLivros");

const getAllLivros = (req, res) =>
  (async () => {
    let registro = await mdlLivros.getAllLivros();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i]; // Current row      
      const formattedDate = row.data_publicacao.toISOString().split('T')[0];
      row.data_publicacao = formattedDate;

    }
    res.json({ status: "ok", "registro": registro });
  })();

const getLivroByID = (req, res) =>
  (async () => {
    console.log("Corpo da requisição:", req.body); 
    const livro_id = parseInt(req.body.livro_id);
    
    let registro = await mdlLivros.getLivroByID(livro_id);
    console.log("Livro encontrado:", registro);

    res.json({ status: "ok", "registro": registro });
  })();

  const insertLivro = (request, res) =>
    (async () => {
      const livroREG = request.body; // Dados do livro enviados na requisição
      let { msg, linhasAfetadas, livro_id } = await mdlLivros.insertLivro(livroREG); // Chama o modelo que agora retorna livro_id
  
      if (msg === "ok" && livro_id) {
        // Se a inserção foi bem-sucedida, retorna o ID gerado
        console.log(livro_id)
        res.json({ status: "ok", linhasAfetadas, livro_id });

      } else {
        // Em caso de erro, inclui a mensagem na resposta
        res.json({ status: msg, linhasAfetadas });
      }
    })();
  

const updateLivro = (request, res) =>
  (async () => {
    const livroREG = request.body;
    let { msg, linhasAfetadas } = await mdlLivros.UpdateLivro(livroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const deleteLivro = (request, res) =>
  (async () => {
    const livroREG = request.body;
    let { msg, linhasAfetadas } = await mdlLivros.DeleteLivro(livroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllLivros,
  getLivroByID,
  insertLivro,
  updateLivro,
  deleteLivro
};
