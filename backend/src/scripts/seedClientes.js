const bcrypt = require('bcrypt');
const Cliente = require('../models/cliente');

const seedearClientes = async () => {
  try {
    // Verificar si ya existen usuarios
    const clientesExistentes = await Cliente.countDocuments();
    
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
        isVerified: true,
        proveedor: 'local'
      },
      {
        nombre: 'Usuario Prueba',
        email: 'usuario@gmail.com',
        celular: '988888888',
        password: 'user123',
        rol: 'cliente',
        isVerified: true,
        proveedor: 'local'
      }
    ];

    // Hashear contraseñas y crear usuarios
    for (const usuario of usuariosTemporales) {
      // Verificar si el usuario ya existe por email (por si acaso)
      const usuarioExistente = await Cliente.findOne({ email: usuario.email });
      
      if (!usuarioExistente) {
        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(usuario.password, 10);
        
        // Crear el usuario con la contraseña hasheada
        const nuevoUsuario = new Cliente({
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
    console.log('   Usuario: usuario@gmail.com / user123');

  } catch (error) {
    console.error('❌ Error en seeding:', error.message);
  }
};

module.exports = seedearClientes;
