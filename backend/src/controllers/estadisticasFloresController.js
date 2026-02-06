const PedidoFloristeria = require('../models/pedidoFlor');

// Obtener estadísticas de flores vendidas
exports.obtenerEstadisticasFlores = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // Obtener todos los pedidos confirmados o entregados
    const pedidos = await PedidoFloristeria.find({
      $or: [
        { estado: 'confirmado' },
        { estado: 'entregado' }
      ]
    })
      .select('codigoArreglo cantidad descripcionArreglo precioUnitario total')
      .lean();

    // Procesar datos para estadísticas
    const estadisticas = {};
    let totalVentas = 0;

    pedidos.forEach(pedido => {
      const codigo = pedido.codigoArreglo;

      if (!estadisticas[codigo]) {
        estadisticas[codigo] = {
          codigo: codigo,
          descripcion: pedido.descripcionArreglo,
          cantidad_vendida: 0,
          veces_comprado: 0,
          monto_total: 0,
          precio_unitario: pedido.precioUnitario
        };
      }

      estadisticas[codigo].cantidad_vendida += pedido.cantidad;
      estadisticas[codigo].veces_comprado += 1;
      estadisticas[codigo].monto_total += pedido.total;
      totalVentas += pedido.total;
    });

    // Convertir a array y ordenar
    const floresTop = Object.values(estadisticas)
      .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida);

    // Obtener top 5
    const top5 = floresTop.slice(0, 5);

    // Estadísticas generales
    const totalPedidos = pedidos.length;
    const floresUnicas = floresTop.length;

    res.json({
      success: true,
      resumen: {
        total_pedidos: totalPedidos,
        flores_unicas: floresUnicas,
        monto_total: totalVentas.toFixed(2),
        promedio_pedido: (totalVentas / (totalPedidos || 1)).toFixed(2)
      },
      top_flores: top5,
      todas_flores: floresTop
    });
  } catch (error) {
    console.error('Error en estadísticas de flores:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      mensaje: error.message
    });
  }
};

// Obtener estadísticas por período
exports.obtenerEstadisticasPorPeriodo = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const filtro = {
      $or: [
        { estado: 'confirmado' },
        { estado: 'entregado' }
      ]
    };

    if (fechaInicio || fechaFin) {
      filtro.fechaPedido = {};
      if (fechaInicio) {
        filtro.fechaPedido.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        filtro.fechaPedido.$lte = new Date(fechaFin);
      }
    }

    const pedidos = await PedidoFloristeria.find(filtro)
      .select('codigoArreglo cantidad descripcionArreglo precioUnitario total fechaPedido')
      .lean();

    // Agrupar por código de flor
    const estadisticas = {};

    pedidos.forEach(pedido => {
      const codigo = pedido.codigoArreglo;

      if (!estadisticas[codigo]) {
        estadisticas[codigo] = {
          codigo: codigo,
          descripcion: pedido.descripcionArreglo,
          cantidad_vendida: 0,
          veces_comprado: 0,
          monto_total: 0
        };
      }

      estadisticas[codigo].cantidad_vendida += pedido.cantidad;
      estadisticas[codigo].veces_comprado += 1;
      estadisticas[codigo].monto_total += pedido.total;
    });

    const floresOrdenadas = Object.values(estadisticas)
      .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida);

    res.json({
      success: true,
      periodo: {
        inicio: fechaInicio || 'Sin filtro',
        fin: fechaFin || 'Sin filtro'
      },
      total_pedidos: pedidos.length,
      flores_unicas: floresOrdenadas.length,
      flores: floresOrdenadas
    });
  } catch (error) {
    console.error('Error en estadísticas por período:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      mensaje: error.message
    });
  }
};

// Obtener estadísticas de pedidos flores para el dashboard
exports.obtenerEstadisticasPedidosFlores = async (req, res) => {
  try {
    // Usar aggregation pipeline para agrupar pedidos confirmados por código
    const estadisticas = await PedidoFloristeria.aggregate([
      // Filtrar solo pedidos confirmados
      {
        $match: {
          estado: 'confirmado'
        }
      },
      // Agrupar por código de arreglo y sumar cantidades
      {
        $group: {
          _id: '$codigoArreglo',
          codigo: { $first: '$codigoArreglo' },
          totalCantidad: { $sum: '$cantidad' },
          descripcion: { $first: '$descripcionArreglo' }
        }
      },
      // Ordenar por cantidad descendente
      {
        $sort: { totalCantidad: -1 }
      },
      // Proyectar los campos deseados
      {
        $project: {
          _id: 0,
          codigo: 1,
          cantidad: '$totalCantidad',
          descripcion: 1
        }
      }
    ]);

    // Si no hay datos, retornar mensaje
    if (estadisticas.length === 0) {
      return res.json({
        success: true,
        mensaje: 'No existen pedidos confirmados aún.',
        datos: []
      });
    }

    res.json({
      success: true,
      datos: estadisticas
    });
  } catch (error) {
    console.error('Error en estadísticas de pedidos flores:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      mensaje: error.message
    });
  }
};
