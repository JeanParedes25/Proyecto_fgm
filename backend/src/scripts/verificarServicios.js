const mongoose = require('mongoose');
require('dotenv').config();

async function verificarServicios() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB\n");

    const db = mongoose.connection.db;
    const colecciones = await db.listCollections().toArray();
    
    console.log("📂 Colecciones en proyecto_fgm:");
    colecciones.forEach(col => {
      if (col.name === 'servicios' || col.name === 'seguros') {
        console.log(`   ✨ ${col.name} ← AQUÍ`);
      } else {
        console.log(`   - ${col.name}`);
      }
    });

    const serviciosCol = db.collection('servicios');
    const count = await serviciosCol.countDocuments();
    const docs = await serviciosCol.find({}).toArray();
    
    console.log(`\n📊 Colección 'servicios':`);
    console.log(`   Total documentos: ${count}`);
    console.log(`\n📝 Documentos:`);
    docs.forEach((doc, idx) => {
      console.log(`   ${idx + 1}. Tipo: ${doc.tipo} - ${doc.titulo}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Desconectado");
  }
}

verificarServicios();
