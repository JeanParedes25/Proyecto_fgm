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
  beneficios: [{
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
  collection: 'servicios' // Nombre explícito de la colección
});

module.exports = mongoose.model('Seguro', seguroSchema);
