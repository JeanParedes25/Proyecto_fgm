const mongoose = require('mongoose');

const obituarioSchema = new mongoose.Schema({
  nombre_completo: {
    type: String,
    required: true
  },
  fecha_fallecimiento: {
    type: Date,
    required: true
  },
  imagen_url: {
    type: String,
    default: null
  },
  fotos: [{
    url: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      default: ''
    }
  }],
  mensaje_recordatorio: {
    type: String,
    required: true
  },
  arte_mortuorio: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const ObituarioModel = mongoose.model('obituarios', obituarioSchema, 'obituarios');

class Obituario {
  // Método para verificar conexión (compatible con el servidor)
  static async crearTabla() {
    try {
      console.log('✅ Colección de obituarios lista en MongoDB');
      return true;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  }

  // Obtener todos los obituarios
  static async obtenerTodos() {
    try {
      console.log('Obteniendo todos los obituarios de MongoDB...');
      const obituarios = await ObituarioModel.find().sort({ fecha_fallecimiento: -1, created_at: -1 });
      console.log('Obituarios obtenidos:', obituarios.length);
      return obituarios;
    } catch (err) {
      console.error('Error al obtener obituarios:', err);
      throw err;
    }
  }

  // Obtener obituario por ID
  static async obtenerPorId(id) {
    try {
      console.log('Obteniendo obituario por ID:', id);
      const obituario = await ObituarioModel.findById(id);
      return obituario;
    } catch (err) {
      console.error('Error al obtener obituario por ID:', err);
      throw err;
    }
  }

  // Crear nuevo obituario
  static async crear(datos) {
    try {
      console.log('Creando nuevo obituario:', datos.nombreCompleto);
      
      const nuevoObituario = new ObituarioModel({
        nombre_completo: datos.nombreCompleto,
        fecha_fallecimiento: datos.fechaFallecimiento,
        imagen_url: datos.imagenUrl || null,
        fotos: datos.fotos || [],
        mensaje_recordatorio: datos.mensajeRecordatorio,
        arte_mortuorio: datos.arteMortuorio
      });

      const obituarioGuardado = await nuevoObituario.save();
      console.log('Obituario creado exitosamente:', obituarioGuardado._id);
      return obituarioGuardado._id;
    } catch (err) {
      console.error('Error al crear obituario:', err);
      throw err;
    }
  }

  // Actualizar obituario
  static async actualizar(id, datos) {
    try {
      console.log('Actualizando obituario:', id);
      
      const actualizacion = {};
      
      if (datos.nombreCompleto !== undefined) {
        actualizacion.nombre_completo = datos.nombreCompleto;
      }
      if (datos.fechaFallecimiento !== undefined) {
        actualizacion.fecha_fallecimiento = datos.fechaFallecimiento;
      }
      if (datos.imagenUrl !== undefined) {
        actualizacion.imagen_url = datos.imagenUrl;
      }
      if (datos.fotos !== undefined) {
        actualizacion.fotos = datos.fotos;
      }
      if (datos.mensajeRecordatorio !== undefined) {
        actualizacion.mensaje_recordatorio = datos.mensajeRecordatorio;
      }
      if (datos.arteMortuorio !== undefined) {
        actualizacion.arte_mortuorio = datos.arteMortuorio;
      }

      // Agregar timestamp de actualización
      actualizacion.updated_at = Date.now();

      const resultado = await ObituarioModel.findByIdAndUpdate(
        id,
        actualizacion,
        { new: true }
      );

      console.log('Obituario actualizado exitosamente');
      return resultado ? true : false;
    } catch (err) {
      console.error('Error al actualizar obituario:', err);
      throw err;
    }
  }

  // Eliminar obituario
  static async eliminar(id) {
    try {
      console.log('Eliminando obituario:', id);
      
      const resultado = await ObituarioModel.findByIdAndDelete(id);
      
      console.log('Obituario eliminado exitosamente');
      return resultado ? true : false;
    } catch (err) {
      console.error('Error al eliminar obituario:', err);
      throw err;
    }
  }

  // Obtener obituarios recientes
  static async obtenerRecientes(limite = 5) {
    try {
      console.log('Obteniendo obituarios recientes...');
      const obituarios = await ObituarioModel.find()
        .sort({ created_at: -1 })
        .limit(limite);
      return obituarios;
    } catch (err) {
      console.error('Error al obtener obituarios recientes:', err);
      throw err;
    }
  }
}

module.exports = Obituario;
