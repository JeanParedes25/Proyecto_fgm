require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/usuario');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/funeraria_db';

async function limpiarAdmin() {
  try {
    console.log('📡 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('📡 Conectado a MongoDB');

    // Eliminar fgmtransmisiones@gmail.com de la BD
    const resultado = await Usuario.deleteOne({ 
      email: 'fgmtransmisiones@gmail.com' 
    });

    if (resultado.deletedCount > 0) {
      console.log('✅ Usuario fgmtransmisiones@gmail.com eliminado de la BD');
    } else {
      console.log('ℹ️  El usuario fgmtransmisiones@gmail.com no existía en la BD');
    }

    // Verificar usuarios restantes
    const totalUsuarios = await Usuario.countDocuments();
    console.log(`\n📊 Total de usuarios en BD: ${totalUsuarios}`);

    console.log('\n✅ Limpieza completada');
    console.log('ℹ️  fgmtransmisiones@gmail.com se creará automáticamente al registrarse o al iniciar con Google OAuth');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

limpiarAdmin();
