const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

const seedearClientes = async () => {
  try {
    // Verificar si ya existen usuarios
    const clientesExistentes = await Usuario.countDocuments();
    
    if (clientesExistentes > 0) {
      console.log('✅ Base de datos con usuarios existentes. No se realiza seeding.');
      return;
    }

    console.log('🌱 Iniciando configuración de usuario administrador...');

    // Solo crear el administrador principal
    const adminEmail = 'fgmtransmisiones@gmail.com';
    const usuarioExistente = await Usuario.findOne({ email: adminEmail });
    
    if (!usuarioExistente) {
      // Hashear la contraseña
      const passwordHash = await bcrypt.hash('FGM2024!Admin', 10);
      
      // Crear el usuario administrador
      const adminUsuario = new Usuario({
        nombre: 'FGM Transmisiones',
        email: adminEmail,
        celular: '0999999999',
        password: passwordHash,
        rol: 'admin',
        verificadoCorreo: true,
        proveedor: 'local',
        createdAt: new Date()
      });
      
      await adminUsuario.save();
      console.log(`✅ Administrador creado: ${adminEmail}`);
    } else {
      console.log(`⏭️  Administrador ya existe: ${adminEmail}`);
    }

    console.log('🌱 Configuración completada exitosamente');
    console.log('📝 Credenciales del administrador:');
    console.log('   Email: fgmtransmisiones@gmail.com');
    console.log('   Contraseña: FGM2024!Admin');
    console.log('   ⚠️  Cambiar esta contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error en seeding:', error.message);
  }
};

module.exports = seedearClientes;
