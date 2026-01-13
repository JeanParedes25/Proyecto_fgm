const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['login', 'logout', 'create', 'update', 'delete'],
    required: true
  },
  usuario: {
    type: String,
    default: 'Sistema'
  },
  email: {
    type: String,
    default: null
  },
  descripcion: {
    type: String,
    required: true
  },
  entidad: {
    type: String,
    enum: ['cliente', 'obituario', 'usuario'],
    required: true
  },
  entidadId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
