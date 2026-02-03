const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema({
  // Información de la empresa
  nombreEmpresa: {
    type: String,
    default: 'Funerales Gonzalo Mendoza'
  },
  telefono1: {
    type: String,
    default: '099 28 29 095'
  },
  telefono2: {
    type: String,
    default: '099 90 90 860'
  },
  telefonoOficina: {
    type: String,
    default: '032 944 608'
  },
  email: {
    type: String,
    default: 'israelmendoza18@hotmail.com'
  },
  direccion: {
    type: String,
    default: 'España y Olmedo, Riobamba, Ecuador'
  },
  
  // Siempre habrá solo un documento de configuración
  esUnico: {
    type: Boolean,
    default: true,
    unique: true
  },
  
  ultimaActualizacion: {
    type: Date,
    default: Date.now
  }
});

// Asegurar que solo exista un documento de configuración
configuracionSchema.pre('save', function() {
  this.ultimaActualizacion = Date.now();
});

module.exports = mongoose.model('Configuracion', configuracionSchema);
