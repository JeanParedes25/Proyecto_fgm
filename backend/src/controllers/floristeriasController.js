const Flor = require('../models/flor');
const fs = require('fs');
const path = require('path');

// Obtener todas las flores
const obtenerFlores = async (req, res) => {
  try {
    const flores = await Flor.find().sort({ createdAt: -1 });
    
    const floresConUrl = flores.map(flor => {
      const obj = flor.toObject ? flor.toObject() : flor;
      
      // Procesar fotos (nueva estructura)
      if (obj.fotos && Array.isArray(obj.fotos)) {
        obj.fotos = obj.fotos.map(foto => ({
          ...foto,
          url: foto.url ? (foto.url.startsWith('http') ? foto.url : `http://localhost:5000${foto.url}`) : foto.url
        }));
      }
      
      // Procesar image (estructura antigua) - mantener compatibilidad
      if (obj.image) {
        obj.image = obj.image.startsWith('http') ? obj.image : `http://localhost:5000${obj.image}`;
      }
      
      return obj;
    });
    
    res.json({
      success: true,
      mensaje: 'Flores obtenidas exitosamente',
      flores: floresConUrl
    });
  } catch (error) {
    console.error('Error al obtener flores:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las flores',
      error: error.message
    });
  }
};

// Obtener flor por ID
const obtenerFlorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const flor = await Flor.findById(id);

    if (!flor) {
      return res.status(404).json({
        success: false,
        mensaje: 'Flor no encontrada'
      });
    }

    const obj = flor.toObject ? flor.toObject() : flor;
    
    // Procesar fotos (nueva estructura)
    if (obj.fotos && Array.isArray(obj.fotos)) {
      obj.fotos = obj.fotos.map(foto => ({
        ...foto,
        url: foto.url ? (foto.url.startsWith('http') ? foto.url : `http://localhost:5000${foto.url}`) : foto.url
      }));
    }
    
    // Procesar image (estructura antigua) - mantener compatibilidad
    if (obj.image) {
      obj.image = obj.image.startsWith('http') ? obj.image : `http://localhost:5000${obj.image}`;
    }

    res.json({
      success: true,
      mensaje: 'Flor obtenida exitosamente',
      flor: obj
    });
  } catch (error) {
    console.error('Error al obtener flor:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener la flor',
      error: error.message
    });
  }
};

// Crear nueva flor
const crearFlor = async (req, res) => {
  try {
    const { codigo, descripcion, precio } = req.body;

    if (!codigo || !precio) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos requeridos: codigo, precio'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debes cargar al menos una imagen'
      });
    }

    const fotos = req.files.map((file, index) => {
      const descripcionFoto = req.body[`fotoMeta[${index}][descripcion]`] || '';
      return {
        url: '/uploads/floristerias/' + file.filename,
        descripcion: descripcionFoto
      };
    });

    const nuevaFlor = new Flor({
      codigo,
      descripcion,
      precio: parseFloat(precio),
      fotos
    });

    await nuevaFlor.save();

    res.status(201).json({
      success: true,
      mensaje: 'Flor creada exitosamente',
      flor: nuevaFlor
    });
  } catch (error) {
    console.error('Error al crear flor:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear la flor',
      error: error.message
    });
  }
};

// Actualizar flor
const actualizarFlor = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descripcion, precio, fotosExistentes } = req.body;

    const flor = await Flor.findById(id);
    if (!flor) {
      return res.status(404).json({
        success: false,
        mensaje: 'Flor no encontrada'
      });
    }

    if (codigo) flor.codigo = codigo;
    if (descripcion !== undefined) flor.descripcion = descripcion;
    if (precio) flor.precio = parseFloat(precio);

    let fotos = [];
    if (fotosExistentes) {
      try { fotos = JSON.parse(fotosExistentes); } catch { fotos = []; }
    }
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const desc = req.body[`fotoMeta[${index}][descripcion]`] || '';
        fotos.push({ url: '/uploads/floristerias/' + file.filename, descripcion: desc });
      });
    }
    flor.fotos = fotos;

    await flor.save();

    res.json({
      success: true,
      mensaje: 'Flor actualizada exitosamente',
      flor
    });
  } catch (error) {
    console.error('Error al actualizar flor:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar la flor',
      error: error.message
    });
  }
};

// Eliminar flor
const eliminarFlor = async (req, res) => {
  try {
    const { id } = req.params;

    const flor = await Flor.findByIdAndDelete(id);

    if (!flor) {
      return res.status(404).json({
        success: false,
        mensaje: 'Flor no encontrada'
      });
    }

    // Eliminar imágenes del servidor
    if (flor.fotos && Array.isArray(flor.fotos)) {
      flor.fotos.forEach(foto => {
        if (foto.url) {
          const filename = foto.url.split('/').pop();
          const imagePath = path.join(__dirname, '../../uploads/floristerias', filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }

    res.json({
      success: true,
      mensaje: 'Flor eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar flor:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar la flor',
      error: error.message
    });
  }
};

module.exports = {
  obtenerFlores,
  obtenerFlorPorId,
  crearFlor,
  actualizarFlor,
  eliminarFlor
};
