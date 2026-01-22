const mongoose = require('mongoose');
const Plan = require('../models/plan');
require('dotenv').config();

// Script para crear planes de ejemplo en la base de datos

const planesEjemplo = [
  {
    nombre: "Plan Básico",
    precio: 850,
    tipoCofre: "Cofre estándar de madera",
    duracionVelacion: "12 horas",
    salasIncluidas: ["Sala 1"],
    procedimientos: {
      formolizacion: true,
      tanatopraxia: false,
      otros: ""
    },
    transporte: {
      autocarroza: true,
      detalles: "Traslado dentro de la ciudad"
    },
    arregloFloral: {
      incluido: true,
      descripcion: "Arreglo floral básico"
    },
    tramitesLegales: {
      incluido: true,
      descripcion: "Gestión de certificados básicos"
    },
    mediosComunicacion: {
      incluido: false,
      descripcion: ""
    },
    obituariosDomiciliarios: {
      incluido: false,
      cantidad: 0
    },
    cafeteria: {
      bebidas: true,
      vasosTermicos: false,
      descripcion: "Café y té básico"
    },
    insumosSala: {
      incluido: true,
      descripcion: "Sillas y mobiliario estándar"
    },
    serviciosReligiosos: {
      incluido: false,
      descripcion: ""
    },
    mediosDigitales: {
      videoHomenaje: false,
      facebookLive: false,
      otros: ""
    },
    infraestructura: {
      incluido: true,
      descripcion: "Uso de instalaciones básicas"
    },
    equipoFuneraria: {
      incluido: true,
      descripcion: "Personal de apoyo durante la velación"
    },
    activo: true,
    destacado: false
  },
  {
    nombre: "Plan Completo",
    precio: 1500,
    tipoCofre: "Cofre premium de caoba",
    duracionVelacion: "24 horas",
    salasIncluidas: ["Sala VIP", "Sala de recepción"],
    procedimientos: {
      formolizacion: true,
      tanatopraxia: true,
      otros: "Maquillaje y presentación especial"
    },
    transporte: {
      autocarroza: true,
      detalles: "Autocarroza de lujo con seguimiento de 3 vehículos"
    },
    arregloFloral: {
      incluido: true,
      descripcion: "Arreglos florales premium, coronas personalizadas"
    },
    tramitesLegales: {
      incluido: true,
      descripcion: "Gestión completa de trámites legales y documentación"
    },
    mediosComunicacion: {
      incluido: true,
      descripcion: "Publicación en periódico local"
    },
    obituariosDomiciliarios: {
      incluido: true,
      cantidad: 50
    },
    cafeteria: {
      bebidas: true,
      vasosTermicos: true,
      descripcion: "Servicio completo de cafetería con snacks"
    },
    insumosSala: {
      incluido: true,
      descripcion: "Mobiliario premium, aire acondicionado"
    },
    serviciosReligiosos: {
      incluido: true,
      descripcion: "Coordinación con servicios religiosos"
    },
    mediosDigitales: {
      videoHomenaje: true,
      facebookLive: true,
      otros: "Transmisión en vivo con streaming de calidad"
    },
    infraestructura: {
      incluido: true,
      descripcion: "Acceso a todas las instalaciones premium"
    },
    equipoFuneraria: {
      incluido: true,
      descripcion: "Equipo profesional completo disponible 24/7"
    },
    activo: true,
    destacado: true
  },
  {
    nombre: "Plan Económico",
    precio: 550,
    tipoCofre: "Cofre sencillo",
    duracionVelacion: "6 horas",
    salasIncluidas: ["Sala compartida"],
    procedimientos: {
      formolizacion: true,
      tanatopraxia: false,
      otros: ""
    },
    transporte: {
      autocarroza: true,
      detalles: "Traslado básico al cementerio"
    },
    arregloFloral: {
      incluido: false,
      descripcion: ""
    },
    tramitesLegales: {
      incluido: true,
      descripcion: "Trámites esenciales"
    },
    mediosComunicacion: {
      incluido: false,
      descripcion: ""
    },
    obituariosDomiciliarios: {
      incluido: false,
      cantidad: 0
    },
    cafeteria: {
      bebidas: false,
      vasosTermicos: false,
      descripcion: ""
    },
    insumosSala: {
      incluido: true,
      descripcion: "Sillas básicas"
    },
    serviciosReligiosos: {
      incluido: false,
      descripcion: ""
    },
    mediosDigitales: {
      videoHomenaje: false,
      facebookLive: false,
      otros: ""
    },
    infraestructura: {
      incluido: true,
      descripcion: "Uso de instalaciones básicas"
    },
    equipoFuneraria: {
      incluido: true,
      descripcion: "Personal básico de apoyo"
    },
    activo: true,
    destacado: false
  }
];

async function seedPlanes() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm');
    console.log("✅ Conectado a MongoDB");

    // Verificar si ya existen planes
    const planesExistentes = await Plan.countDocuments();
    
    if (planesExistentes > 0) {
      console.log(`⚠️  Ya existen ${planesExistentes} planes en la base de datos`);
      console.log("❓ ¿Desea eliminar los planes existentes y crear nuevos?");
      console.log("   (Modificar el script para confirmar)");
      return;
    }

    // Insertar planes de ejemplo
    console.log("📝 Creando planes de ejemplo...");
    const planesCreados = await Plan.insertMany(planesEjemplo);
    
    console.log(`✅ Se crearon ${planesCreados.length} planes exitosamente:`);
    planesCreados.forEach((plan, index) => {
      console.log(`  ${index + 1}. ${plan.nombre} - $${plan.precio} ${plan.destacado ? '⭐' : ''}`);
    });
    
    console.log("\n💡 Los planes están ahora disponibles en:");
    console.log("   - Panel de administrador: http://localhost:3000");
    console.log("   - Vista de usuario: Sección 'Planes Funerarios'\n");
    
  } catch (error) {
    console.error("❌ Error al crear planes:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Desconectado de MongoDB");
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedPlanes();
}

module.exports = seedPlanes;
