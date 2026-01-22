const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

// Registro y verificación
router.post('/register', authController.register);
router.post('/verificar-email', authController.verificarEmail);
router.post('/reenviar-codigo', authController.reenviarCodigoVerificacion);

// Login
router.post('/login', authController.login);

// Recuperación de contraseña
router.post('/solicitar-recuperacion', authController.solicitarRecuperacion);
router.post('/verificar-codigo-recuperacion', authController.verificarCodigoRecuperacion);
router.post('/restablecer-password', authController.restablecerPassword);

// Perfil (rutas protegidas)
router.get('/perfil', auth, authController.obtenerPerfil);
router.put('/perfil', auth, authController.actualizarPerfil);
router.post('/cambiar-password', auth, authController.cambiarPassword);
router.post('/reautenticar', auth, authController.reautenticar);

module.exports = router;
