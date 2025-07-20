const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Instância do Express
const app = express();

// Liberação de CORS (inclusive para requisições com Authorization e via Live Server)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Tratamento manual de requisições OPTIONS (preflight CORS)
app.options('*', cors()); // ou:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// Rotas de autenticação e perfil
const userRoutes = require('./userRoutes.js');
app.use('/api', userRoutes);

// Rotas adicionais (ex: pingRoutes)
const pingRoutes = require('./pingRoutes.js');
app.use('/api', pingRoutes);

// Rota de teste (útil pra validar se o servidor está ativo)
app.get('/test', (req, res) => {
  res.json({ message: 'O servidor está captando rotas! 🎯' });
});

// Conexão com banco de dados
const sequelize = require('../../config/database.js');
const Usuario = require('./models/usuario.js'); // Certifique-se de que está com nome correto

sequelize.sync({ force: false })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso!');
  })
  .catch((erro) => {
    console.error('Erro ao sincronizar tabelas:', erro);
  });

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});