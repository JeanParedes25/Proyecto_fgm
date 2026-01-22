const mongoose = require('mongoose');
const Plan = require('../models/plan');
require('dotenv').config();

// Script para verificar la colección de planes en MongoDB

async function verificarPlanes() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB");

    // Verificar la colección
    const colecciones = await mongoose.connection.db.listCollections().toArray();
    const tieneColeccionPlanes = colecciones.some(col => col.name === 'plans');
    
    console.log("\n📊 Estado de la base de datos proyecto_fgm:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (tieneColeccionPlanes) {
      console.log("✅ Colección 'plans' existe en la base de datos");
      
      // Contar documentos
      const totalPlanes = await Plan.countDocuments();
      const planesActivos = await Plan.countDocuments({ activo: true });
      const planesDestacados = await Plan.countDocuments({ destacado: true });
      
      console.log(`📋 Total de planes: ${totalPlanes}`);
      console.log(`✓ Planes activos: ${planesActivos}`);
      console.log(`⭐ Planes destacados: ${planesDestacados}`);
      
      // Mostrar lista de planes
      if (totalPlanes > 0) {
        console.log("\n📝 Lista de planes:");
        const planes = await Plan.find().select('nombre precio activo destacado');
        planes.forEach((plan, index) => {
          const estado = plan.activo ? '✓' : '✗';
          const destacado = plan.destacado ? '⭐' : '';
          console.log(`  ${index + 1}. ${estado} ${plan.nombre} - $${plan.precio} ${destacado}`);
        });
      }
    } else {
      console.log("⚠️  Colección 'plans' no existe aún");
      console.log("💡 La colección se creará automáticamente cuando el administrador cree el primer plan");
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
  } catch (error) {
    console.error("❌ Error al verificar planes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  verificarPlanes();
}

module.exports = verificarPlanes;
