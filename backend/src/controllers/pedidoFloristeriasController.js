const PedidoFloristeria = require('../models/pedidoFlor');
const NotificacionFloristeria = require('../models/notificacionFlor');

// Crear pedido de floristerías
const crearPedido = async (req, res) => {
  try {
    const { codigoArreglo, arregloId, descripcionArreglo, nombrePersonaFallecida, precio } = req.body;
    const clienteId = req.user.id;
    const nombreCliente = req.user.nombre;

    if (!codigoArreglo || !arregloId || !nombrePersonaFallecida || !precio) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos requeridos'
      });
    }

    const nuevoPedido = new PedidoFloristeria({
      clienteId,
      nombreCliente,
      codigoArreglo,
      arregloId,
      descripcionArreglo,
      nombrePersonaFallecida,
      precio,
      estado: 'pendiente'
    });

    await nuevoPedido.save();

    // Crear notificación para el administrador
    const mensaje = `${nombreCliente} pidió el arreglo floral código ${codigoArreglo} para ${nombrePersonaFallecida}`;
    
    const notificacion = new NotificacionFloristeria({
      pedidoId: nuevoPedido._id,
      nombreCliente,
      codigoArreglo,
      nombrePersonaFallecida,
      descripcionArreglo,
      precio,
      mensaje,
      leida: false
    });

    await notificacion.save();

    res.status(201).json({
      success: true,
      mensaje: 'Pedido creado exitosamente',
      pedido: nuevoPedido,
      notificacion
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
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
    const clienteId = req.user.id;
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

    if (!['pendiente', 'confirmado', 'entregado'].includes(estado)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Estado inválido'
      });
    }

    const pedido = await PedidoFloristeria.findByIdAndUpdate(
      id,
      { estado, updatedAt: Date.now() },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pedido no encontrado'
      });
    }

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

module.exports = {
  crearPedido,
  obtenerMisPedidos,
  obtenerTodosPedidos,
  actualizarEstadoPedido
};
