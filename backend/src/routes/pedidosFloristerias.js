const express = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  crearPedido,
  obtenerMisPedidos,
  obtenerTodosPedidos,
  actualizarEstadoPedido
} = require('../controllers/pedidoFloristeriasController');

const router = express.Router();

// Rutas para usuarios
router.post('/', auth, crearPedido);
router.get('/mis-pedidos', auth, obtenerMisPedidos);

// Rutas para administrador
router.get('/todos', auth, isAdmin, obtenerTodosPedidos);
router.put('/:id', auth, isAdmin, actualizarEstadoPedido);

module.exports = router;
