const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  usuarioId: {
    type: String,
    default: null
  },
  nombreUsuario: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    required: true
  },
  accion: {
    type: String,
    enum: ['LOGIN', 'CREATE', 'UPDATE', 'DELETE'],
    required: true
  },
  modulo: {
    type: String,
    enum: ['Usuarios', 'Pedidos', 'Planes', 'Empresa', 'Obituarios'],
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    default: null
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema, 'auditoria');
