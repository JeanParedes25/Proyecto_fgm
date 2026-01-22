const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  tipoCofre: {
    type: String,
    required: true,
    trim: true
  },
  duracionVelacion: {
    type: String,
    required: true,
    trim: true
  },
  salasIncluidas: [{
    type: String,
    trim: true
  }],
  procedimientos: {
    formolizacion: {
      type: Boolean,
      default: false
    },
    tanatopraxia: {
      type: Boolean,
      default: false
    },
    otros: {
      type: String,
      default: ''
    }
  },
  transporte: {
    autocarroza: {
      type: Boolean,
      default: false
    },
    detalles: {
      type: String,
      default: ''
    }
  },
  arregloFloral: {
    incluido: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  tramitesLegales: {
    incluido: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  mediosComunicacion: {
    incluido: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  obituariosDomiciliarios: {
    incluido: {
      type: Boolean,
      default: false
    },
    cantidad: {
      type: Number,
      default: 0
    }
  },
  cafeteria: {
    bebidas: {
      type: Boolean,
      default: false
    },
    vasosTermicos: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  insumosSala: {
    incluido: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  serviciosReligiosos: {
    incluido: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  mediosDigitales: {
    videoHomenaje: {
      type: Boolean,
      default: false
    },
    facebookLive: {
      type: Boolean,
      default: false
    },
    otros: {
      type: String,
      default: ''
    }
  },
  infraestructura: {
    incluido: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  equipoFuneraria: {
    incluido: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  activo: {
    type: Boolean,
    default: true
  },
  destacado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de consultas
planSchema.index({ activo: 1, destacado: -1, precio: 1 });
planSchema.index({ nombre: 1 });
planSchema.index({ precio: 1 });

module.exports = mongoose.model('Plan', planSchema);
