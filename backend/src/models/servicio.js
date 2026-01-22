const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    descripcion: {
      type: String,
      trim: true
    },
    precio: {
      type: Number
    },
    fotos: [
      {
        url: { type: String },
        descripcion: { type: String }
      }
    ],
    activo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Forzar uso de colección única "services"
const Servicio = mongoose.model('Servicio', servicioSchema, 'services');

module.exports = Servicio;
