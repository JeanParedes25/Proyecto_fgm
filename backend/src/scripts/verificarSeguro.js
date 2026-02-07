// Script para verificar el seguro en MongoDB
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const seguroSchema = new mongoose.Schema({}, { strict: false });
const Seguro = mongoose.model('Seguro', seguroSchema);

async function verificarSeguro() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB\n');

    const segurosExequial = await Seguro.find({ tipo: 'exequial' });
    const todosSeguros = await Seguro.find({});

    console.log(`Seguros con tipo 'exequial': ${segurosExequial.length}`);
    if (segurosExequial.length > 0) {
      console.log('Datos:');
      console.log(JSON.stringify(segurosExequial, null, 2));
    } else {
      console.log('⚠ No hay seguros de tipo exequial\n');
    }

    console.log(`\nTotal de seguros en la BD: ${todosSeguros.length}`);
    if (todosSeguros.length > 0) {
      console.log('Tipos encontrados:');
      todosSeguros.forEach(s => {
        console.log(`  - ${s.tipo} (activo: ${s.activo})`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

verificarSeguro();
