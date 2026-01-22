// Script para inicializar la colección de floristerías en la base de datos (vacía)
const mongoose = require('mongoose');
require('dotenv').config();

const Flor = require('../models/flor');

async function inicializarFloristerias() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fgm';
    console.log('Conectando a MongoDB:', uri);
    
    await mongoose.connect(uri);

    console.log('Conectado a MongoDB');

    // Verificar si la colección existe
    const contador = await Flor.countDocuments();
    console.log(`Floristerías encontradas en la base de datos: ${contador}`);

    // Limpiar la colección para empezar de cero
    await Flor.deleteMany({});
    console.log('✅ Colección de floristerías inicializada vacía (lista para que el administrador ingrese datos)');

    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('Error al inicializar floristerías:', error);
    process.exit(1);
  }
}

inicializarFloristerias();
