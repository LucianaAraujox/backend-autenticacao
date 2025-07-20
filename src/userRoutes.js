const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('./middlewares');

router.post('/user', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', authMiddleware, userController.getProfile);

router.get('/ping', (req, res) => {
  res.json({ message: 'Rota funcionando corretamente 🚀' });
});

module.exports = router;