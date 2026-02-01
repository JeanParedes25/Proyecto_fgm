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
  emailCliente: {
    type: String,
    default: ''
  },
  telefonoCliente: {
    type: String,
    default: ''
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
    default: 'Sin descripción'
  },
  nombrePersonaFallecida: {
    type: String,
    required: true
  },
  precioUnitario: {
    type: Number,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'entregado', 'cancelado', 'cancelado_admin', 'cancelado_usuario'],
    default: 'pendiente'
  },
  notificacionEnviada: {
    type: Boolean,
    default: false
  },
  observaciones: {
    type: String,
    default: ''
  },
  fechaPedido: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'pedidos_flores' });

module.exports = mongoose.model('PedidoFloristeria', pedidoFloristeriasSchema);
