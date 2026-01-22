// Script para migrar flores del campo 'image' al campo 'fotos'
const mongoose = require('mongoose');
const Flor = require('../models/flor');

require('dotenv').config();

async function migrarFlores() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log('✅ Conectado a MongoDB');

    // Obtener todas las flores que tienen 'image' pero no 'fotos'
    const floresAMigrar = await Flor.find({
      image: { $exists: true, $ne: null },
      $or: [
        { fotos: { $exists: false } },
        { fotos: [] }
      ]
    });

    console.log(`\n📊 Flores a migrar: ${floresAMigrar.length}`);

    if (floresAMigrar.length === 0) {
      console.log('✅ No hay flores para migrar. Todas tienen estructura correcta.');
      await mongoose.connection.close();
      return;
    }

    let migradas = 0;

    for (const flor of floresAMigrar) {
      try {
        // Extraer nombre del archivo del URL old
        let nombreArchivo = 'migracion-' + Date.now() + '.jpg';
        if (flor.image) {
          nombreArchivo = flor.image.split('/').pop();
        }

        // Convertir 'image' a estructura 'fotos'
        const urlRelativa = '/uploads/floristerias/' + nombreArchivo;

        await Flor.updateOne(
          { _id: flor._id },
          {
            $set: {
              fotos: [
                {
                  url: urlRelativa,
                  descripcion: flor.descripcion || ''
                }
              ]
            }
          }
        );

        console.log(`✅ Migrada: ${flor.codigo} (ID: ${flor._id})`);
        migradas++;
      } catch (err) {
        console.error(`❌ Error migrando ${flor.codigo}:`, err.message);
      }
    }

    console.log(`\n✅ Migración completada: ${migradas}/${floresAMigrar.length} flores actualizadas`);
    await mongoose.connection.close();
    console.log('Conexión cerrada.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

migrarFlores();
