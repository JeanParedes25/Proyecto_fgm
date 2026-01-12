const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Ruta de registro
router.post('/register', authController.register);

// Ruta de login
router.post('/login', authController.login);

module.exports = router;
