const express = require('express');
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/', auth, isAdmin, usuariosController.listarUsuarios);
router.post('/', auth, isAdmin, usuariosController.crearUsuario);

module.exports = router;
