// Migrar notificaciones antiguas de floristería al nuevo modelo general
// Uso: node src/scripts/migrarNotificacionesFlor.js

require('dotenv').config();
const mongoose = require('mongoose');
const NotificacionFloristeria = require('../models/notificacionFlor');
const Notificacion = require('../models/notificacion');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm';

async function migrar() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const antiguas = await NotificacionFloristeria.find();
    console.log(`📦 Notificaciones antiguas encontradas: ${antiguas.length}`);

    let migradas = 0;
    for (const n of antiguas) {
      // Evitar duplicados por pedidoId
      const existe = await Notificacion.findOne({ 'datos.pedidoId': n.pedidoId });
      if (existe) {
        continue;
      }

      await Notificacion.create({
        tipo: 'floristeria',
        titulo: '🌹 Pedido de Floristería',
        mensaje: n.mensaje || 'Nuevo pedido de floristería',
        datos: {
          pedidoId: n.pedidoId,
          nombreCliente: n.nombreCliente,
          codigoArreglo: n.codigoArreglo,
          nombrePersonaFallecida: n.nombrePersonaFallecida,
          descripcionArreglo: n.descripcionArreglo,
          precio: n.precio
        },
        leida: n.leida,
        createdAt: n.createdAt
      });
      migradas += 1;
    }

    console.log(`✅ Migración finalizada. Migradas: ${migradas}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en la migración:', err);
    process.exit(1);
  }
}

migrar();
