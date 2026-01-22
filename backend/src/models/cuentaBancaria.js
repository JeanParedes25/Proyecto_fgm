const mongoose = require('mongoose');

const cuentaBancariaSchema = new mongoose.Schema({
  banco: {
    type: String,
    required: true,
    enum: ['Banco Pichincha', 'Banco Internacional', 'Otros']
  },
  numeroCuenta: {
    type: String,
    required: true,
    unique: true
  },
  tipoCuenta: {
    type: String,
    required: true,
    enum: ['Ahorros', 'Corriente']
  },
  nombreTitular: {
    type: String,
    required: true
  },
  activa: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'cuentas' });

module.exports = mongoose.model('CuentaBancaria', cuentaBancariaSchema);
