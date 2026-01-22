const mongoose = require('mongoose');
require('dotenv').config();

async function limpiarYReiniciar() {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB\n");

    const db = mongoose.connection.db;

    // Eliminar ambas colecciones si existen
    const colecciones = await db.listCollections().toArray();
    const nombreColecciones = colecciones.map(col => col.name);
    
    console.log("🗑️  Limpiando colecciones antiguas...");
    
    if (nombreColecciones.includes('seguros')) {
      await db.collection('seguros').drop();
      console.log("   ✓ 'seguros' eliminada");
    }
    
    if (nombreColecciones.includes('servicios')) {
      await db.collection('servicios').drop();
      console.log("   ✓ 'servicios' eliminada");
    }

    console.log("\n✅ Limpieza completada");
    console.log("💡 Ahora ejecuta: node src/scripts/initSeguros.js\n");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
  }
}

// Ejecutar
limpiarYReiniciar();
