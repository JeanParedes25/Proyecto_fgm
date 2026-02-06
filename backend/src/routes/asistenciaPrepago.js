const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const asistenciaPrepagoController = require('../controllers/asistenciaPrepagoController');

// Rutas públicas (usuarios)
router.get('/activos', asistenciaPrepagoController.obtenerPlanesActivos);
router.get('/:id', asistenciaPrepagoController.obtenerPlanPorId);

// Rutas protegidas (solo admin)
router.get('/admin/todos', auth, isAdmin, asistenciaPrepagoController.obtenerTodosPlanes);
router.post('/', auth, isAdmin, asistenciaPrepagoController.crearPlan);
router.put('/:id', auth, isAdmin, asistenciaPrepagoController.actualizarPlan);
router.delete('/:id', auth, isAdmin, asistenciaPrepagoController.eliminarPlan);
router.patch('/:id/destacado', auth, isAdmin, asistenciaPrepagoController.toggleDestacado);

module.exports = router;
