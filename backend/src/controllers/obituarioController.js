const Obituario = require('../models/obituario');
const path = require('path');
const fs = require('fs');

// Obtener todos los obituarios
const obtenerObituarios = async (req, res) => {
  try {
    const obituarios = await Obituario.obtenerTodos();
    
    const obituariosConUrl = obituarios.map(obit => {
      const obj = obit.toObject ? obit.toObject() : obit;
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
    console.log('Archivo recibido:', req.file);
    
    const { nombreCompleto, mensajeRecordatorio, arteMortuorio, fechaFallecimiento } = req.body;
    
    console.log('Desglose:', { nombreCompleto, mensajeRecordatorio, arteMortuorio, fechaFallecimiento });
    
    if (!nombreCompleto || !mensajeRecordatorio || !arteMortuorio || !fechaFallecimiento) {
      console.log('❌ Validación fallida: Campos faltantes');
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Todos los campos son obligatorios' 
      });
    }
    
    if (!req.file) {
      console.log('❌ Validación fallida: Sin imagen');
      return res.status(400).json({ 
        success: false, 
        mensaje: 'La imagen es obligatoria' 
      });
    }
    
    let imagenUrl = null;
    if (req.file) {
      imagenUrl = '/uploads/obituarios/' + req.file.filename;
      console.log('Imagen subida:', imagenUrl);
    }
    
    console.log('Llamando a Obituario.crear()...');
    const obituarioId = await Obituario.crear({
      nombreCompleto,
      fechaFallecimiento,
      imagenUrl,
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
    const { nombreCompleto, mensajeRecordatorio, arteMortuorio, fechaFallecimiento } = req.body;
    
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
    
    if (req.file) {
      datosActualizar.imagenUrl = '/uploads/obituarios/' + req.file.filename;
      
      const existente = obituarioExistente.toObject ? obituarioExistente.toObject() : obituarioExistente;
      if (existente.imagen_url) {
        const oldImagePath = path.join(__dirname, '../..', existente.imagen_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
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
    if (obj.imagen_url) {
      const imagePath = path.join(__dirname, '../..', obj.imagen_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
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
