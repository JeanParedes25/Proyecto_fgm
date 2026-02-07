// Script para limpiar todas las colecciones principales en MongoDB
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

async function limpiarTodasColecciones() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB\n');

    const db = mongoose.connection.db;

    // Lista de colecciones a limpiar
    const colecciones = [
      'obituarios',
      'planes',
      'cuentasbancarias',
      'servicios',
      'floristerias',
      'pedidos_floristerias',
      'notificaciones',
      'notificacionesfloristerias',
      'seguros',
      'asistenciasprepago',
      'auditorias'
    ];

    console.log('Limpiando colecciones...\n');

    for (const coleccion of colecciones) {
      try {
        const collection = db.collection(coleccion);
        const resultado = await collection.deleteMany({});
        console.log(`✓ ${coleccion}: ${resultado.deletedCount} documentos eliminados`);
      } catch (err) {
        if (err.message.includes('ns not found')) {
          console.log(`⚠ ${coleccion}: Colección no existe (omitido)`);
        } else {
          console.log(`✗ ${coleccion}: Error - ${err.message}`);
        }
      }
    }

    console.log('\n✓ Limpieza completada exitosamente');
    console.log('Ahora el administrador puede empezar a agregar contenido nuevo.\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

limpiarTodasColecciones();
