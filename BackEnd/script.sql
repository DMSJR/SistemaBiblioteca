-- Apagar tabelas existentes na ordem inversa de dependência
DROP TABLE IF EXISTS Emprestimo CASCADE;
DROP TABLE IF EXISTS Livro_Autor CASCADE;
DROP TABLE IF EXISTS Autor CASCADE;
DROP TABLE IF EXISTS Livro CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;

-- Criar tabela Usuario
CREATE TABLE Usuario (
    usuario_id SERIAL PRIMARY KEY,
	codigo VARCHAR(20) UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(15),
    datanasc DATE,
    multas DECIMAL(10, 2) DEFAULT 0.00,
    deleted BOOLEAN DEFAULT FALSE
);

-- Criar tabela Livro
CREATE TABLE Livro (
    livro_id SERIAL PRIMARY KEY,
	codigo VARCHAR(20) UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    data_publicacao DATE,
    genero VARCHAR(50),
    valor DECIMAL(10, 2) DEFAULT 0.00,
    deleted BOOLEAN DEFAULT FALSE
);

-- Criar tabela Autor
CREATE TABLE Autor (
    autor_id SERIAL PRIMARY KEY,
	codigo VARCHAR(20) UNIQUE,
    nome VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(50),
    datanasc DATE,
    royalties DECIMAL(5, 2) DEFAULT 0.00,
    deleted BOOLEAN DEFAULT FALSE
);

-- Criar tabela Livro_Autor (relação N:N entre Livro e Autor)
CREATE TABLE Livro_Autor (
    livro_id INT REFERENCES Livro(livro_id) ON DELETE CASCADE,
    autor_id INT REFERENCES Autor(autor_id) ON DELETE CASCADE,
    PRIMARY KEY (livro_id, autor_id)
);

-- Criar tabela Emprestimo
CREATE TABLE Emprestimo (
    emprestimo_id SERIAL PRIMARY KEY,
	codigo VARCHAR(20) UNIQUE,
    data_emprestimo DATE NOT NULL,
    data_devolucao DATE,
	multa DECIMAL(5, 2) DEFAULT 0.00,
    livro_id INT REFERENCES Livro(livro_id) ON DELETE CASCADE,
    usuario_id INT REFERENCES Usuario(usuario_id) ON DELETE CASCADE,
    deleted BOOLEAN DEFAULT FALSE
);
