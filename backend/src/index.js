require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let users = []; // Array simples pra guardar os usuários na memória

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Criar usuário (POST /api/user)
app.post('/api/user', (req, res) => {
  const user = req.body;
  if (!user.name || !user.email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  user.id = users.length + 1; // ID simples 
  users.push(user);
  res.status(201).json(user);
});

// Listar todos os usuários (GET /api/user)
app.get('/api/user', (req, res) => {
  res.json(users);
});

// Buscar usuário por ID (GET /api/user/:id)
app.get('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

// Atualizar usuário por ID (PUT /api/user/:id)
app.put('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  const user = req.body;
  if (!user.name || !user.email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  users[index] = { id, ...user };
  res.json(users[index]);
});

// Deletar usuário por ID (DELETE /api/user/:id)
app.delete('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  users.splice(index, 1);
  res.json({ message: 'Usuário deletado' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
