const Cliente = require('../models/cliente');
const bcrypt = require('bcrypt');

// Función para crear administrador automáticamente
const crearAdministrador = async () => {
  try {
    const emailAdmin = 'jeanparedes918@gmail.com';
    
    // Verificar si ya existe
    const adminExistente = await Cliente.findOne({ email: emailAdmin });
    
    if (adminExistente) {
      console.log('✅ Administrador ya existe');
      return adminExistente;
    }

    // Crear contraseña segura (debe ser cambiada después)
    // Contraseña por defecto: Admin123!
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    // Crear administrador
    const admin = new Cliente({
      nombre: 'Administrador',
      email: emailAdmin,
      celular: '999999999',
      password: passwordHash,
      rol: 'admin',
      isVerified: true,
      createdAt: new Date()
    });

    await admin.save();
    console.log('✅ Administrador creado exitosamente');
    console.log('📧 Email:', emailAdmin);
    console.log('🔑 Contraseña temporal: Admin123!');
    console.log('⚠️  IMPORTANTE: Cambiar la contraseña después del primer inicio de sesión');
    
    return admin;
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    throw error;
  }
};

module.exports = { crearAdministrador };
