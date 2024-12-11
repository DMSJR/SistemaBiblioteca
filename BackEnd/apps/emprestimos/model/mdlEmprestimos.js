const db = require("../../../database/databaseconfig");

const getAllEmprestimos = async () => {
    return (
        await db.query(
            "SELECT * FROM Emprestimo WHERE deleted = false ORDER BY data_emprestimo ASC"
        )
    ).rows;
};

const getEmprestimoByID = async (EmprestimoIDPar) => {
    return (
        await db.query(
            "SELECT * FROM Emprestimo WHERE emprestimo_id = $1 AND deleted = false ORDER BY data_emprestimo ASC",
            [EmprestimoIDPar]
        )
    ).rows[0];
};

const getEmprestimoPorLivro = async (LivroIDPar) => {
    try {
        const emprestimos = (
            await db.query(
                "SELECT * FROM Emprestimo WHERE livro_id = $1 AND deleted = false ORDER BY data_emprestimo ASC",
                [LivroIDPar]
            )
        ).rows;
        return { emprestimos, msg: "ok" };
    } catch (error) {
        console.error("Erro ao buscar empréstimos por livro:", error);
        return { emprestimos: [], msg: error.message || "Erro desconhecido" };
    }
};

const getEmprestimoPorUsuario = async (UsuarioIDPar) => {
    try {
        const emprestimos = (
            await db.query(
                "SELECT * FROM Emprestimo WHERE usuario_id = $1 AND deleted = false ORDER BY data_emprestimo ASC",
                [UsuarioIDPar]
            )
        ).rows;
        return { emprestimos, msg: "ok" };
    } catch (error) {
        console.error("Erro ao buscar empréstimos por usuário:", error);
        return { emprestimos: [], msg: error.message || "Erro desconhecido" };
    }
};

const insertEmprestimo = async (EmprestimoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO Emprestimo (emprestimo_id, codigo, data_emprestimo, data_devolucao, multa, livro_id, usuario_id) " +
                "VALUES (default, $1, $2, $3, $4, $5, $6)",
                [
                    EmprestimoREGPar.codigo,
                    EmprestimoREGPar.dataemprestimo,
                    EmprestimoREGPar.datadevolucao,
                    EmprestimoREGPar.multa,
                    EmprestimoREGPar.livro_id,
                    EmprestimoREGPar.usuario_id
                ]
            )
        ).rowCount;
    } catch (error) {
        console.error("Erro ao inserir empréstimo:", error);
        msg = "[mdlEmprestimos|insertEmprestimos] " + (error.message || error);
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const UpdateEmprestimo = async (EmprestimoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE Emprestimo SET " +
                "codigo = $2, " +
                "data_emprestimo = $3, " +
                "data_devolucao = $4, " +
                "multa = $5, " +
                "livro_id = $6, " +
                "usuario_id = $7, " +
                "deleted = $8 " +
                "WHERE emprestimo_id = $1",
                [
                    EmprestimoREGPar.emprestimo_id,
                    EmprestimoREGPar.codigo,
                    EmprestimoREGPar.dataemprestimo,
                    EmprestimoREGPar.datadevolucao,
                    EmprestimoREGPar.multa,
                    EmprestimoREGPar.livro_id,
                    EmprestimoREGPar.usuario_id,
                    EmprestimoREGPar.deleted
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlEmprestimos|updateEmprestimo] " + (error.detail || error.message);
        linhasAfetadas = -1;
    }
    return { linhasAfetadas, msg };
};

const DeleteEmprestimo = async (EmprestimoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE Emprestimo SET deleted = true WHERE emprestimo_id = $1",
                [EmprestimoREGPar.emprestimo_id]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlEmprestimos|deleteEmprestimo] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    getAllEmprestimos,
    getEmprestimoByID,
    getEmprestimoPorLivro,
    getEmprestimoPorUsuario,
    insertEmprestimo,
    UpdateEmprestimo,
    DeleteEmprestimo
};
