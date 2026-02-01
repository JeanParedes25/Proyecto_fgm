const mongoose = require('mongoose');

const asistenciaPrepagoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: false,
    min: 0
  },
  descripcion: {
    type: String,
    required: false,
    trim: true
  },
  beneficios: [{
    type: String,
    trim: true
  }],
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
asistenciaPrepagoSchema.index({ activo: 1, destacado: -1, precio: 1 });
asistenciaPrepagoSchema.index({ nombre: 1 });

module.exports = mongoose.model('AsistenciaPrepago', asistenciaPrepagoSchema);
