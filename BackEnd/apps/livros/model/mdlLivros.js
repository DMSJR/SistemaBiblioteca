const db = require("../../../database/databaseconfig");

const getAllLivros = async () => {
  return (
    await db.query(
      "SELECT * FROM Livro where deleted = false ORDER BY titulo ASC"
    )
  ).rows;
};

const getLivroByID = async (LivroIDPar) => {
  return (
    await db.query(
      "SELECT * FROM Livro WHERE Livro_id = $1 and deleted = false ORDER BY titulo ASC",
      [LivroIDPar]
    )
  ).rows[0];
};

const insertLivro = async (LivroREGPar) => {
  //@ Atenção: aqui já começamos a utilizar a variável msg para retornor erros de banco de dados.
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO Livro " + "values(default, $1, $2, $3, $4, $5)",
        [
          LivroREGPar.codigo,
          LivroREGPar.titulo,
          LivroREGPar.data_publicacao,
          LivroREGPar.genero,
          LivroREGPar.valor
         
        ]
      )
    ).rowCount;
  } catch (error) {
    console.error("Erro ao inserir livro:", error);  // Exibe o erro completo
    msg = "[mdlLivros|insertLivros] " + (error.message || error);
    linhasAfetadas = -1;
  }


  return { msg, linhasAfetadas };
};

const UpdateLivro = async (LivroREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE Livro SET " +
        "codigo = $2, " +
        "titulo = $3, " +
        "data_publicacao = $4, " +
        "genero = $5, " +
        "valor = $6," +
        "deleted = $7 " +
        "WHERE livro_id = $1",
        [   
            LivroREGPar.livroid,
            LivroREGPar.codigo,
            LivroREGPar.titulo,
            LivroREGPar.data_publicacao,
            LivroREGPar.genero,
            LivroREGPar.valor,
            LivroREGPar.deleted
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlLivros|updateLivro] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { linhasAfetadas, msg };
};




const DeleteLivro = async (LivroREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE Livro SET deleted = true WHERE livro_id = $1",
        [LivroREGPar.livroid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlLivros|deleteLivro] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};


module.exports = {
  getAllLivros,
  getLivroByID,
  insertLivro,
  UpdateLivro,
  DeleteLivro
  
};
