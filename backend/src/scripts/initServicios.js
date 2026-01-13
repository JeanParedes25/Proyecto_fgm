// Script para inicializar servicios por defecto en la base de datos
const mongoose = require('mongoose');
require('dotenv').config();

const Servicio = require('../models/servicio');

const serviciosPorDefecto = [
  {
    nombre: 'Servicio Exequial Estándar',
    icono: '⚱️',
    color: '#c49a6c',
    descripcion: 'Servicio completo y accesible',
    introduccion: 'Sabemos los difícil que son aquellos momentos de pérdida de un ser querido y basados en ese sentimiento de empatía, queremos brindarle el mejor servicio para que únicamente tenga en su mente el dar el último adiós. Es por ello que Funerales Gonzalo Mendoza se encarga de todos los aspectos del servicio exequial para su comodidad y tranquilidad.',
    includes: [
      'Trámites Legales',
      'Salas de velación (A, B o C)',
      'Capillas Ardientes dentro y fuera de la ciudad',
      'Servicio Religioso',
      'Gestión para la adquisición del nicho',
      'Obituario Online',
      'Ofrendas Online',
      'Obituario biográfico en pantalla electrónica',
      'Servicio de carroza a campo santo',
      'Crédito directo a 3 y 6 meses sin intereses',
      'Tramitación exequial en el IESS, ISSPOL, ISSFA',
      'Filial de MEMORIAL INTERNATIONAL (Banco Solidario)',
      'Club de clase de la policía, Armoni, Resurrección'
    ],
    halls: ['Sala A', 'Sala B', 'Sala C'],
    capacity: '100 personas',
    extraServices: [
      '🅿️ Parqueadero privado',
      '🛋️ Sala de espera cómoda',
      '☕ Cafetería',
      '🛌 Área de descanso'
    ],
    activo: true
  },
  {
    nombre: 'Servicio Exequial VIP Premium',
    icono: '👑',
    color: '#a77c4f',
    descripcion: 'Moderna sala de velación con servicios premium',
    introduccion: 'Sabemos lo difícil que son aquellos momentos de pérdida de un ser querido y basados en ese sentimiento de empatía, queremos brindarle el mejor servicio para que únicamente tenga en su mente el dar el último adiós. Es por ello que Funerales Gonzalo Mendoza se encarga de todos los aspectos del servicio exequial VIP, en nuestras modernas salas de velación.',
    includes: [
      'Cofre de madera señorial',
      'Trámites legales (Registro Civil, Jefatura civil, entre otros)',
      'Traslado en Auto-Carroza a las salas de velación',
      'Servicio Religioso',
      'Acompañamiento musical ceremonia religiosa',
      'Tanatopraxia',
      'Obituario Online',
      'Ofrendas Online',
      'Libro recordatorio',
      'Formolización',
      'Servicio telefónico (Llamadas locales)',
      'CAMPO SANTO O CREMACIÓN'
    ],
    additional: [
      'Alquiler de bóveda en el cementerio municipal de Riobamba',
      'Cremación con la correspondiente tramitación y traslado'
    ],
    noChargeServices: [
      'Publicación en diario local 1/4 de página',
      'Acompañamiento con música instrumental (noche de velación)',
      'Música ambiental',
      '2 Fotos póster recordatorio a color',
      'Servicios de guardanía privada',
      'Gestión para la adquisición del nicho en el cementerio',
      'Salas virtuales con cámaras IP (Transmición vía internet)'
    ],
    halls: ['Sala VIP'],
    capacity: '500 personas',
    extraServices: [
      '🅿️ Parqueadero privado reservado',
      '🛋️ Salas de espera cómodas',
      '☕ Cafetería premium',
      '🛌 Cuarto de descanso privado',
      '🔬 Laboratorio de tanatopraxia'
    ],
    activo: true
  },
  {
    nombre: 'Servicio de Transporte',
    icono: '🚗',
    color: '#6c757d',
    descripcion: 'Modernas unidades móviles',
    introduccion: 'Le ofrecemos el servicio de Transporte en Auto-carrozas fúnebres modernas y elegantes, antes, durante y después del acompañamiento al cementerio. Otro de los servicios que nos distingue es el del traslado desde cualquier centro hospitalario del IESS, hacia nuestra funeraria.',
    isTransport: true,
    activo: true
  }
];

async function inicializarServicios() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existen servicios
    const serviciosExistentes = await Servicio.countDocuments();
    
    if (serviciosExistentes > 0) {
      console.log(`⚠️  Ya existen ${serviciosExistentes} servicios en la base de datos`);
      console.log('Para reinicializar, ejecute: db.servicios.deleteMany({})');
    } else {
      // Insertar servicios por defecto
      await Servicio.insertMany(serviciosPorDefecto);
      console.log('✅ Servicios inicializados correctamente');
      console.log(`   - Total servicios creados: ${serviciosPorDefecto.length}`);
    }

  } catch (error) {
    console.error('❌ Error al inicializar servicios:', error);
  } finally {
    // Cerrar conexión
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar inicialización
inicializarServicios();
