const Usuario = require('../models/usuario');
const PedidoFlor = require('../models/pedidoFlor');
const AuditLog = require('../models/auditLog');
const bcrypt = require('bcrypt');

const EMAIL_PRUEBA = 'usuario@gmail.com';
const ADMIN_ANTIGUO_EMAIL = 'admin@gmail.com';
const ADMIN_NUEVO_EMAIL = 'fgmtransmisiones@gmail.com';

const limpiarBaseDatos = async () => {
  try {
    console.log('🧹 Iniciando limpieza de base de datos...');

    const activosActualizados = await Usuario.updateMany(
      { activo: { $exists: false } },
      { $set: { activo: true } }
    );
    if (activosActualizados.modifiedCount > 0) {
      console.log(`   ✅ Usuarios actualizados con activo=true: ${activosActualizados.modifiedCount}`);
    }

    // 1. Eliminar usuario de prueba y sus pedidos
    const usuarioPrueba = await Usuario.findOne({ email: EMAIL_PRUEBA });
    if (usuarioPrueba) {
      const pedidosEliminados = await PedidoFlor.deleteMany({
        $or: [
          { clienteId: usuarioPrueba._id },
          { emailCliente: usuarioPrueba.email }
        ]
      });
      console.log(`   🗑️  Eliminados ${pedidosEliminados.deletedCount} pedidos de ${EMAIL_PRUEBA}`);

      const auditoriaEliminada = await AuditLog.deleteMany({
        $or: [
          { usuarioId: usuarioPrueba._id.toString() },
          { descripcion: { $regex: EMAIL_PRUEBA, $options: 'i' } }
        ]
      });
      console.log(`   🧾 Eliminados ${auditoriaEliminada.deletedCount} registros de auditoria de ${EMAIL_PRUEBA}`);

      await Usuario.deleteOne({ _id: usuarioPrueba._id });
      console.log(`   ✅ Usuario eliminado: ${EMAIL_PRUEBA}`);
    }

    // 2. Buscar el usuario admin@gmail.com por si aún existe
    const adminAntiguo = await Usuario.findOne({ email: ADMIN_ANTIGUO_EMAIL });
    let adminAntiguoId = null;
    if (adminAntiguo) {
      adminAntiguoId = adminAntiguo._id;
    }

    // 3. Verificar si existe el usuario fgmtransmisiones@gmail.com
    let adminNuevo = await Usuario.findOne({ email: ADMIN_NUEVO_EMAIL });
    
    if (!adminNuevo) {
      // Crear el usuario admin si no existe
      console.log(`   📝 Creando usuario administrador: ${ADMIN_NUEVO_EMAIL}`);
      
      const passwordHash = await bcrypt.hash('FGM2024!Admin', 10);
      
      adminNuevo = new Usuario({
        nombre: 'FGM Transmisiones',
        email: ADMIN_NUEVO_EMAIL,
        celular: '0999999999',
        password: passwordHash,
        rol: 'admin',
        verificadoCorreo: true,
        proveedor: 'local',
        createdAt: new Date()
      });
      
      await adminNuevo.save();
      console.log(`   ✅ Administrador creado: ${ADMIN_NUEVO_EMAIL}`);
      console.log('   🔑 Contraseña: FGM2024!Admin');
    } else {
      // Asegurarse de que tenga rol admin
      if (adminNuevo.rol !== 'admin') {
        adminNuevo.rol = 'admin';
        await adminNuevo.save();
        console.log(`   ✅ Actualizado rol de ${ADMIN_NUEVO_EMAIL} a admin`);
      }
    }

    // 4. Transferir datos de admin@gmail.com a fgmtransmisiones@gmail.com
    if (adminAntiguoId && adminNuevo) {
      // Transferir pedidos
      const pedidosTransferidos = await PedidoFlor.updateMany(
        {
          $or: [
            { clienteId: adminAntiguoId },
            { emailCliente: ADMIN_ANTIGUO_EMAIL }
          ]
        },
        {
          $set: {
            clienteId: adminNuevo._id,
            nombreCliente: adminNuevo.nombre,
            emailCliente: adminNuevo.email
          }
        }
      );
      console.log(`   📦 Transferidos ${pedidosTransferidos.modifiedCount} pedidos a ${ADMIN_NUEVO_EMAIL}`);

      // Transferir auditoria
      const auditoriaTransferida = await AuditLog.updateMany(
        { usuarioId: adminAntiguoId.toString() },
        {
          $set: {
            usuarioId: adminNuevo._id.toString(),
            nombreUsuario: adminNuevo.nombre,
            rol: 'admin'
          }
        }
      );
      console.log(`   🧾 Transferidos ${auditoriaTransferida.modifiedCount} registros de auditoria a ${ADMIN_NUEVO_EMAIL}`);

      const auditoriaConEmail = await AuditLog.find({
        descripcion: { $regex: ADMIN_ANTIGUO_EMAIL, $options: 'i' }
      });
      for (const log of auditoriaConEmail) {
        log.descripcion = log.descripcion.replace(new RegExp(ADMIN_ANTIGUO_EMAIL, 'gi'), ADMIN_NUEVO_EMAIL);
        await log.save();
      }

      // Ahora sí eliminar admin@gmail.com
      await Usuario.deleteOne({ _id: adminAntiguoId });
      console.log(`   ✅ Usuario ${ADMIN_ANTIGUO_EMAIL} eliminado después de transferir datos`);
    }

    // 5. Asegurar que solo fgmtransmisiones@gmail.com sea admin
    const adminsActualizados = await Usuario.updateMany(
      { email: { $ne: ADMIN_NUEVO_EMAIL }, rol: 'admin' },
      { $set: { rol: 'usuario' } }
    );
    if (adminsActualizados.modifiedCount > 0) {
      console.log(`   👑 Administradores ajustados a usuario: ${adminsActualizados.modifiedCount}`);
    }

    // 6. Resumen final
    console.log('\n📊 Resumen de limpieza:');
    const totalUsuarios = await Usuario.countDocuments();
    const adminCount = await Usuario.countDocuments({ rol: 'admin' });
    const usuarioCount = await Usuario.countDocuments({ rol: 'usuario' });
    
    console.log(`   👥 Total usuarios: ${totalUsuarios}`);
    console.log(`   👑 Administradores: ${adminCount}`);
    console.log(`   👤 Usuarios normales: ${usuarioCount}`);
    
    const adminActual = await Usuario.findOne({ rol: 'admin' });
    if (adminActual) {
      console.log(`   ✅ Admin actual: ${adminActual.email}`);
    }

    console.log('\n✅ Limpieza completada exitosamente');
    console.log('\n🔐 CREDENCIALES DE ADMINISTRADOR:');
    console.log(`   Email: ${ADMIN_NUEVO_EMAIL}`);
    console.log('   Contraseña: FGM2024!Admin');
    console.log('   ⚠️  Por favor, cambiar esta contraseña después del primer login\n');

  } catch (error) {
    console.error('❌ Error en limpieza de base de datos:', error);
    throw error;
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  require('dotenv').config();
  const mongoose = require('mongoose');
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/funeraria_db';
  
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('📡 Conectado a MongoDB');
      await limpiarBaseDatos();
      await mongoose.disconnect();
      console.log('📡 Desconectado de MongoDB');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error de conexión:', err);
      process.exit(1);
    });
}

module.exports = limpiarBaseDatos;
