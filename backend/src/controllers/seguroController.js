const Seguro = require('../models/seguro');

// Obtener información del seguro por tipo
exports.obtenerSeguroPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const seguro = await Seguro.findOne({ tipo, activo: true });
    
    if (!seguro) {
      return res.status(404).json({ mensaje: 'Información no disponible' });
    }
    
    res.json(seguro);
  } catch (error) {
    console.error('Error al obtener seguro:', error);
    res.status(500).json({ mensaje: 'Error al obtener la información' });
  }
};

// Obtener todos los seguros
exports.obtenerSeguros = async (req, res) => {
  try {
    const seguros = await Seguro.find({ activo: true });
    res.json(seguros);
  } catch (error) {
    console.error('Error al obtener seguros:', error);
    res.status(500).json({ mensaje: 'Error al obtener los seguros' });
  }
};
