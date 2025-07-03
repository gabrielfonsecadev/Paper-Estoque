const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('main'));


const db = new sqlite3.Database('./estoque.db', (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    

    db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      preco REAL NOT NULL
    )`);
  }
});




app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM items ORDER BY id DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar itens:', err.message);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else {
      res.json(rows);
    }
  });
});


app.post('/items', (req, res) => {
  const { nome, quantidade, preco } = req.body;
  if (!nome || quantidade === undefined || preco === undefined) {
    return res.status(400).json({ error: 'Nome, quantidade e preço são obrigatórios' });
  }
  if (quantidade < 0 || preco < 0) {
    return res.status(400).json({ error: 'Quantidade e preço devem ser valores positivos' });
  }
  const sql = 'INSERT INTO items (nome, quantidade, preco) VALUES (?, ?, ?)';
  db.run(sql, [nome, quantidade, preco], function(err) {
    if (err) {
      res.status(500).json({ error: 'Erro ao cadastrar item' });
    } else {
      res.status(201).json({ id: this.lastID, nome, quantidade, preco, message: 'Item cadastrado com sucesso' });
    }
  });
});


app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, preco } = req.body;
  

  if (!nome || quantidade === undefined || preco === undefined) {
    return res.status(400).json({ error: 'Nome, quantidade e preço são obrigatórios' });
  }
  
  if (quantidade < 0 || preco < 0) {
    return res.status(400).json({ error: 'Quantidade e preço devem ser valores positivos' });
  }
  
  const sql = 'UPDATE items SET nome = ?, quantidade = ?, preco = ? WHERE id = ?';
  
  db.run(sql, [nome, quantidade, preco, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar item:', err.message);
      res.status(500).json({ error: 'Erro ao atualizar item' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Item não encontrado' });
    } else {
      res.json({ 
        id: parseInt(id), 
        nome, 
        quantidade, 
        preco,
        message: 'Item atualizado com sucesso' 
      });
    }
  });
});


app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM items WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('Erro ao excluir item:', err.message);
      res.status(500).json({ error: 'Erro ao excluir item' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Item não encontrado' });
    } else {
      res.json({ message: 'Item excluído com sucesso' });
    }
  });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Link do projeto: http://localhost:${PORT}`);
  console.log('Ctrl+C para parar o servidor');
});


process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    process.exit(0);
  });
});