const mongoose = require('mongoose');
require('dotenv').config();

const PedidoFloristeria = require('../models/pedidoFlor');

const conectarBD = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flowerDB');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const verificarColeccion = async () => {
  try {
    console.log('\n📋 Verificación de Colección de Pedidos\n');

    // Estadísticas generales
    const totalPedidos = await PedidoFloristeria.countDocuments();
    console.log(`Total de pedidos: ${totalPedidos}`);

    // Pedidos por estado
    const estados = await PedidoFloristeria.aggregate([
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Pedidos por estado:');
    estados.forEach(item => {
      console.log(`   - ${item._id || 'sin estado'}: ${item.count}`);
    });

    // Pedidos pendientes no vistos por admin
    const pedidosNuevos = await PedidoFloristeria.countDocuments({
      estado: 'pendiente',
      visto_admin: false
    });

    console.log(`\n🔔 Pedidos pendientes no vistos: ${pedidosNuevos}`);

    // Pedidos pendientes vistos por admin
    const pedidosVistos = await PedidoFloristeria.countDocuments({
      estado: 'pendiente',
      visto_admin: true
    });

    console.log(`✅ Pedidos pendientes vistos: ${pedidosVistos}`);

    // Mostrar los pedidos nuevos
    if (pedidosNuevos > 0) {
      console.log('\n📦 Pedidos nuevos (mostrar primeros 3):');
      const nuevos = await PedidoFloristeria.find({
        estado: 'pendiente',
        visto_admin: false
      })
        .select('codigoArreglo nombrePersonaFallecida cantidad total createdAt')
        .limit(3)
        .sort({ createdAt: -1 });

      nuevos.forEach((pedido, idx) => {
        console.log(`   ${idx + 1}. [${pedido.codigoArreglo}] ${pedido.nombrePersonaFallecida} - Cantidad: ${pedido.cantidad} - Total: $${pedido.total}`);
        console.log(`      Creado: ${pedido.createdAt.toLocaleString('es-ES')}`);
      });
    }

    // Verificar estructura
    console.log('\n✅ Verificación de estructura:');
    const camposRequeridos = ['visto_admin', 'estado', 'clienteId'];
    const samplePedido = await PedidoFloristeria.findOne();
    
    if (samplePedido) {
      camposRequeridos.forEach(campo => {
        const existe = samplePedido[campo] !== undefined;
        console.log(`   ${existe ? '✓' : '✗'} Campo '${campo}': ${existe ? 'OK' : 'FALTA'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante verificación:', error);
    process.exit(1);
  }
};

const main = async () => {
  await conectarBD();
  await verificarColeccion();
  await mongoose.connection.close();
  console.log('\n✅ Conexión cerrada');
  process.exit(0);
};

main();
