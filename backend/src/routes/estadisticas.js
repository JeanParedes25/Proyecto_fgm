const express = require('express');
const router = express.Router();
const {
  obtenerEstadisticas,
  obtenerLogsAuditoria,
  obtenerUsuarios
} = require('../controllers/estadisticasController');

// Rutas públicas
router.get('/', obtenerEstadisticas);
router.get('/auditoria', obtenerLogsAuditoria);
router.get('/usuarios', obtenerUsuarios);

module.exports = router;
