const express = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
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
