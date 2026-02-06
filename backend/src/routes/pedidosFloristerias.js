const express = require('express');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const {
  crearPedido,
  obtenerMisPedidos,
  obtenerTodosPedidos,
  actualizarEstadoPedido,
  obtenerCambiosNoLeidos,
  marcarCambiosComoVistos,
  obtenerPedidosNuevosCount,
  marcarPedidosComoRevisados
} = require('../controllers/pedidoFloristeriasController');

const router = express.Router();

// Rutas específicas del admin PRIMERO
router.get('/admin/nuevos-count', auth, isAdmin, obtenerPedidosNuevosCount);
router.put('/admin/marcar-revisados', auth, isAdmin, marcarPedidosComoRevisados);

// Rutas para usuarios
router.post('/', auth, crearPedido);
router.get('/mis-pedidos', auth, obtenerMisPedidos);
router.get('/cambios-no-leidos', auth, obtenerCambiosNoLeidos);
router.put('/cambios-como-vistos', auth, marcarCambiosComoVistos);

// Rutas para obtener pedidos (DESPUÉS de las específicas)
router.get('/todos', auth, isAdmin, obtenerTodosPedidos);
router.put('/:id', auth, isAdmin, actualizarEstadoPedido);

module.exports = router;
