const db = require("../../../database/databaseconfig");

const getAllLivros = async () => {
  return (
    await db.query(
      "SELECT * FROM Livro where deleted = false ORDER BY titulo ASC"
    )
  ).rows;
};

const getLivroByID = async (livro_idPar) => {
  return (
    await db.query(
      "SELECT * FROM Livro WHERE livro_id = $1 and deleted = false ORDER BY titulo ASC",
      [livro_idPar]
    )
  ).rows[0];
};

const insertLivro = async (LivroREGPar) => {
  let linhasAfetadas;
  let livro_id = null; // Variável para armazenar o ID retornado
  let msg = "ok";

  try {
    const result = await db.query(
      "INSERT INTO Livro " +
      "VALUES (default, $1, $2, $3, $4, $5) RETURNING livro_id",
      [
        LivroREGPar.codigo,
        LivroREGPar.titulo,
        LivroREGPar.data_publicacao,
        LivroREGPar.genero,
        LivroREGPar.valor,
      ]
    );

    linhasAfetadas = result.rowCount;

    if (linhasAfetadas > 0) {
      livro_id = result.rows[0].livro_id; // Captura o ID retornado
    }
  } catch (error) {
    console.error("Erro ao inserir livro:", error); // Exibe o erro completo no console
    msg = "[mdlLivros|insertLivro] " + (error.message || error);
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas, livro_id }; // Retorna o ID junto com outras informações
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
          LivroREGPar.livro_id,
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
        [LivroREGPar.livro_id]
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
