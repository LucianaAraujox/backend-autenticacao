exports.registerUser = (req, res) => {
  res.send('Registrar usuário');
};

exports.loginUser = (req, res) => {
  res.send('Login usuário');
};

exports.getProfile = (req, res) => {
  res.send('Perfil do usuário');
};
const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
