const Notificacion = require('../models/notificacion');

// Crear una nueva notificación
exports.crearNotificacion = async (tipo, titulo, mensaje, datos = {}) => {
  try {
    const notificacion = new Notificacion({
      tipo,
      titulo,
      mensaje,
      datos
    });
    await notificacion.save();
    return notificacion;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};

// Obtener todas las notificaciones
exports.obtenerNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      notificaciones
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las notificaciones',
      error: error.message
    });
  }
};

// Obtener solo notificaciones no leídas
exports.obtenerNotificacionesNoLeidas = async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({ leida: false })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notificaciones.length,
      notificaciones
    });
  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las notificaciones',
      error: error.message
    });
  }
};

// Marcar notificación como leída
exports.marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByIdAndUpdate(
      id,
      { leida: true },
      { new: true }
    );

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        mensaje: 'Notificación no encontrada'
      });
    }

    res.json({
      success: true,
      notificacion
    });
  } catch (error) {
    console.error('Error al marcar como leída:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar la notificación',
      error: error.message
    });
  }
};

// Marcar todas como leídas
exports.marcarTodasComoLeidas = async (req, res) => {
  try {
    await Notificacion.updateMany(
      { leida: false },
      { leida: true }
    );

    res.json({
      success: true,
      mensaje: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar las notificaciones',
      error: error.message
    });
  }
};

// Eliminar notificación
exports.eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificacion.findByIdAndDelete(id);

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        mensaje: 'Notificación no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Notificación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar la notificación',
      error: error.message
    });
  }
};

// Eliminar todas las notificaciones leídas
exports.eliminarLeidas = async (req, res) => {
  try {
    const resultado = await Notificacion.deleteMany({ leida: true });

    res.json({
      success: true,
      mensaje: `${resultado.deletedCount} notificaciones eliminadas`
    });
  } catch (error) {
    console.error('Error al eliminar notificaciones leídas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar las notificaciones',
      error: error.message
    });
  }
};
