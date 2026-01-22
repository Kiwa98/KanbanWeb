-- Script SQL para criar o banco de dados Kanban
-- Execute este script no MySQL para criar as tabelas necessárias

CREATE DATABASE IF NOT EXISTS kanban_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kanban_db;

-- Tabela produtos
CREATE TABLE IF NOT EXISTS produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL,
    nome VARCHAR(200) NOT NULL,
    qtd_por_palete INT NOT NULL DEFAULT 0,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    UNIQUE INDEX ix_produtos_sku (sku)
) ENGINE=InnoDB;

-- Tabela paletes
CREATE TABLE IF NOT EXISTS paletes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(100) NOT NULL,
    produto_id BIGINT NOT NULL,
    data_geracao DATETIME(6) NOT NULL,
    status VARCHAR(20) NOT NULL,
    UNIQUE INDEX ix_paletes_uid (uid),
    INDEX ix_paletes_produto_id (produto_id),
    CONSTRAINT fk_paletes_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Tabela movimentacoes
CREATE TABLE IF NOT EXISTS movimentacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    palete_id BIGINT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    data DATETIME(6) NOT NULL,
    INDEX ix_movimentacoes_palete_id (palete_id),
    CONSTRAINT fk_movimentacoes_palete FOREIGN KEY (palete_id) REFERENCES paletes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dados de exemplo (produtos)
INSERT INTO produtos (sku, nome, qtd_por_palete, ativo) VALUES
('ACA-410', 'ACA 410 NEON', 120, 1),
('ACA-420', 'ACA 420 PREMIUM', 100, 1),
('ACA-430', 'ACA 430 STANDARD', 150, 1),
('ACB-510', 'ACB 510 PLUS', 80, 1),
('ACB-520', 'ACB 520 ULTRA', 90, 1);
