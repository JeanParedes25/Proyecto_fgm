const mongoose = require('mongoose');
const Usuario = require('../models/usuario');
const PedidoFloristeria = require('../models/pedidoFlor');
const Servicio = require('../models/servicio');
const AuditLog = require('../models/auditLog');

// Obtener estadísticas del sistema
const obtenerEstadisticas = async (req, res) => {
  try {
    console.log('=== OBTENER ESTADÍSTICAS ===');
    
    // Debug: ver colecciones disponibles
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Colecciones disponibles:', collections.map(c => c.name));
    
    // Obtener total de usuarios
    const usuariosTotales = await Usuario.countDocuments();
    console.log('Usuarios totales encontrados:', usuariosTotales);
    
    // Obtener total de obituarios desde la colección
    const obituariosCollection = mongoose.connection.collection('obituarios');
    const obituariosTotales = await obituariosCollection.countDocuments();
    console.log('Registros de obituarios encontrados:', obituariosTotales);
    
    // Obtener usuarios activos hoy (creados hoy)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const activosHoy = await Usuario.countDocuments({
      createdAt: { $gte: hoy, $lt: mañana }
    });

    const pedidosFlorales = await PedidoFloristeria.countDocuments();
    const serviciosTotales = await Servicio.countDocuments();

    console.log('Estadísticas obtenidas:', {
      usuariosTotales,
      obituariosTotales,
      pedidosFlorales,
      serviciosTotales,
      activosHoy
    });
    
    res.json({
      success: true,
      usuarios_totales: usuariosTotales,
      obituarios_totales: obituariosTotales,
      pedidos_florales: pedidosFlorales,
      servicios_totales: serviciosTotales,
      registrados_hoy: activosHoy
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
    
    const { action, accion, limit = 20, skip = 0 } = req.query;
    
    let filtro = {};
    const filtroAccion = accion || action;
    if (filtroAccion && filtroAccion.toString().toLowerCase() !== 'all') {
      filtro.accion = filtroAccion.toString().trim().toUpperCase();
    }

    const logs = await AuditLog.find(filtro)
      .sort({ fecha: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await AuditLog.countDocuments(filtro);
    
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
    
    const usuarios = await Usuario.find({}, 'nombre email createdAt rol').sort({ createdAt: -1 });
    const totalPorRol = {
      admin: usuarios.filter((u) => u.rol === 'admin').length,
      usuario: usuarios.filter((u) => u.rol === 'usuario').length
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
