const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

const seedearClientes = async () => {
  try {
    // Verificar si ya existen usuarios
    const clientesExistentes = await Usuario.countDocuments();
    
    if (clientesExistentes > 0) {
      console.log('✅ Base de datos con usuarios existentes. Se valida admin por defecto.');
    }

    console.log('🌱 Iniciando configuración de usuarios administradores...');

    const adminsPorDefecto = [
      {
        nombre: 'FGM Transmisiones',
        email: 'fgmtransmisiones@gmail.com',
        celular: '0999999999',
        password: 'FGM2024!Admin'
      },
      {
        nombre: 'Administrador',
        email: 'admin@gmail.com',
        celular: '0999999999',
        password: 'admin123'
      }
    ];

    for (const admin of adminsPorDefecto) {
      const usuarioExistente = await Usuario.findOne({ email: admin.email });

      if (!usuarioExistente) {
        const passwordHash = await bcrypt.hash(admin.password, 10);

        const adminUsuario = new Usuario({
          nombre: admin.nombre,
          email: admin.email,
          celular: admin.celular,
          password: passwordHash,
          rol: 'admin',
          verificadoCorreo: true,
          proveedor: 'local',
          createdAt: new Date()
        });

        await adminUsuario.save();
        console.log(`✅ Administrador creado: ${admin.email}`);
        continue;
      }

      if (usuarioExistente.rol !== 'admin') {
        usuarioExistente.rol = 'admin';
        await usuarioExistente.save();
        console.log(`✅ Rol admin actualizado: ${admin.email}`);
      } else {
        console.log(`⏭️  Administrador ya existe: ${admin.email}`);
      }
    }

    console.log('🌱 Configuración completada exitosamente');
    console.log('📝 Credenciales de administradores:');
    console.log('   Email: fgmtransmisiones@gmail.com');
    console.log('   Contraseña: FGM2024!Admin');
    console.log('   Email: admin@gmail.com');
    console.log('   Contraseña: admin123');
    console.log('   ⚠️  Cambiar estas contraseñas después del primer login');

  } catch (error) {
    console.error('❌ Error en seeding:', error.message);
  }
};

module.exports = seedearClientes;
