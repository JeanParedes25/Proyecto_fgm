const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Usuario = require('../models/usuario');

const crearAdminsAtlas = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm';
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    const admins = [
      { email: 'admin@gmail.com', password: 'admin123', nombre: 'Administrador' },
      { email: 'administrador@gmail.com', password: 'admin123', nombre: 'Administrador' },
      { email: 'fgmtransmisiones@gmail.com', password: 'FGM2024!Admin', nombre: 'FGM Transmisiones' }
    ];

    for (const admin of admins) {
      const passwordHash = await bcrypt.hash(admin.password, 10);

      const resultado = await Usuario.findOneAndUpdate(
        { email: admin.email },
        {
          $set: {
            nombre: admin.nombre,
            email: admin.email,
            celular: '0999999999',
            password: passwordHash,
            rol: 'admin',
            verificadoCorreo: true,
            proveedor: 'local',
            activo: true,
            loginAttempts: 0,
            lockUntil: null
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Admin actualizado/creado: ${admin.email}`);
    }

    console.log('\n📝 Credenciales de administradores:');
    console.log('   Email: admin@gmail.com | Contraseña: admin123');
    console.log('   Email: administrador@gmail.com | Contraseña: admin123');
    console.log('   Email: fgmtransmisiones@gmail.com | Contraseña: FGM2024!Admin');

    await mongoose.disconnect();
    console.log('\n✅ Desconexión completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

crearAdminsAtlas();
