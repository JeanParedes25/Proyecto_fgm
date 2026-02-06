const express = require('express');
const usuariosController = require('../controllers/usuariosController');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, isAdmin, usuariosController.listarUsuarios);
router.post('/', auth, isAdmin, usuariosController.crearUsuario);

module.exports = router;
