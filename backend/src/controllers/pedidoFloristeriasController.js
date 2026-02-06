const PedidoFloristeria = require('../models/pedidoFlor');
const NotificacionFloristeria = require('../models/notificacionFlor');
const { crearNotificacion } = require('./notificacionController');
const { registrarEvento } = require('./auditController');

// Crear pedido de floristerías con cantidad y validación de total
const crearPedido = async (req, res) => {
  try {
    const { 
      codigoArreglo, 
      arregloId, 
      descripcionArreglo, 
      nombrePersonaFallecida, 
      precioUnitario,
      cantidad
    } = req.body;
    const clienteId = req.usuario.id;
    const nombreCliente = req.usuario.nombre;
    const emailCliente = req.usuario.email || '';
    const telefonoCliente = req.usuario.celular || '';

    console.log('📦 Datos recibidos del pedido:', {
      codigoArreglo,
      arregloId,
      descripcionArreglo,
      nombrePersonaFallecida,
      precioUnitario,
      cantidad,
      clienteId,
      nombreCliente
    });

    // Validación de campos requeridos
    if (!codigoArreglo || !arregloId || !nombrePersonaFallecida || !precioUnitario || !cantidad) {
      console.error('❌ Faltan campos requeridos');
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos requeridos'
      });
    }

    // Validar cantidad
    const cantidadNum = Number(cantidad);
    if (!Number.isInteger(cantidadNum) || cantidadNum < 1) {
      console.error('❌ Cantidad inválida');
      return res.status(400).json({
        success: false,
        mensaje: 'La cantidad debe ser un número entero mayor a 0'
      });
    }

    // Validar precio unitario
    const precioNum = parseFloat(precioUnitario);
    if (isNaN(precioNum) || precioNum < 0) {
      console.error('❌ Precio inválido');
      return res.status(400).json({
        success: false,
        mensaje: 'El precio unitario es inválido'
      });
    }

    // Calcular total en el backend (evitar manipulación desde frontend)
    const total = precioNum * cantidadNum;

    const nuevoPedido = new PedidoFloristeria({
      clienteId,
      nombreCliente,
      emailCliente,
      telefonoCliente,
      codigoArreglo,
      arregloId,
      descripcionArreglo: descripcionArreglo || 'Sin descripción',
      nombrePersonaFallecida,
      precioUnitario: precioNum,
      cantidad: cantidadNum,
      total: total,
      estado: 'pendiente',
      notificacionEnviada: false,
      visto_admin: false,
      fechaPedido: new Date()
    });

    console.log('💾 Intentando guardar pedido...');
    await nuevoPedido.save();
    console.log('✅ Pedido guardado exitosamente:', nuevoPedido._id);

    // Crear notificación general para el administrador
    const mensajeNotificacion = `Nuevo pedido de arreglo floral código ${codigoArreglo} para ${nombrePersonaFallecida}. Cantidad: ${cantidadNum}. Precio unitario: $${precioNum.toFixed(2)}. Total: $${total.toFixed(2)}`;
    
    await crearNotificacion(
      'floristeria',
      '🌹 Nuevo Pedido de Floristería',
      mensajeNotificacion,
      {
        pedidoId: nuevoPedido._id,
        nombreCliente,
        emailCliente,
        telefonoCliente,
        codigoArreglo,
        nombrePersonaFallecida,
        descripcionArreglo: descripcionArreglo || 'Sin descripción',
        precioUnitario: precioNum,
        cantidad: cantidadNum,
        total: total
      }
    );
    console.log('✅ Notificación general creada exitosamente');

    // Registrar en auditoría
    await registrarEvento({
      usuarioId: clienteId,
      nombreUsuario: nombreCliente,
      rol: req.usuario?.rol || 'usuario',
      accion: 'CREATE',
      modulo: 'Pedidos',
      descripcion: `Creación de pedido floral ${codigoArreglo} para ${nombrePersonaFallecida}. Cantidad: ${cantidadNum}. Total: $${total.toFixed(2)}`,
      ip: req.ip || null
    });

    res.status(201).json({
      success: true,
      mensaje: 'Pedido creado exitosamente. Por favor confirma el pago en WhatsApp.',
      pedido: nuevoPedido
    });
  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear el pedido',
      error: error.message
    });
  }
};

// Obtener pedidos del usuario
const obtenerMisPedidos = async (req, res) => {
  try {
    const clienteId = req.usuario.id;
    const pedidos = await PedidoFloristeria.find({ clienteId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      mensaje: 'Pedidos obtenidos exitosamente',
      pedidos
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los pedidos',
      error: error.message
    });
  }
};

// Obtener conteo de cambios no leídos en pedidos
const obtenerCambiosNoLeidos = async (req, res) => {
  try {
    const clienteId = req.usuario.id;
    const cambiosNoLeidos = await PedidoFloristeria.countDocuments({ 
      clienteId,
      visto: false 
    });

    res.json({
      success: true,
      count: cambiosNoLeidos
    });
  } catch (error) {
    console.error('Error al obtener cambios no leídos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener cambios no leídos',
      error: error.message
    });
  }
};

// Marcar cambios como vistos
const marcarCambiosComoVistos = async (req, res) => {
  try {
    const clienteId = req.usuario.id;
    await PedidoFloristeria.updateMany(
      { clienteId, visto: false },
      { visto: true }
    );

    res.json({
      success: true,
      mensaje: 'Cambios marcados como vistos'
    });
  } catch (error) {
    console.error('Error al marcar cambios como vistos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al marcar cambios como vistos',
      error: error.message
    });
  }
};

// Obtener todos los pedidos (admin)
const obtenerTodosPedidos = async (req, res) => {
  try {
    const pedidos = await PedidoFloristeria.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      mensaje: 'Pedidos obtenidos exitosamente',
      pedidos
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los pedidos',
      error: error.message
    });
  }
};

// Actualizar estado de pedido (admin)
const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['pendiente', 'confirmado', 'cancelado_admin', 'cancelado_usuario'].includes(estado)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Estado inválido'
      });
    }

    // Obtener el pedido anterior para preservar el estado visto si no es cambio importante
    const pedidoAnterior = await PedidoFloristeria.findById(id);

    const pedido = await PedidoFloristeria.findByIdAndUpdate(
      id,
      { 
        estado, 
        updatedAt: Date.now(),
        visto: estado === 'confirmado' || estado === 'cancelado_admin' || estado === 'cancelado_usuario'
          ? false
          : pedidoAnterior?.visto
      },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pedido no encontrado'
      });
    }

    const descripcionAuditoria = estado === 'confirmado'
      ? `Confirmación de pedido floral ${pedido._id}`
      : estado === 'cancelado_admin'
        ? `Cancelación de pedido floral ${pedido._id} por administrador`
        : estado === 'cancelado_usuario'
        ? `Cancelación de pedido floral ${pedido._id} por usuario`
        : `Cambio de estado de pedido floral ${pedido._id} a ${estado}`;

    await registrarEvento({
      usuarioId: req.usuario.id,
      nombreUsuario: req.usuario.nombre,
      rol: req.usuario.rol,
      accion: 'UPDATE',
      modulo: 'Pedidos',
      descripcion: descripcionAuditoria,
      ip: req.ip || null
    });

    res.json({
      success: true,
      mensaje: 'Pedido actualizado exitosamente',
      pedido
    });
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar el pedido',
      error: error.message
    });
  }
};

// Obtener conteo de pedidos nuevos (sin revisar por admin)
const obtenerPedidosNuevosCount = async (req, res) => {
  try {
    const pedidosNuevos = await PedidoFloristeria.countDocuments({ 
      estado: 'pendiente',
      visto_admin: false
    });

    console.log('📦 Conteo de pedidos nuevos para admin:', pedidosNuevos);

    res.json({
      success: true,
      count: pedidosNuevos
    });
  } catch (error) {
    console.error('Error al obtener pedidos nuevos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener pedidos nuevos',
      error: error.message
    });
  }
};

// Marcar pedidos como revisados por admin
const marcarPedidosComoRevisados = async (req, res) => {
  try {
    const resultado = await PedidoFloristeria.updateMany(
      { 
        estado: 'pendiente',
        visto_admin: false
      },
      { 
        visto_admin: true,
        updatedAt: new Date()
      }
    );

    console.log('✅ Pedidos marcados como vistos por admin:', resultado.modifiedCount);

    res.json({
      success: true,
      mensaje: 'Pedidos marcados como vistos',
      actualizados: resultado.modifiedCount
    });
  } catch (error) {
    console.error('Error al marcar pedidos como vistos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al marcar pedidos como vistos',
      error: error.message
    });
  }
};

module.exports = {
  crearPedido,
  obtenerMisPedidos,
  obtenerTodosPedidos,
  actualizarEstadoPedido,
  obtenerCambiosNoLeidos,
  marcarCambiosComoVistos,
  obtenerPedidosNuevosCount,
  marcarPedidosComoRevisados
};
