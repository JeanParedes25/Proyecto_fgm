const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

// Registro
router.post('/register', authController.register);

// Verificación de correo (después del registro)
router.post('/verificar-codigo-correo', authController.verificarCodigoCorreo);
router.post('/reenviar-codigo-verificacion', authController.reenviarCodigoVerificacion);

// Login
router.post('/login', authController.login);

// Google OAuth
router.post('/google', authController.googleLogin);

// Recuperación de contraseña SOLO con código por correo
router.post('/enviar-codigo-recuperacion', authController.enviarCodigoRecuperacionPassword);
router.post('/verificar-codigo-recuperacion', authController.verificarCodigoRecuperacionPassword);

// Perfil (rutas protegidas)
router.get('/perfil', auth, authController.obtenerPerfil);
router.put('/perfil', auth, authController.actualizarPerfil);
router.post('/cambiar-password', auth, authController.cambiarPassword);
router.post('/reautenticar', auth, authController.reautenticar);

module.exports = router;
