const NotificacionFloristeria = require('../models/notificacionFlor');

// Obtener notificaciones no leídas
const obtenerNotificacionesNoLeidas = async (req, res) => {
  try {
    const notificaciones = await NotificacionFloristeria.find({ leida: false }).sort({ createdAt: -1 });

    res.json({
      success: true,
      mensaje: 'Notificaciones obtenidas exitosamente',
      notificaciones,
      cantidad: notificaciones.length
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

// Obtener todas las notificaciones
const obtenerTodasNotificaciones = async (req, res) => {
  try {
    const notificaciones = await NotificacionFloristeria.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      mensaje: 'Notificaciones obtenidas exitosamente',
      notificaciones,
      cantidad: notificaciones.length
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

// Marcar notificación como leída
const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await NotificacionFloristeria.findByIdAndUpdate(
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
      mensaje: 'Notificación marcada como leída',
      notificacion
    });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al marcar la notificación',
      error: error.message
    });
  }
};

// Eliminar notificación
const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await NotificacionFloristeria.findByIdAndDelete(id);

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

module.exports = {
  obtenerNotificacionesNoLeidas,
  obtenerTodasNotificaciones,
  marcarLeida,
  eliminarNotificacion
};
