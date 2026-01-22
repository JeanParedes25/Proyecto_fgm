// Script para limpiar todas las floristerías de la base de datos
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const Flor = require('../models/flor');

async function limpiarFloristerias() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fgm';
    console.log('Conectando a MongoDB:', uri);
    
    await mongoose.connect(uri);

    console.log('Conectado a MongoDB');

    // Obtener todas las flores para eliminar sus imágenes
    const flores = await Flor.find({});
    console.log(`Encontradas ${flores.length} flores`);

    // Eliminar imágenes del servidor
    const uploadDir = path.join(__dirname, '../../uploads/floristerias');
    if (fs.existsSync(uploadDir)) {
      const archivos = fs.readdirSync(uploadDir);
      archivos.forEach((archivo) => {
        const rutaArchivo = path.join(uploadDir, archivo);
        if (fs.lstatSync(rutaArchivo).isFile()) {
          fs.unlinkSync(rutaArchivo);
          console.log(`  ✓ Eliminado: ${archivo}`);
        }
      });
    }

    // Eliminar registros de la base de datos
    const resultado = await Flor.deleteMany({});
    console.log(`✅ ${resultado.deletedCount} flores eliminadas de la base de datos`);

    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('Error al limpiar floristerías:', error);
    process.exit(1);
  }
}

limpiarFloristerias();
