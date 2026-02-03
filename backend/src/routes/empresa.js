const express = require('express');
const router = express.Router();
const { obtenerEmpresa, actualizarEmpresa } = require('../controllers/empresaController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET - Obtener información de la empresa (público)
router.get('/', obtenerEmpresa);

// PUT - Actualizar información de la empresa (solo administrador)
router.put('/', auth, isAdmin, actualizarEmpresa);

module.exports = router;
