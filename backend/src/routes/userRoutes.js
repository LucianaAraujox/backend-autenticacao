console.log("✅ Arquivo userRoutes.js carregado!");

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../authMiddleware');

console.log("Conteúdo do userController:", userController);

// Rotas
router.post('/user', userController.registerUser);
router.post('/register', userController.registerUser); 
router.post('/login', userController.loginUser);

// ✅ NOVA ROTA DE EDIÇÃO DE USUÁRIO
router.put('/user/:id', authMiddleware, userController.updateUser);

// Protegidas com token
router.get('/users', authMiddleware, userController.listUsers);
router.get('/me', authMiddleware, userController.getProfile);

router.get('/ping', (req, res) => {
  res.json({ message: 'Rota funcionando corretamente' });
});

module.exports = router;

