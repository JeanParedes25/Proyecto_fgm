// Script para verificar las flores en MongoDB
const mongoose = require('mongoose');
const Flor = require('../models/flor');

require('dotenv').config();

async function verificarFlores() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log('✅ Conectado a MongoDB\n');

    const flores = await Flor.find().sort({ createdAt: -1 });

    console.log(`📊 Total de flores: ${flores.length}\n`);

    if (flores.length === 0) {
      console.log('No hay flores en la base de datos.');
      await mongoose.connection.close();
      return;
    }

    flores.forEach((flor, idx) => {
      console.log(`\n📍 Flor ${idx + 1}:`);
      console.log(`   ID: ${flor._id}`);
      console.log(`   Código: ${flor.codigo}`);
      console.log(`   Descripción: ${flor.descripcion || '(sin descripción)'}`);
      console.log(`   Precio: $${flor.precio}`);
      
      if (flor.fotos && flor.fotos.length > 0) {
        console.log(`   Fotos (nueva estructura): ${flor.fotos.length}`);
        flor.fotos.forEach((foto, j) => {
          console.log(`     ${j + 1}. URL: ${foto.url}`);
          console.log(`        Desc: ${foto.descripcion || '(sin descripción)'}`);
        });
      } else {
        console.log(`   Fotos (nueva estructura): 0`);
      }
      
      if (flor.image) {
        console.log(`   Image (estructura antigua): ${flor.image}`);
      } else {
        console.log(`   Image (estructura antigua): (vacío)`);
      }
      
      console.log(`   Creada: ${new Date(flor.createdAt).toLocaleString('es-ES')}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Verificación completada.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verificarFlores();
