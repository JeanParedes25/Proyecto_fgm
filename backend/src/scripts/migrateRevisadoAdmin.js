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

const migrarVisualizacionAdmin = async () => {
  try {
    console.log('\n🔄 Iniciando migración de pedidos...\n');

    // 1. Migrar revisadoAdmin a visto_admin (si existe)
    const resultadoMigracion = await PedidoFloristeria.updateMany(
      { revisadoAdmin: { $exists: true } },
      { 
        $rename: { revisadoAdmin: 'visto_admin' },
        updatedAt: new Date()
      }
    );

    console.log('📊 Migración de revisadoAdmin → visto_admin:');
    console.log(`   - Documentos encontrados: ${resultadoMigracion.matchedCount}`);
    console.log(`   - Documentos actualizados: ${resultadoMigracion.modifiedCount}`);

    // 2. Agregar visto_admin para documentos que no lo tengan
    const resultadoAgregar = await PedidoFloristeria.updateMany(
      { visto_admin: { $exists: false } },
      { 
        visto_admin: false,
        updatedAt: new Date()
      }
    );

    console.log('\n📊 Agregación de campo visto_admin:');
    console.log(`   - Documentos sin campo: ${resultadoAgregar.matchedCount}`);
    console.log(`   - Documentos actualizados: ${resultadoAgregar.modifiedCount}`);

    // 3. Verificación final
    const totalPedidos = await PedidoFloristeria.countDocuments();
    const pedidosConVistaAdmin = await PedidoFloristeria.countDocuments({ 
      visto_admin: { $exists: true } 
    });
    const pedidosNoVistos = await PedidoFloristeria.countDocuments({ 
      estado: 'pendiente',
      visto_admin: false 
    });

    console.log(`\n✅ Verificación final:`);
    console.log(`   - Total de pedidos: ${totalPedidos}`);
    console.log(`   - Pedidos con campo visto_admin: ${pedidosConVistaAdmin}`);
    console.log(`   - Completitud: ${((pedidosConVistaAdmin / totalPedidos) * 100).toFixed(2)}%`);
    console.log(`   - Pedidos pendientes no vistos: ${pedidosNoVistos}`);

    if (pedidosConVistaAdmin === totalPedidos) {
      console.log('\n✅ ¡Migración completada exitosamente!');
    } else {
      console.log('\n⚠️ Algunos documentos aún no tienen el campo visto_admin');
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
};

const main = async () => {
  await conectarBD();
  await migrarVisualizacionAdmin();
  await mongoose.connection.close();
  console.log('\n✅ Conexión cerrada');
  process.exit(0);
};

main();
