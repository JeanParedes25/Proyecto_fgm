const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Rutas públicas (para usuarios)
router.get('/', planController.obtenerPlanes);
router.get('/:id', planController.obtenerPlanPorId);

// Rutas protegidas - Solo administradores
router.get('/admin/todos', auth, isAdmin, planController.obtenerTodosPlanes);
router.post('/', auth, isAdmin, planController.crearPlan);
router.put('/:id', auth, isAdmin, planController.actualizarPlan);
router.delete('/:id', auth, isAdmin, planController.eliminarPlan);
router.delete('/:id/permanente', auth, isAdmin, planController.eliminarPlanPermanente);
router.patch('/:id/destacado', auth, isAdmin, planController.toggleDestacado);

module.exports = router;
