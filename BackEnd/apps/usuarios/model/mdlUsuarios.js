const db = require("../../../database/databaseconfig");

const getAllUsuarios = async () => {
  return (
    await db.query(
      "SELECT * FROM Usuario where deleted = false ORDER BY nome ASC"
    )
  ).rows;
};

const getUsuarioByID = async (UsuarioIDPar) => {
  return (
    await db.query(
      "SELECT * FROM Usuario WHERE Usuario_id = $1 and deleted = false ORDER BY nome ASC",
      [UsuarioIDPar]
    )
  ).rows[0];
};

const insertUsuario = async (UsuarioREGPar) => {
  //@ Atenção: aqui já começamos a utilizar a variável msg para retornor erros de banco de dados.
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO Usuario " + "values(default, $1, $2, $3, $4, $5, $6)",
        [
          UsuarioREGPar.codigo,
          UsuarioREGPar.nome,
          UsuarioREGPar.email,
          UsuarioREGPar.telefone,
          UsuarioREGPar.datanasc,
          UsuarioREGPar.multas
        ]
      )
    ).rowCount;
  } catch (error) {
    console.error("Erro ao inserir usuário:", error);  // Exibe o erro completo
    msg = "[mdlUsuarios|insertUsuarios] " + (error.message || error);
    linhasAfetadas = -1;
  }


  return { msg, linhasAfetadas };
};

const UpdateUsuario = async (UsuarioREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE Usuario SET " +
        "codigo = $2, " +
        "nome = $3, " +
        "email = $4, " +
        "telefone = $5, " +
        "datanasc = $6," +
        "multas = $7, " +
        "deleted = $8 " +
        "WHERE usuario_id = $1",
        [
          UsuarioREGPar.usuarioid,
          UsuarioREGPar.codigo,
          UsuarioREGPar.nome,
          UsuarioREGPar.email,
          UsuarioREGPar.telefone,
          UsuarioREGPar.datanasc,
          UsuarioREGPar.multas,
          UsuarioREGPar.deleted,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlUsuarios|updateUsuario] " + (error.detail || error.message);
    linhasAfetadas = -1;
  }
  return { linhasAfetadas, msg };
};




const DeleteUsuario = async (UsuarioREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE Usuario SET deleted = true WHERE usuario_id = $1",
        [UsuarioREGPar.usuarioid]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlUsuarios|deleteUsuario] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllUsuarios,
  getUsuarioByID,
  insertUsuario,
  UpdateUsuario,
  DeleteUsuario,
};
