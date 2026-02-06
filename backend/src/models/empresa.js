const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  // Información de la empresa
  nombreEmpresa: {
    type: String,
    required: true,
    default: 'Funerales Gonzalo Mendoza'
  },
  
  direccion: {
    type: String,
    required: true,
    default: 'España 19-31 y Olmedo, Riobamba - Ecuador'
  },
  
  telefonos: {
    type: [String],
    default: ['099 282 9095', '032 944 608', '098 402 1738']
  },
  
  correo: {
    type: String,
    required: true,
    default: 'israelmendoza18@hotmail.com'
  },
  
  paginaWeb: {
    type: String,
    default: 'www.funeralesgonzalomendoza.com'
  },
  
  derechosReservados: {
    type: String,
    default: '© Funerales Gonzalo Mendoza. Todos los derechos reservados.'
  },
  
  // Asegurar que solo exista un documento
  esUnico: {
    type: Boolean,
    default: true,
    unique: true
  },
  
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, { collection: 'empresa' });

// Middleware para actualizar fechaActualizacion antes de guardar
empresaSchema.pre('save', function() {
  this.fechaActualizacion = Date.now();
});

// Middleware para actualizar fechaActualizacion antes de updateOne
empresaSchema.pre('findOneAndUpdate', function() {
  this.set({ fechaActualizacion: Date.now() });
});

module.exports = mongoose.model('Empresa', empresaSchema);
