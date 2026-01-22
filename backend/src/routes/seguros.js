const express = require('express');
const router = express.Router();
const seguroController = require('../controllers/seguroController');

// Rutas públicas
router.get('/', seguroController.obtenerSeguros);
router.get('/:tipo', seguroController.obtenerSeguroPorTipo);

module.exports = router;
