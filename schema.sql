-- Execute este arquivo para criar a estrutura inicial do banco

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  preco REAL NOT NULL
);

-- Dados de exemplo para teste
INSERT INTO items (nome, quantidade, preco) VALUES 
('Notebook Dell', 5, 2500.00),
('Mouse Logitech', 20, 45.90),
('Teclado Mecânico', 8, 180.50);