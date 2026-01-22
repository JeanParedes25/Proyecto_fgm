const mongoose = require('mongoose');

const florSchema = new mongoose.Schema(
  {
    codigo: {
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
      type: Number,
      required: true
    },
    fotos: [
      {
        url: String,
        descripcion: String
      }
    ],
    image: {
      type: String
    }
  },
  { timestamps: true }
);

const Flor = mongoose.model('Flor', florSchema, 'floristerias');

module.exports = Flor;
