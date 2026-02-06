const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const {
  obtenerNotificacionesNoLeidas,
  obtenerTodasNotificaciones,
  marcarLeida,
  eliminarNotificacion
} = require('../controllers/notificacionFloristeriasController');

const router = express.Router();

// Rutas para administrador
router.get('/no-leidas', auth, isAdmin, obtenerNotificacionesNoLeidas);
router.get('/', auth, isAdmin, obtenerTodasNotificaciones);
router.put('/:id/leer', auth, isAdmin, marcarLeida);
router.delete('/:id', auth, isAdmin, eliminarNotificacion);

module.exports = router;
