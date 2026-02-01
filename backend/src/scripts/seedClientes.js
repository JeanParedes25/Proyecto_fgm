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

    console.log('🌱 Iniciando seeding de usuarios de prueba...');

    // Datos de usuarios temporales
    const usuariosTemporales = [
      {
        nombre: 'Administrador',
        email: 'admin@gmail.com',
        celular: '999999999',
        password: 'admin123',
        rol: 'admin',
        preguntasSeguridad: {
          comidaFavorita: 'no_aplica',
          primeraMascota: 'no_aplica',
          ciudadNacimiento: 'no_aplica'
        },
        proveedor: 'local'
      },
      {
        nombre: 'Usuario Prueba',
        email: 'user@gmail.com',
        celular: '988888888',
        password: 'user123',
        rol: 'usuario',
        preguntasSeguridad: {
          comidaFavorita: 'pizza',
          primeraMascota: 'firulais',
          ciudadNacimiento: 'riobamba'
        },
        proveedor: 'local'
      }
    ];

    // Hashear contraseñas y crear usuarios
    for (const usuario of usuariosTemporales) {
      // Verificar si el usuario ya existe por email (por si acaso)
      const usuarioExistente = await Usuario.findOne({ email: usuario.email });
      
      if (!usuarioExistente) {
        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(usuario.password, 10);
        
        // Crear el usuario con la contraseña hasheada
        const nuevoUsuario = new Usuario({
          ...usuario,
          password: passwordHash
        });
        
        await nuevoUsuario.save();
        console.log(`✅ Usuario creado: ${usuario.email} (${usuario.rol})`);
      } else {
        console.log(`⏭️  Usuario ya existe: ${usuario.email}`);
      }
    }

    console.log('🌱 Seeding completado exitosamente');
    console.log('📝 Usuarios de prueba disponibles:');
    console.log('   Admin: admin@gmail.com / admin123');
    console.log('   Usuario: user@gmail.com / user123');

  } catch (error) {
    console.error('❌ Error en seeding:', error.message);
  }
};

module.exports = seedearClientes;
