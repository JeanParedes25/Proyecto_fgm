const express = require('express');
const router = express.Router();
const { obtenerLogs, obtenerEstadisticas } = require('../controllers/auditController');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// Obtener logs de auditoría (solo admin)
router.get('/logs', auth, isAdmin, obtenerLogs);

// Obtener estadísticas de auditoría (solo admin)
router.get('/estadisticas', auth, isAdmin, obtenerEstadisticas);

module.exports = router;
