// Script para actualizar la flor FLR1 con las imágenes que ya se subieron
const mongoose = require('mongoose');
const Flor = require('../models/flor');

require('dotenv').config();

async function actualizarFlorConFotos() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log('✅ Conectado a MongoDB\n');

    // Buscar la flor FLR1
    const flor = await Flor.findOne({ codigo: 'FLR1' });

    if (!flor) {
      console.log('❌ Flor FLR1 no encontrada');
      await mongoose.connection.close();
      return;
    }

    console.log(`📍 Flor encontrada: ${flor.codigo}`);
    console.log(`   Fotos actuales: ${flor.fotos ? flor.fotos.length : 0}`);
    console.log(`   Image actual: ${flor.image || '(vacío)'}\n`);

    // Las imágenes que se subieron (archivos en la carpeta)
    const fotosSubidas = [
      {
        url: '/uploads/floristerias/flor-1768947094053-808633660.jpg',
        descripcion: 'Foto 1'
      },
      {
        url: '/uploads/floristerias/flor-1768970501479-291765546.jpg',
        descripcion: 'Foto 2'
      },
      {
        url: '/uploads/floristerias/flor-1768970521826-534181192.jpg',
        descripcion: 'Foto 3'
      },
      {
        url: '/uploads/floristerias/flor-1768970584275-481487718.jpg',
        descripcion: 'Foto 4'
      }
    ];

    // Actualizar la flor con las fotos
    const florActualizada = await Flor.findByIdAndUpdate(
      flor._id,
      {
        $set: {
          fotos: fotosSubidas
        }
      },
      { new: true }
    );

    console.log('✅ Flor actualizada con éxito!');
    console.log(`\n📸 Fotos agregadas:`);
    florActualizada.fotos.forEach((foto, idx) => {
      console.log(`   ${idx + 1}. ${foto.url}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Proceso completado.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

actualizarFlorConFotos();
