const mongoose = require('mongoose');
require('dotenv').config();

const limpiarClientes = async () => {
  try {
    // Usar la variable correcta del .env
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm';
    
    console.log('Conectando a:', mongoUri);
    
    // Conectar a MongoDB
    await mongoose.connect(mongoUri);

    console.log('📦 Conectado a MongoDB');

    // Obtener la base de datos y la colección
    const db = mongoose.connection.db;
    const resultado = await db.collection('clientes').deleteMany({});
    
    console.log(`🗑️  ${resultado.deletedCount} clientes eliminados`);

    console.log('✅ Base de datos limpiada exitosamente');
    console.log('📝 Ahora puedes crear nuevos usuarios con el nuevo flujo de autenticación');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error.message);
    process.exit(1);
  }
};

// Ejecutar limpieza
limpiarClientes();
