const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Todas las rutas requieren autenticación de admin
router.use(auth);
router.use(isAdmin);

// Obtener todas las notificaciones
router.get('/', notificacionController.obtenerNotificaciones);

// Obtener notificaciones no leídas
router.get('/no-leidas', notificacionController.obtenerNotificacionesNoLeidas);

// Marcar notificación como leída
router.put('/:id/leer', notificacionController.marcarComoLeida);

// Marcar todas como leídas
router.put('/marcar-todas-leidas', notificacionController.marcarTodasComoLeidas);

// Eliminar notificación
router.delete('/:id', notificacionController.eliminarNotificacion);

// Eliminar notificaciones leídas
router.delete('/limpiar/leidas', notificacionController.eliminarLeidas);

module.exports = router;
