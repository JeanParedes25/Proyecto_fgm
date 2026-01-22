const mongoose = require('mongoose');
require('dotenv').config();

async function migrarSegurosAServicios() {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB\n");

    const db = mongoose.connection.db;

    // Verificar si existe la colección seguros
    const colecciones = await db.listCollections().toArray();
    const nombreColecciones = colecciones.map(col => col.name);
    
    const existeSeguros = nombreColecciones.includes('seguros');
    const existeServicios = nombreColecciones.includes('servicios');

    console.log("📂 Estado actual:");
    console.log(`   Colección 'seguros': ${existeSeguros ? '✓ Existe' : '✗ No existe'}`);
    console.log(`   Colección 'servicios': ${existeServicios ? '✓ Existe' : '✗ No existe'}\n`);

    if (existeSeguros) {
      // Copiar datos de seguros a servicios
      const segurosCollection = db.collection('seguros');
      const serviciosCollection = db.collection('servicios');
      
      const documentos = await segurosCollection.find({}).toArray();
      
      if (documentos.length > 0) {
        console.log(`📋 Encontrados ${documentos.length} documentos en 'seguros'`);
        
        // Insertar en servicios
        await serviciosCollection.deleteMany({}); // Limpiar primero
        await serviciosCollection.insertMany(documentos);
        
        console.log(`✅ ${documentos.length} documentos copiados a 'servicios'`);
        
        // Eliminar colección seguros
        await segurosCollection.drop();
        console.log("🗑️  Colección 'seguros' eliminada\n");
      } else {
        console.log("⚠️  No hay documentos para migrar\n");
      }
    } else if (!existeServicios) {
      console.log("💡 Ejecutando inicialización de datos...\n");
      const initSeguros = require('./initSeguros');
      await initSeguros();
    } else {
      console.log("✅ La colección 'servicios' ya existe y contiene datos\n");
    }

    // Verificar resultado final
    const serviciosCollection = db.collection('servicios');
    const count = await serviciosCollection.countDocuments();
    console.log(`📊 Total de documentos en 'servicios': ${count}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
  }
}

// Ejecutar
migrarSegurosAServicios();
