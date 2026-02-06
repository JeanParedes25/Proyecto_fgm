const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  celular: {
    type: String,
    default: null,
    trim: true
  },
  password: {
    type: String,
    default: null
  },
  rol: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  },
  proveedor: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  fotoGoogle: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    default: null,
    sparse: true
  },
  lastPasswordChange: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  recoveryAttempts: {
    type: Number,
    default: 0
  },
  recoveryLockUntil: {
    type: Date,
    default: null
  },
  codigoCorreo: {
    type: String,
    default: null
  },
  codigoCorreoExpira: {
    type: Date,
    default: null
  },
  verificadoCorreo: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    required: true,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

usuarioSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');
