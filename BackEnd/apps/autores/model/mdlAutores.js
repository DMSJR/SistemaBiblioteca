const db = require("../../../database/databaseconfig");

const getAllAutores = async () => {
    return (
        await db.query(
            "SELECT * FROM Autor where deleted = false ORDER BY nome ASC"
        )
    ).rows;
};

const getAutorByID = async (autor_idPar) => {
    return (
        await db.query(
            "SELECT * FROM Autor WHERE Autor_id = $1 and deleted = false ORDER BY nome ASC",
            [autor_idPar]
        )
    ).rows[0];
};

const insertAutor = async (AutorREGPar) => {
    //@ Atenção: aqui já começamos a utilizar a variável msg para retornor erros de banco de dados.
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO Autor " + "values(default, $1, $2, $3, $4, $5)",
                [
                    AutorREGPar.codigo,
                    AutorREGPar.nome,
                    AutorREGPar.nacionalidade,
                    AutorREGPar.datanasc,
                    AutorREGPar.royalties

                ]
            )
        ).rowCount;
    } catch (error) {
        console.error("Erro ao inserir autor:", error);  // Exibe o erro completo
        msg = "[mdlAutores|insertAutores] " + (error.message || error);
        linhasAfetadas = -1;
    }


    return { msg, linhasAfetadas };
};

const UpdateAutor = async (AutorREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE Autor SET " +
                "codigo = $2, " +
                "nome = $3, " +
                "nacionalidade = $4, " +
                "datanasc = $5, " +
                "royalties = $6," +
                "deleted = $7 " +
                "WHERE autor_id = $1",
                [
                    AutorREGPar.autor_id,
                    AutorREGPar.codigo,
                    AutorREGPar.nome,
                    AutorREGPar.nacionalidade,
                    AutorREGPar.datanasc,
                    AutorREGPar.royalties,
                    AutorREGPar.deleted
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlAutores|updateAutor] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }
    return { linhasAfetadas, msg };
};




const DeleteAutor = async (AutorREGPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE Autor SET deleted = true WHERE autor_id = $1",
                [AutorREGPar.autor_id]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlAutores|deleteAutor] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    getAllAutores,
    getAutorByID,
    insertAutor,
    UpdateAutor,
    DeleteAutor,
};
