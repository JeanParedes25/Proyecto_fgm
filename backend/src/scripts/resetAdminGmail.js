const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Usuario = require('../models/usuario');

const resetAdminGmail = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm';
    console.log('Conectando a:', mongoUri);
    await mongoose.connect(mongoUri);

    const email = 'admin@gmail.com';
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const actualizado = await Usuario.findOneAndUpdate(
      { email },
      {
        $set: {
          nombre: 'Administrador',
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

    console.log('✅ Admin listo:', actualizado.email);
    console.log('🔑 Contraseña:', password);

    await mongoose.disconnect();
    console.log('✅ Desconexión completada');
  } catch (error) {
    console.error('❌ Error al resetear admin@gmail.com:', error.message);
    process.exit(1);
  }
};

resetAdminGmail();
