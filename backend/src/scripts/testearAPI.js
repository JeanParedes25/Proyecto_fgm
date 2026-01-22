const mongoose = require('mongoose');
const Seguro = require('../models/seguro');
require('dotenv').config();

async function testearAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB\n");

    console.log("🧪 Probando consultas...\n");

    // Buscar por tipo
    const exequial = await Seguro.findOne({ tipo: 'exequial' });
    console.log("1. Búsqueda por tipo 'exequial':");
    if (exequial) {
      console.log("   ✅ Encontrado:");
      console.log("   - ID:", exequial._id);
      console.log("   - Tipo:", exequial.tipo);
      console.log("   - Título:", exequial.titulo);
      console.log("   - Activo:", exequial.activo);
    } else {
      console.log("   ❌ No encontrado");
    }

    console.log("\n2. Búsqueda con filtro activo:");
    const exequialActivo = await Seguro.findOne({ tipo: 'exequial', activo: true });
    if (exequialActivo) {
      console.log("   ✅ Encontrado");
    } else {
      console.log("   ❌ No encontrado");
    }

    console.log("\n3. Todos los seguros:");
    const todos = await Seguro.find({});
    console.log(`   Total: ${todos.length}`);
    todos.forEach(s => {
      console.log(`   - ${s.tipo}: ${s.titulo} (activo: ${s.activo})`);
    });

    console.log("\n4. Verificando nombre de colección:");
    console.log("   Colección usada:", Seguro.collection.name);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Desconectado");
  }
}

testearAPI();
