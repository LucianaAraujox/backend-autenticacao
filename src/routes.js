const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/user', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/me', authMiddleware.verifyToken, authController.getProfile);

module.exports = router;
