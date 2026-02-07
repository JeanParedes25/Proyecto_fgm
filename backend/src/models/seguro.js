const mongoose = require('mongoose');

const seguroSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['exequial', 'prepago'],
    unique: true
  },
  titulo: {
    type: String,
    required: true
  },
  subtitulo: {
    type: String,
    default: ''
  },
  descripcion: {
    type: String,
    default: ''
  },
  precio: {
    type: Number,
    default: 0
  },
  beneficios: [{
    type: String
  }],
  caracteristicas: [{
    type: String
  }],
  coberturas: [{
    type: String
  }],
  requisitos: [{
    type: String
  }],
  contacto: {
    correo: String,
    web: String,
    direccion: String,
    telefonos: [String]
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'seguros' // Nombre correcto de la colección
});

module.exports = mongoose.model('Seguro', seguroSchema);
