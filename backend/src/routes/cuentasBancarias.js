const express = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  obtenerCuentas,
  crearCuenta,
  actualizarCuenta,
  desactivarCuenta,
  obtenerTodasCuentas
} = require('../controllers/cuentaBancariaController');

const router = express.Router();

// Rutas para administrador (las específicas primero)
router.get('/todas', auth, isAdmin, obtenerTodasCuentas);
router.post('/', auth, isAdmin, crearCuenta);
router.put('/:id', auth, isAdmin, actualizarCuenta);
router.delete('/:id', auth, isAdmin, desactivarCuenta);

// Rutas públicas (cualquier usuario autenticado)
router.get('/', auth, obtenerCuentas);

module.exports = router;
