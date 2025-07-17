const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para cadastro de usuário
router.post('/user', userController.registerUser);

// Rota para login
router.post('/login', userController.loginUser);

// Rota protegida para obter perfil
router.get('/me', authMiddleware, userController.getProfile);

module.exports = router;
