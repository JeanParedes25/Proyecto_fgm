const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

// Función para crear administrador automáticamente
const crearAdministrador = async () => {
  try {
    const emailAdmin = 'fgmtransmisiones@gmail.com';
    
    // Verificar si ya existe
    const adminExistente = await Usuario.findOne({ email: emailAdmin });
    
    if (adminExistente) {
      // Asegurarse de que tiene rol admin
      if (adminExistente.rol !== 'admin') {
        adminExistente.rol = 'admin';
        await adminExistente.save();
        console.log('✅ Rol de administrador actualizado para', emailAdmin);
      } else {
        console.log('✅ Administrador ya existe');
      }
      return adminExistente;
    }

    // Crear contraseña segura (debe ser cambiada después)
    // Contraseña por defecto: FGM2024!Admin
    const passwordHash = await bcrypt.hash('FGM2024!Admin', 10);

    // Crear administrador
    const admin = new Usuario({
      nombre: 'FGM Transmisiones',
      email: emailAdmin,
      celular: '0999999999',
      password: passwordHash,
      rol: 'admin',
      verificadoCorreo: true,
      proveedor: 'local',
      createdAt: new Date()
    });

    await admin.save();
    console.log('✅ Administrador creado exitosamente');
    console.log('📧 Email:', emailAdmin);
    console.log('🔑 Contraseña temporal: FGM2024!Admin');
    console.log('⚠️  IMPORTANTE: Cambiar la contraseña después del primer inicio de sesión');
    
    return admin;
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    throw error;
  }
};

module.exports = { crearAdministrador };
