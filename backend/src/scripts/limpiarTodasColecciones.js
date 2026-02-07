// Script para limpiar todas las colecciones principales (excepto usuarios)
const mongoose = require('mongoose');
require('dotenv').config();

// Modelos
const Obituario = require('../models/obituario');
const Plan = require('../models/plan');
const CuentaBancaria = require('../models/cuentaBancaria');
const Servicio = require('../models/servicio');
const Flor = require('../models/flor');
const PedidoFlor = require('../models/pedidoFlor');
const Notificacion = require('../models/notificacion');
const NotificacionFlor = require('../models/notificacionFlor');
const Empresa = require('../models/empresa');
const Seguro = require('../models/seguro');
const AsistenciaPrepago = require('../models/asistenciaPrepago');
const Configuracion = require('../models/configuracion');

async function limpiarColecciones() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB');

    // Limpiar cada colección
    const obituariosEliminados = await Obituario.deleteMany({});
    console.log(`✓ Obituarios eliminados: ${obituariosEliminados.deletedCount}`);

    const planesEliminados = await Plan.deleteMany({});
    console.log(`✓ Planes eliminados: ${planesEliminados.deletedCount}`);

    const cuentasEliminadas = await CuentaBancaria.deleteMany({});
    console.log(`✓ Cuentas bancarias eliminadas: ${cuentasEliminadas.deletedCount}`);

    const serviciosEliminados = await Servicio.deleteMany({});
    console.log(`✓ Servicios eliminados: ${serviciosEliminados.deletedCount}`);

    const floresEliminadas = await Flor.deleteMany({});
    console.log(`✓ Flores eliminadas: ${floresEliminadas.deletedCount}`);

    const pedidosEliminados = await PedidoFlor.deleteMany({});
    console.log(`✓ Pedidos flores eliminados: ${pedidosEliminados.deletedCount}`);

    const notificacionesEliminadas = await Notificacion.deleteMany({});
    console.log(`✓ Notificaciones eliminadas: ${notificacionesEliminadas.deletedCount}`);

    const notifFloresEliminadas = await NotificacionFlor.deleteMany({});
    console.log(`✓ Notificaciones flores eliminadas: ${notifFloresEliminadas.deletedCount}`);

    const empresasEliminadas = await Empresa.deleteMany({});
    console.log(`✓ Datos de empresa eliminados: ${empresasEliminadas.deletedCount}`);

    const segurosEliminados = await Seguro.deleteMany({});
    console.log(`✓ Seguros eliminados: ${segurosEliminados.deletedCount}`);

    const asistenciasEliminadas = await AsistenciaPrepago.deleteMany({});
    console.log(`✓ Asistencias prepago eliminadas: ${asistenciasEliminadas.deletedCount}`);

    const configuracionesEliminadas = await Configuracion.deleteMany({});
    console.log(`✓ Configuraciones eliminadas: ${configuracionesEliminadas.deletedCount}`);

    console.log('\n✅ Todas las colecciones han sido limpiadas exitosamente');
    console.log('⚠️  Nota: Los usuarios NO fueron eliminados');

  } catch (error) {
    console.error('❌ Error al limpiar colecciones:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Desconectado de MongoDB');
    process.exit();
  }
}

limpiarColecciones();
