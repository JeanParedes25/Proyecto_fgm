const Cliente = require('../models/cliente');
const bcrypt = require('bcrypt');

// Registro
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el email ya existe
    const clienteExistente = await Cliente.findOne({ email });
    if (clienteExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo cliente
    const nuevoCliente = new Cliente({
      nombre,
      email,
      password: hashedPassword
    });

    await nuevoCliente.save();
    res.status(201).json({ 
      mensaje: 'Cliente registrado exitosamente ✅',
      cliente: {
        id: nuevoCliente._id,
        nombre: nuevoCliente.nombre,
        email: nuevoCliente.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar cliente
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(password, cliente.password);
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Respuesta exitosa
    res.json({
      mensaje: 'Login exitoso ✅',
      cliente: {
        id: cliente._id,
        nombre: cliente.nombre,
        email: cliente.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
