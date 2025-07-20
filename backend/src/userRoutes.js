const express = require('express');
const router = express.Router();

// Rotas de autenticação
const userController = require('./userController');
const authMiddleware = require('./middlewares');

router.post('/user', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', authMiddleware, userController.getProfile);

// Rota de teste
router.get('/ping', (req, res) => {
  res.json({ message: 'Rota funcionando corretamente' });
});

console.log('userRoutes carregado com sucesso');

module.exports = router;