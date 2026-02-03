const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracionController');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// Obtener configuración (solo admin)
router.get('/', auth, isAdmin, configuracionController.obtenerConfiguracion);

// Actualizar configuración (solo admin)
router.put('/', auth, isAdmin, configuracionController.actualizarConfiguracion);

module.exports = router;
