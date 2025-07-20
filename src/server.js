const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const userRoutes = require('./userRoutes');
app.use('/api', userRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'O servidor está captando rotas! 🎯' });
});

// Sincronizar modelo com o banco
const sequelize = require('../config/database');
const Usuario = require('../models/usuario');

sequelize.sync({ force: false })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso!');
  })
  .catch((erro) => {
    console.error('Erro ao sincronizar tabelas:', erro);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

