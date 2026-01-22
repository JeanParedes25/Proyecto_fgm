const mongoose = require('mongoose');
const Seguro = require('../models/seguro');
require('dotenv').config();

// Script para inicializar la colección de seguros con datos por defecto

const datosSeguroExequial = {
  tipo: 'exequial',
  titulo: 'Seguro Previsor Familiar',
  subtitulo: 'Servicio familiar exequial desde $1 mensual',
  descripcion: '¿Has pensado qué será de ellos si faltas tú? Previsor es una muestra de amor.',
  beneficios: [
    'Garantizar la tranquilidad de tu familia',
    'Adaptable a tu presupuesto',
    'Cobertura directa e inmediata libre de trámites',
    'Servicio digno',
    'Respaldo de una empresa seria y de trayectoria',
    'Asesoría, infraestructura y personal cualificado'
  ],
  contacto: {
    correo: 'israelmendoza18@hotmail.com',
    web: 'www.funeralesgonzalomendoza.com',
    direccion: 'España 19-31 y Olmedo | Riobamba - Ecuador',
    telefonos: ['099 282 9095', '032 944 608', '098 402 1738']
  },
  activo: true
};

const datosSeguroPrepago = {
  tipo: 'prepago',
  titulo: 'Asistencia Prepago',
  subtitulo: 'Información próximamente disponible',
  descripcion: 'Estamos trabajando para brindarte la mejor información sobre nuestros servicios de asistencia prepago.',
  beneficios: [],
  contacto: {
    correo: 'israelmendoza18@hotmail.com',
    web: 'www.funeralesgonzalomendoza.com',
    direccion: 'España 19-31 y Olmedo | Riobamba - Ecuador',
    telefonos: ['099 282 9095', '032 944 608', '098 402 1738']
  },
  activo: true
};

async function initSeguros() {
  try {
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB");
    console.log(`📦 Base de datos: ${mongoose.connection.db.databaseName}`);

    // Verificar si ya existen los seguros
    const exequialExiste = await Seguro.findOne({ tipo: 'exequial' });
    const prepagoExiste = await Seguro.findOne({ tipo: 'prepago' });

    if (exequialExiste && prepagoExiste) {
      console.log("\n✅ Los seguros ya están inicializados:");
      console.log("   - Asistencia Exequial ✓");
      console.log("   - Asistencia Prepago ✓");
      console.log("\n💡 No es necesario crear nuevos registros\n");
    } else {
      console.log("\n📝 Inicializando seguros...");

      if (!exequialExiste) {
        await Seguro.create(datosSeguroExequial);
        console.log("✅ Asistencia Exequial creada");
      } else {
        console.log("✓ Asistencia Exequial ya existe");
      }

      if (!prepagoExiste) {
        await Seguro.create(datosSeguroPrepago);
        console.log("✅ Asistencia Prepago creada");
      } else {
        console.log("✓ Asistencia Prepago ya existe");
      }

      console.log("\n✨ Seguros inicializados correctamente");
      console.log("💡 Disponibles en el panel de administrador y usuario\n");
    }

    // Mostrar resumen
    const totalSeguros = await Seguro.countDocuments();
    console.log(`📊 Total de seguros en la base de datos: ${totalSeguros}`);
    
  } catch (error) {
    console.error("❌ Error al inicializar seguros:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initSeguros();
}

module.exports = initSeguros;
