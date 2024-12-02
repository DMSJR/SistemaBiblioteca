const db = require("../../../database/databaseconfig");

const getAutoresPorLivro = async (livroId) => {
    try {
        const autores = (
            await db.query(
                "SELECT a.* FROM Autor a JOIN Livro_Autor la ON a.autor_id = la.autor_id WHERE la.livro_id = $1",
                [livroId]
            )
        ).rows;

        return { autores, msg: "ok" };
    } catch (error) {
        console.error("Erro ao buscar autores por livro:", error);
        return { autores: [], msg: error.detail || error.message };
    }
};

const addAutorAoLivro = async (livroId, autorId) => {
    try {
        const linhasAfetadas = (
            await db.query(
                "INSERT INTO Livro_Autor (livro_id, autor_id) VALUES ($1, $2)",
                [livroId, autorId]
            )
        ).rowCount;

        return { linhasAfetadas, msg: "ok" };
    } catch (error) {
        console.error("Erro ao adicionar autor ao livro:", error);
        return { linhasAfetadas: -1, msg: error.detail || error.message };
    }
};
const getLivrosPorAutor = async (autorId) => {
    try {
        const livros = (
            await db.query(
                `SELECT l.* 
           FROM Livro l
           JOIN Livro_Autor la ON l.livro_id = la.livro_id
           WHERE la.autor_id = $1 AND l.deleted = false
           ORDER BY l.titulo ASC`,
                [autorId]
            )
        ).rows;

        return { livros, msg: "ok" };
    } catch (error) {
        console.error("Erro ao buscar livros por autor:", error);
        return { livros: [], msg: error.detail || error.message };
    }
};
const deleteAutorDoLivro = async (livroId, autorId) => {
    try {
        const linhasAfetadas = (
            await db.query(
                "DELETE FROM Livro_Autor WHERE livro_id = $1 AND autor_id = $2",
                [livroId, autorId]
            )
        ).rowCount;

        return { linhasAfetadas, msg: "ok" };
    } catch (error) {
        console.error("Erro ao deletar relação entre autor e livro:", error);
        return { linhasAfetadas: -1, msg: error.detail || error.message };
    }
};

module.exports = {
    getAutoresPorLivro,
    getLivrosPorAutor,
    addAutorAoLivro,
    deleteAutorDoLivro
}