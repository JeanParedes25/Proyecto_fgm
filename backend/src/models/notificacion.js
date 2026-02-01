const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['floristeria', 'plan', 'seguro', 'servicio', 'obituario', 'cliente', 'general']
  },
  titulo: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  datos: {
    type: mongoose.Schema.Types.Mixed, // Datos específicos según el tipo
    default: {}
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

module.exports = mongoose.model('Notificacion', notificacionSchema);
