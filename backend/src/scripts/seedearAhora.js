const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Cliente = require('../models/cliente');

const ejecutarSeeding = async () => {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm';
    console.log('Conectando a:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('📦 Conectado a MongoDB');

    // Verificar si ya existen usuarios
    const clientesExistentes = await Cliente.countDocuments();
    
    if (clientesExistentes > 0) {
      console.log('✅ Base de datos con usuarios existentes. No se realiza seeding.');
      console.log(`Total de usuarios: ${clientesExistentes}`);
      
      // Mostrar usuarios existentes
      const usuarios = await Cliente.find().select('nombre email rol');
      console.log('\nUsuarios actuales:');
      usuarios.forEach(u => {
        console.log(`  - ${u.nombre} (${u.email}) - ${u.rol}`);
      });
      
      await mongoose.disconnect();
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
        isVerified: true
      },
      {
        nombre: 'Usuario Prueba',
        email: 'usuario@gmail.com',
        celular: '988888888',
        password: 'user123',
        rol: 'cliente',
        isVerified: true
      }
    ];

    // Hashear contraseñas y crear usuarios
    for (const usuario of usuariosTemporales) {
      // Hashear la contraseña
      const passwordHash = await bcrypt.hash(usuario.password, 10);
      
      // Crear el usuario con la contraseña hasheada
      const nuevoUsuario = new Cliente({
        ...usuario,
        password: passwordHash
      });
      
      await nuevoUsuario.save();
      console.log(`✅ Usuario creado: ${usuario.email} (${usuario.rol})`);
    }

    console.log('\n🌱 Seeding completado exitosamente');
    console.log('📝 Usuarios de prueba disponibles:');
    console.log('   Admin: admin@gmail.com / admin123');
    console.log('   Usuario: usuario@gmail.com / user123');

    await mongoose.disconnect();
    console.log('\n✅ Desconexión completada');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

ejecutarSeeding();
