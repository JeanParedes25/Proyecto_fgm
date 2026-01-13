const mongoose = require('mongoose');
const Cliente = require('../models/cliente');
const AuditLog = require('../models/auditLog');

// Obtener estadísticas del sistema
const obtenerEstadisticas = async (req, res) => {
  try {
    console.log('=== OBTENER ESTADÍSTICAS ===');
    
    // Debug: ver colecciones disponibles
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Colecciones disponibles:', collections.map(c => c.name));
    
    // Obtener total de usuarios (clientes registrados)
    const usuariosTotales = await Cliente.countDocuments();
    console.log('Usuarios totales encontrados:', usuariosTotales);
    
    // Obtener total de obituarios desde la colección
    const obituariosCollection = mongoose.connection.collection('obituarios');
    const registrosTotales = await obituariosCollection.countDocuments();
    console.log('Registros de obituarios encontrados:', registrosTotales);
    
    // Obtener usuarios activos hoy (creados hoy)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const activosHoy = await Cliente.countDocuments({
      createdAt: { $gte: hoy, $lt: mañana }
    });
    
    // Obtener estadísticas de auditoría
    const loginsHoy = await AuditLog.countDocuments({
      action: 'login',
      createdAt: { $gte: hoy, $lt: mañana }
    });
    
    const registrosCreados = await AuditLog.countDocuments({ action: 'create' });
    const actualizaciones = await AuditLog.countDocuments({ action: 'update' });
    const eliminaciones = await AuditLog.countDocuments({ action: 'delete' });
    
    // Estado del sistema
    const sistemaOperativo = '100%';
    
    console.log('Estadísticas obtenidas:', {
      usuariosTotales,
      registrosTotales,
      activosHoy,
      loginsHoy,
      registrosCreados,
      actualizaciones,
      eliminaciones,
      sistemaOperativo
    });
    
    res.json({
      success: true,
      usuarios_totales: usuariosTotales,
      registros_totales: registrosTotales,
      activos_hoy: activosHoy,
      sistema_operativo: sistemaOperativo,
      auditoria: {
        logins_hoy: loginsHoy,
        registros_creados: registrosCreados,
        actualizaciones: actualizaciones,
        eliminaciones: eliminaciones
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estadísticas: ' + error.message
    });
  }
};

// Obtener logs de auditoría con filtros
const obtenerLogsAuditoria = async (req, res) => {
  try {
    console.log('=== OBTENER LOGS AUDITORÍA ===');
    
    const { action, limit = 20, skip = 0 } = req.query;
    
    let filtro = {};
    if (action && action !== 'all') {
      filtro.action = action;
    }
    
    const obituariosCollection = mongoose.connection.collection('obituarios');
    
    const logs = await obituariosCollection
      .find(filtro)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();
    
    const total = await obituariosCollection.countDocuments(filtro);
    
    console.log('Logs obtenidos:', logs.length);
    
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

// Obtener detalles de usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    console.log('=== OBTENER USUARIOS ===');
    
    const usuarios = await Cliente.find({}, 'nombre email createdAt').sort({ createdAt: -1 });
    const totalPorRol = {
      admin: 1,
      usuario: usuarios.length - 1
    };
    
    res.json({
      success: true,
      usuarios,
      total: usuarios.length,
      totalPorRol
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener usuarios: ' + error.message
    });
  }
};

module.exports = {
  obtenerEstadisticas,
  obtenerLogsAuditoria,
  obtenerUsuarios
};
