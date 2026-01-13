const AuditLog = require('../models/auditLog');

// Registrar evento de auditoría
const registrarEvento = async (action, usuario, email, descripcion, entidad, entidadId) => {
  try {
    const evento = new AuditLog({
      action,
      usuario,
      email,
      descripcion,
      entidad,
      entidadId
    });
    await evento.save();
    console.log(`✅ Evento de auditoría registrado: ${action} - ${descripcion}`);
  } catch (error) {
    console.error('Error al registrar evento de auditoría:', error);
  }
};

// Obtener logs de auditoría
const obtenerLogs = async (req, res) => {
  try {
    const { action, limit = 50, skip = 0 } = req.query;
    
    let filtro = {};
    if (action && action !== 'all') {
      filtro.action = action;
    }
    
    const logs = await AuditLog.find(filtro)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await AuditLog.countDocuments(filtro);
    
    res.json({
      success: true,
      logs,
      total,
      pagina: {
        actual: Math.floor(skip / limit) + 1,
        total: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener logs: ' + error.message
    });
  }
};

// Obtener estadísticas de auditoría
const obtenerEstadisticas = async (req, res) => {
  try {
    const totalLogs = await AuditLog.countDocuments();
    
    const logins = await AuditLog.countDocuments({ action: 'login' });
    const registrosCreados = await AuditLog.countDocuments({ action: 'create' });
    const actualizaciones = await AuditLog.countDocuments({ action: 'update' });
    const eliminaciones = await AuditLog.countDocuments({ action: 'delete' });
    
    res.json({
      success: true,
      estadisticas: {
        total: totalLogs,
        logins,
        registrosCreados,
        actualizaciones,
        eliminaciones
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de auditoría:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error: ' + error.message
    });
  }
};

module.exports = {
  registrarEvento,
  obtenerLogs,
  obtenerEstadisticas
};
