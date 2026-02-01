const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

// Función para crear administrador automáticamente
const crearAdministrador = async () => {
  try {
    const emailAdmin = 'admin@gmail.com';
    
    // Verificar si ya existe
    const adminExistente = await Usuario.findOne({ email: emailAdmin });
    
    if (adminExistente) {
      console.log('✅ Administrador ya existe');
      return adminExistente;
    }

    // Crear contraseña segura (debe ser cambiada después)
    // Contraseña por defecto: admin123
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Crear administrador
    const admin = new Usuario({
      nombre: 'Administrador',
      email: emailAdmin,
      celular: '999999999',
      password: passwordHash,
      rol: 'admin',
      preguntasSeguridad: {
        comidaFavorita: 'no_aplica',
        primeraMascota: 'no_aplica',
        ciudadNacimiento: 'no_aplica'
      },
      createdAt: new Date()
    });

    await admin.save();
    console.log('✅ Administrador creado exitosamente');
    console.log('📧 Email:', emailAdmin);
    console.log('🔑 Contraseña temporal: admin123');
    console.log('⚠️  IMPORTANTE: Cambiar la contraseña después del primer inicio de sesión');
    
    return admin;
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    throw error;
  }
};

module.exports = { crearAdministrador };
