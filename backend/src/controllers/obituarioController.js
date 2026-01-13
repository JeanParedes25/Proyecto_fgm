const Obituario = require('../models/obituario');
const path = require('path');
const fs = require('fs');

// Obtener todos los obituarios
const obtenerObituarios = async (req, res) => {
  try {
    const obituarios = await Obituario.obtenerTodos();
    
    const obituariosConUrl = obituarios.map(obit => {
      const obj = obit.toObject ? obit.toObject() : obit;
      
      // Procesar fotos si existen
      if (obj.fotos && Array.isArray(obj.fotos)) {
        obj.fotos = obj.fotos.map(foto => ({
          ...foto,
          url: foto.url ? `http://localhost:5000${foto.url}` : foto.url
        }));
      }
      
      return {
        ...obj,
        imagen_url: obj.imagen_url ? `http://localhost:5000${obj.imagen_url}` : null
      };
    });
    
    res.json({ 
      success: true, 
      obituarios: obituariosConUrl 
    });
  } catch (error) {
    console.error('Error al obtener obituarios:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al obtener obituarios: ' + error.message
    });
  }
};

// Obtener obituario por ID
const obtenerObituarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const obituario = await Obituario.obtenerPorId(id);
    
    if (!obituario) {
      return res.status(404).json({ 
        success: false, 
        mensaje: 'Obituario no encontrado' 
      });
    }
    
    const obj = obituario.toObject ? obituario.toObject() : obituario;
    
    // Procesar fotos si existen
    if (obj.fotos && Array.isArray(obj.fotos)) {
      obj.fotos = obj.fotos.map(foto => ({
        ...foto,
        url: foto.url ? `http://localhost:5000${foto.url}` : foto.url
      }));
    }
    
    if (obj.imagen_url) {
      obj.imagen_url = `http://localhost:5000${obj.imagen_url}`;
    }
    
    res.json({ 
      success: true, 
      obituario: obj
    });
  } catch (error) {
    console.error('Error al obtener obituario:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al obtener obituario: ' + error.message
    });
  }
};

// Crear nuevo obituario
const crearObituario = async (req, res) => {
  try {
    console.log('\n========== CREAR OBITUARIO ==========');
    console.log('Body recibido:', req.body);
    console.log('Archivos recibidos:', req.files);
    
    const { nombreCompleto, mensajeRecordatorio, arteMortuorio, fechaFallecimiento } = req.body;
    
    console.log('Desglose:', { nombreCompleto, mensajeRecordatorio, arteMortuorio, fechaFallecimiento });
    
    if (!nombreCompleto || !mensajeRecordatorio || !arteMortuorio || !fechaFallecimiento) {
      console.log('❌ Validación fallida: Campos faltantes');
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Todos los campos son obligatorios' 
      });
    }
    
    if (!req.files || req.files.length === 0) {
      console.log('❌ Validación fallida: Sin imágenes');
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Debes cargar al menos una imagen' 
      });
    }
    
    // Procesar fotos
    const fotos = req.files.map((file, index) => {
      const descripcion = req.body[`fotos[${index}][descripcion]`] || '';
      return {
        url: '/uploads/obituarios/' + file.filename,
        descripcion: descripcion
      };
    });
    
    console.log('Fotos procesadas:', fotos);
    
    // Mantener compatibilidad con imagen_url usando la primera foto
    const imagenUrl = fotos.length > 0 ? fotos[0].url : null;
    
    console.log('Llamando a Obituario.crear()...');
    const obituarioId = await Obituario.crear({
      nombreCompleto,
      fechaFallecimiento,
      imagenUrl,
      fotos,
      mensajeRecordatorio,
      arteMortuorio
    });
    
    console.log('✅ Obituario creado exitosamente con ID:', obituarioId);
    console.log('=====================================\n');
    
    res.status(201).json({ 
      success: true, 
      mensaje: 'Obituario creado exitosamente',
      obituarioId 
    });
  } catch (error) {
    console.error('❌ ERROR AL CREAR OBITUARIO:', error);
    console.error('Stack:', error.stack);
    console.log('=====================================\n');
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al crear obituario: ' + error.message
    });
  }
};

// Actualizar obituario
const actualizarObituario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, mensajeRecordatorio, arteMortuorio, fechaFallecimiento, fotosExistentes } = req.body;
    
    const obituarioExistente = await Obituario.obtenerPorId(id);
    if (!obituarioExistente) {
      return res.status(404).json({ 
        success: false, 
        mensaje: 'Obituario no encontrado' 
      });
    }
    
    const datosActualizar = {};
    
    if (nombreCompleto) datosActualizar.nombreCompleto = nombreCompleto;
    if (mensajeRecordatorio) datosActualizar.mensajeRecordatorio = mensajeRecordatorio;
    if (arteMortuorio) datosActualizar.arteMortuorio = arteMortuorio;
    if (fechaFallecimiento) datosActualizar.fechaFallecimiento = fechaFallecimiento;
    
    // Procesar fotos
    let fotos = [];
    if (fotosExistentes) {
      fotos = JSON.parse(fotosExistentes);
    }
    
    // Agregar fotos nuevas
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const descripcion = req.body[`fotos[${index}][descripcion]`] || '';
        fotos.push({
          url: '/uploads/obituarios/' + file.filename,
          descripcion: descripcion
        });
      });
    }
    
    if (fotos.length > 0) {
      datosActualizar.fotos = fotos;
      datosActualizar.imagenUrl = fotos[0].url; // Primera foto como imagen principal
    }
    
    const actualizado = await Obituario.actualizar(id, datosActualizar);
    
    if (actualizado) {
      res.json({ 
        success: true, 
        mensaje: 'Obituario actualizado exitosamente' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        mensaje: 'No se pudo actualizar el obituario' 
      });
    }
  } catch (error) {
    console.error('Error al actualizar obituario:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al actualizar obituario: ' + error.message
    });
  }
};

// Eliminar obituario
const eliminarObituario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const obituario = await Obituario.obtenerPorId(id);
    if (!obituario) {
      return res.status(404).json({ 
        success: false, 
        mensaje: 'Obituario no encontrado' 
      });
    }
    
    const obj = obituario.toObject ? obituario.toObject() : obituario;
    
    // Eliminar imagen principal si existe
    if (obj.imagen_url) {
      const imagePath = path.join(__dirname, '../..', obj.imagen_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Eliminar todas las fotos si existen
    if (obj.fotos && Array.isArray(obj.fotos)) {
      obj.fotos.forEach(foto => {
        if (foto.url) {
          const fotoPath = path.join(__dirname, '../..', foto.url);
          if (fs.existsSync(fotoPath)) {
            fs.unlinkSync(fotoPath);
          }
        }
      });
    }
    
    const eliminado = await Obituario.eliminar(id);
    
    if (eliminado) {
      res.json({ 
        success: true, 
        mensaje: 'Obituario eliminado exitosamente' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        mensaje: 'No se pudo eliminar el obituario' 
      });
    }
  } catch (error) {
    console.error('Error al eliminar obituario:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al eliminar obituario: ' + error.message
    });
  }
};

// Obtener obituarios recientes
const obtenerObituariosRecientes = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    const obituarios = await Obituario.obtenerRecientes(limite);
    
    const obituariosConUrl = obituarios.map(obit => {
      const obj = obit.toObject ? obit.toObject() : obit;
      
      // Procesar fotos si existen
      if (obj.fotos && Array.isArray(obj.fotos)) {
        obj.fotos = obj.fotos.map(foto => ({
          ...foto,
          url: foto.url ? `http://localhost:5000${foto.url}` : foto.url
        }));
      }
      
      return {
        ...obj,
        imagen_url: obj.imagen_url ? `http://localhost:5000${obj.imagen_url}` : null
      };
    });
    
    res.json({ 
      success: true, 
      obituarios: obituariosConUrl 
    });
  } catch (error) {
    console.error('Error al obtener obituarios recientes:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al obtener obituarios recientes: ' + error.message
    });
  }
};

module.exports = {
  obtenerObituarios,
  obtenerObituarioPorId,
  crearObituario,
  actualizarObituario,
  eliminarObituario,
  obtenerObituariosRecientes
};
