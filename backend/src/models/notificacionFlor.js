const mongoose = require('mongoose');

const notificacionFloristeriasSchema = new mongoose.Schema({
  pedidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PedidoFloristeria',
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
  nombrePersonaFallecida: {
    type: String,
    required: true
  },
  descripcionArreglo: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  leida: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NotificacionFloristeria', notificacionFloristeriasSchema);
