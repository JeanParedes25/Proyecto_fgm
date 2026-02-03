const AuditLog = require('../models/auditLog');

const ACCIONES_VALIDAS = new Set(['LOGIN', 'CREATE', 'UPDATE', 'DELETE']);
const MODULOS_VALIDOS = new Set(['Usuarios', 'Pedidos', 'Planes', 'Empresa', 'Obituarios']);

const normalizarAccion = (accion) => {
  if (!accion) return null;

  const normalizada = accion.toString().trim().toUpperCase();

  if (ACCIONES_VALIDAS.has(normalizada)) {
    return normalizada;
  }

  return null;
};

const normalizarModulo = (modulo) => {
  if (!modulo) return null;

  const normalizado = modulo.toString().trim();

  if (MODULOS_VALIDOS.has(normalizado)) {
    return normalizado;
  }

  return null;
};

// Registrar evento de auditoría
const registrarEvento = async ({
  usuarioId = null,
  nombreUsuario,
  rol,
  accion,
  modulo,
  descripcion,
  ip = null
} = {}) => {
  try {
    const accionNormalizada = normalizarAccion(accion);
    const moduloNormalizado = normalizarModulo(modulo);

    if (!accionNormalizada) {
      console.warn('⚠️ Acción de auditoría inválida, no se registró:', accion);
      return;
    }

    if (!moduloNormalizado) {
      console.warn('⚠️ Módulo de auditoría inválido, no se registró:', modulo);
      return;
    }

    if (!nombreUsuario || !rol || !descripcion) {
      console.warn('⚠️ Datos incompletos de auditoría, no se registró el evento');
      return;
    }

    const evento = new AuditLog({
      usuarioId,
      nombreUsuario,
      rol,
      accion: accionNormalizada,
      modulo: moduloNormalizado,
      descripcion,
      ip
    });
    await evento.save();
    console.log(`✅ Evento de auditoría registrado: ${accionNormalizada} - ${descripcion}`);
  } catch (error) {
    console.error('Error al registrar evento de auditoría:', error);
  }
};

// Obtener logs de auditoría
const obtenerLogs = async (req, res) => {
  try {
    const { action, accion, limit = 50, skip = 0 } = req.query;
    
    let filtro = {};
    const filtroAccion = accion || action;
    if (filtroAccion && filtroAccion.toString().toLowerCase() !== 'all') {
      const accionNormalizada = normalizarAccion(filtroAccion);
      if (!accionNormalizada) {
        return res.status(400).json({
          success: false,
          mensaje: 'Acción de auditoría inválida'
        });
      }
      filtro.accion = accionNormalizada;
    }
    
    const logs = await AuditLog.find(filtro)
      .sort({ fecha: -1 })
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
    
    const logins = await AuditLog.countDocuments({ accion: 'LOGIN' });
    const registrosCreados = await AuditLog.countDocuments({ accion: 'CREATE' });
    const actualizaciones = await AuditLog.countDocuments({ accion: 'UPDATE' });
    const eliminaciones = await AuditLog.countDocuments({ accion: 'DELETE' });
    
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
