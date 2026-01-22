const mongoose = require('mongoose');

const pedidoFloristeriasSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  nombreCliente: {
    type: String,
    required: true
  },
  codigoArreglo: {
    type: String,
    required: true
  },
  arregloId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flor',
    required: true
  },
  descripcionArreglo: {
    type: String,
    required: true
  },
  nombrePersonaFallecida: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'entregado'],
    default: 'pendiente'
  },
  observaciones: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PedidoFloristeria', pedidoFloristeriasSchema);
