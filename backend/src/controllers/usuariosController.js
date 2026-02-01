const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { registrarEvento } = require('./auditController');

const normalizarRespuesta = (valor) => (valor || '').toString().trim().toLowerCase();

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, 'nombre email rol createdAt').sort({ createdAt: -1 });
    res.json({ success: true, usuarios });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ success: false, mensaje: 'Error al listar usuarios' });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ success: false, mensaje: 'Todos los campos son requeridos' });
    }

    if (!['admin', 'usuario'].includes(rol)) {
      return res.status(400).json({ success: false, mensaje: 'Rol inválido' });
    }

    const existe = await Usuario.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({ success: false, mensaje: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email: email.toLowerCase(),
      celular: 'N/A',
      password: passwordHash,
      rol
    });

    await nuevoUsuario.save();

    // Registrar evento en auditoría
    await registrarEvento(
      'create',
      req.usuario.nombre,
      req.usuario.email,
      `Usuario ${email} creado con rol ${rol}`,
      'usuario',
      nuevoUsuario._id.toString()
    );

    res.status(201).json({
      success: true,
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        createdAt: nuevoUsuario.createdAt
      }
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, mensaje: 'Error al crear usuario' });
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario
};
