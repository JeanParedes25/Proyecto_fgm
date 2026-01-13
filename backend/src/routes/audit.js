const express = require('express');
const router = express.Router();
const { obtenerLogs, obtenerEstadisticas } = require('../controllers/auditController');

// Obtener logs de auditoría
router.get('/logs', obtenerLogs);

// Obtener estadísticas de auditoría
router.get('/estadisticas', obtenerEstadisticas);

module.exports = router;
