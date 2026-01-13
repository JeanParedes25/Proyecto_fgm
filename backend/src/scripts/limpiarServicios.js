// Script para eliminar todos los servicios
const mongoose = require('mongoose');
require('dotenv').config();

const Servicio = require('../models/servicio');

async function limpiarServicios() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    await Servicio.deleteMany({});
    console.log('✅ Todos los servicios han sido eliminados');
    console.log('   La sección de servicios ahora mostrará "En Desarrollo"');

  } catch (error) {
    console.error('❌ Error al limpiar servicios:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  }
}

limpiarServicios();
