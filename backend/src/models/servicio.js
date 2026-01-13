const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    nombrePlan: {
      type: String,
      trim: true
    },
    icono: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      trim: true
    },
    descripcionPlan: {
      type: String,
      trim: true
    },
    introduccion: {
      type: String,
      required: true
    },
    cantidadSalas: {
      type: Number,
      default: 0
    },
    includes: [
      {
        type: String
      }
    ],
    additional: [
      {
        type: String
      }
    ],
    noChargeServices: [
      {
        type: String
      }
    ],
    extraServices: [
      {
        type: String
      }
    ],
    brindamos: [
      {
        type: String
      }
    ],
    fotos: [
      {
        url: {
          type: String
        },
        descripcion: {
          type: String
        }
      }
    ],
    halls: [
      {
        type: String
      }
    ],
    capacity: {
      type: String
    },
    precio: {
      type: Number,
      default: 0
    },
    ataudes: [
      {
        nombre: {
          type: String
        },
        imagen: {
          type: String
        },
        descripcion: {
          type: String
        },
        precio: {
          type: Number,
          default: 0
        }
      }
    ],
    misaEnVivo: {
      disponible: {
        type: Boolean,
        default: false
      },
      precio: {
        type: Number,
        default: 0
      }
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Servicio = mongoose.model('Servicio', servicioSchema);

module.exports = Servicio;
