const mongoose = require('mongoose');
const Plan = require('../models/plan');
require('dotenv').config();

// Script para inicializar la colección de planes en MongoDB

async function initPlanes() {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB");
    console.log(`📦 Base de datos: ${mongoose.connection.db.databaseName}`);

    // Verificar si la colección existe
    const colecciones = await mongoose.connection.db.listCollections().toArray();
    const nombreColecciones = colecciones.map(col => col.name);
    
    console.log("\n📂 Colecciones existentes en proyecto_fgm:");
    nombreColecciones.forEach(nombre => {
      console.log(`   - ${nombre}`);
    });

    const existePlans = nombreColecciones.includes('plans');
    
    if (existePlans) {
      console.log("\n✅ La colección 'plans' ya existe");
      const count = await Plan.countDocuments();
      console.log(`   Planes guardados: ${count}`);
    } else {
      console.log("\n⚠️  La colección 'plans' no existe aún");
      console.log("💡 Creando colección 'plans'...");
      
      // Crear la colección explícitamente
      await mongoose.connection.db.createCollection('plans');
      console.log("✅ Colección 'plans' creada exitosamente");
      
      // Crear índices
      await Plan.createIndexes();
      console.log("✅ Índices creados");
    }

    console.log("\n📝 Información de la colección 'plans':");
    console.log(`   Nombre: plans`);
    console.log(`   Base de datos: proyecto_fgm`);
    console.log(`   Ruta completa: proyecto_fgm.plans`);
    console.log("\n✨ La colección está lista para guardar planes funerarios");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Desconectado de MongoDB");
  }
}

// Ejecutar
initPlanes();
