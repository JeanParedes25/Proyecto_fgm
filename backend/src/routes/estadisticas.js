const express = require('express');
const router = express.Router();
const {
  obtenerEstadisticas,
  obtenerLogsAuditoria,
  obtenerUsuarios
} = require('../controllers/estadisticasController');
const estadisticasFloresController = require('../controllers/estadisticasFloresController');
const { isAdmin } = require('../middleware/auth');
const auth = require('../middleware/auth');

// Rutas públicas
router.get('/', obtenerEstadisticas);
router.get('/auditoria', obtenerLogsAuditoria);
router.get('/usuarios', obtenerUsuarios);

// Rutas de flores
router.get('/flores', estadisticasFloresController.obtenerEstadisticasFlores);
router.get('/flores/periodo', estadisticasFloresController.obtenerEstadisticasPorPeriodo);

// Ruta para el dashboard del admin - estadísticas de pedidos flores
router.get('/admin/pedidos-flores', auth, isAdmin, estadisticasFloresController.obtenerEstadisticasPedidosFlores);

module.exports = router;
