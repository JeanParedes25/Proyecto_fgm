const mongoose = require('mongoose');
const Plan = require('../models/plan');
require('dotenv').config();

// Script para limpiar la colección de planes

async function limpiarPlanes() {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB");

    // Contar planes actuales
    const countAntes = await Plan.countDocuments();
    console.log(`\n📊 Planes antes: ${countAntes}`);

    // Eliminar todos los planes
    const resultado = await Plan.deleteMany({});
    console.log(`\n🗑️  Eliminados ${resultado.deletedCount} planes`);

    // Contar planes después
    const countDespues = await Plan.countDocuments();
    console.log(`📊 Planes después: ${countDespues}`);

    console.log("\n✅ La colección 'plans' está vacía y lista para nuevos datos");
    console.log("💡 El administrador puede ahora crear nuevos planes desde el panel\n");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
  }
}

// Ejecutar
limpiarPlanes();
