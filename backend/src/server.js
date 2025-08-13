require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Primeiro cria o app
const app = express();

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas
const userRoutes = require('./routes/userRoutes');
const pingRoutes = require('./routes/pingRoutes');
app.use('/api', userRoutes);
app.use('/api', pingRoutes);

// Rota de teste
app.get('/test', (req, res) => {
  res.json({ message: 'O servidor está captando rotas!' });
});

// 🔗 Conexão com banco de dados
const { sequelize } = require('./models'); // ← já importando instância pronta

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Tabelas sincronizadas com sucesso!');
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('❌ Erro ao sincronizar tabelas:', erro);
  });

// Tratamento de erros inesperados
process.on('uncaughtException', (err) => {
  console.error('Erro inesperado:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promessa rejeitada:', reason);
});