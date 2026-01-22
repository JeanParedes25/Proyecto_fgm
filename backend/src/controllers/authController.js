const Cliente = require('../models/cliente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
  enviarCodigoVerificacion, 
  enviarCodigoRecuperacion, 
  enviarConfirmacionCambioPassword,
  generarCodigo 
} = require('../services/emailService');
const { crearAdministrador } = require('../scripts/crearAdmin');

// Constantes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos
const CODIGO_EXPIRACION = 15 * 60 * 1000; // 15 minutos
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_funeraria_2024';

// Validar política de contraseñas
const validarPassword = (password) => {
  const errores = [];
  
  if (password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errores.push('La contraseña debe contener al menos una minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errores.push('La contraseña debe contener al menos un número');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errores.push('La contraseña debe contener al menos un carácter especial (!@#$%^&*)');
  }
  
  return errores;
};

// REGISTRO
exports.register = async (req, res) => {
  try {
    const { nombre, email, celular, password, confirmPassword } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !celular || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Validar política de contraseñas
    const erroresPassword = validarPassword(password);
    if (erroresPassword.length > 0) {
      return res.status(400).json({ error: erroresPassword.join('. ') });
    }

    // Verificar si el email ya existe
    const clienteExistente = await Cliente.findOne({ email: email.toLowerCase() });
    if (clienteExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar código de verificación
    const codigo = generarCodigo();
    const codigoExpiracion = new Date(Date.now() + CODIGO_EXPIRACION);

    // Crear nuevo cliente
    const nuevoCliente = new Cliente({
      nombre,
      email: email.toLowerCase(),
      celular,
      password: hashedPassword,
      rol: 'cliente',
      isVerified: false,
      verificationCode: codigo,
      verificationExpires: codigoExpiracion
    });

    await nuevoCliente.save();

    // Enviar código de verificación
    const emailEnviado = await enviarCodigoVerificacion(email, codigo, nombre);
    
    if (!emailEnviado) {
      console.warn('⚠️  No se pudo enviar el email de verificación');
    }

    res.status(201).json({ 
      mensaje: 'Registro exitoso. Revisa tu email para verificar tu cuenta',
      clienteId: nuevoCliente._id,
      email: nuevoCliente.email
    });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// VERIFICAR EMAIL
exports.verificarEmail = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({ error: 'Email y código son requeridos' });
    }

    const cliente = await Cliente.findOne({ email: email.toLowerCase() });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    if (cliente.isVerified) {
      return res.status(400).json({ error: 'El email ya está verificado' });
    }

    // Verificar si el código expiró
    if (!cliente.verificationExpires || cliente.verificationExpires < new Date()) {
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo' });
    }

    // Verificar código
    if (cliente.verificationCode !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }

    // Actualizar cliente
    cliente.isVerified = true;
    cliente.verificationCode = null;
    cliente.verificationExpires = null;
    await cliente.save();

    res.json({ mensaje: 'Email verificado exitosamente. Ya puedes iniciar sesión' });
  } catch (err) {
    console.error('Error en verificación:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// REENVIAR CÓDIGO DE VERIFICACIÓN
exports.reenviarCodigoVerificacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    const cliente = await Cliente.findOne({ email: email.toLowerCase() });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    if (cliente.isVerified) {
      return res.status(400).json({ error: 'El email ya está verificado' });
    }

    // Generar nuevo código
    const codigo = generarCodigo();
    const codigoExpiracion = new Date(Date.now() + CODIGO_EXPIRACION);

    cliente.verificationCode = codigo;
    cliente.verificationExpires = codigoExpiracion;
    await cliente.save();

    // Enviar código
    await enviarCodigoVerificacion(email, codigo, cliente.nombre);

    res.json({ mensaje: 'Código de verificación reenviado' });
  } catch (err) {
    console.error('Error al reenviar código:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Intentar crear administrador si no existe
    await crearAdministrador();

    // Buscar cliente
    const cliente = await Cliente.findOne({ email: email.toLowerCase() });
    
    if (!cliente) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar si la cuenta está bloqueada
    if (cliente.lockUntil && cliente.lockUntil > new Date()) {
      const minutosRestantes = Math.ceil((cliente.lockUntil - new Date()) / 60000);
      return res.status(423).json({ 
        error: `Cuenta bloqueada por múltiples intentos fallidos. Intenta en ${minutosRestantes} minutos` 
      });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(password, cliente.password);
    
    if (!contraseñaValida) {
      // Incrementar intentos fallidos
      cliente.loginAttempts += 1;
      
      if (cliente.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        cliente.lockUntil = new Date(Date.now() + LOCK_TIME);
        await cliente.save();
        return res.status(423).json({ 
          error: 'Cuenta bloqueada por múltiples intentos fallidos. Intenta en 15 minutos' 
        });
      }
      
      await cliente.save();
      return res.status(401).json({ 
        error: `Email o contraseña incorrectos. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - cliente.loginAttempts}` 
      });
    }

    // Verificar si el email está verificado (excepto admin)
    if (!cliente.isVerified && cliente.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Debes verificar tu email antes de iniciar sesión',
        needsVerification: true
      });
    }

    // Resetear intentos fallidos
    if (cliente.loginAttempts > 0 || cliente.lockUntil) {
      cliente.loginAttempts = 0;
      cliente.lockUntil = null;
      await cliente.save();
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: cliente._id, 
        email: cliente.email,
        nombre: cliente.nombre,
        rol: cliente.rol
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respuesta exitosa
    res.json({
      mensaje: 'Login exitoso',
      token: token,
      cliente: {
        id: cliente._id,
        nombre: cliente.nombre,
        email: cliente.email,
        celular: cliente.celular,
        rol: cliente.rol,
        isVerified: cliente.isVerified
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// SOLICITAR RECUPERACIÓN DE CONTRASEÑA
exports.solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    const cliente = await Cliente.findOne({ email: email.toLowerCase() });

    if (!cliente) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({ mensaje: 'Si el email existe, recibirás un código de recuperación' });
    }

    // Generar código de recuperación
    const codigo = generarCodigo();
    const codigoExpiracion = new Date(Date.now() + CODIGO_EXPIRACION);

    cliente.resetPasswordCode = codigo;
    cliente.resetPasswordExpires = codigoExpiracion;
    await cliente.save();

    // Enviar código
    await enviarCodigoRecuperacion(email, codigo, cliente.nombre);

    res.json({ mensaje: 'Si el email existe, recibirás un código de recuperación' });
  } catch (err) {
    console.error('Error en solicitud de recuperación:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// VERIFICAR CÓDIGO DE RECUPERACIÓN
exports.verificarCodigoRecuperacion = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({ error: 'Email y código son requeridos' });
    }

    const cliente = await Cliente.findOne({ email: email.toLowerCase() });

    if (!cliente || !cliente.resetPasswordCode) {
      return res.status(400).json({ error: 'Código inválido' });
    }

    // Verificar si el código expiró
    if (!cliente.resetPasswordExpires || cliente.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: 'El código ha expirado' });
    }

    // Verificar código
    if (cliente.resetPasswordCode !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }

    res.json({ mensaje: 'Código válido. Puedes proceder a cambiar tu contraseña' });
  } catch (err) {
    console.error('Error en verificación de código:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// RESTABLECER CONTRASEÑA
exports.restablecerPassword = async (req, res) => {
  try {
    const { email, codigo, newPassword, confirmPassword } = req.body;

    if (!email || !codigo || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Validar política de contraseñas
    const erroresPassword = validarPassword(newPassword);
    if (erroresPassword.length > 0) {
      return res.status(400).json({ error: erroresPassword.join('. ') });
    }

    const cliente = await Cliente.findOne({ email: email.toLowerCase() });

    if (!cliente || !cliente.resetPasswordCode) {
      return res.status(400).json({ error: 'Código inválido' });
    }

    // Verificar si el código expiró
    if (!cliente.resetPasswordExpires || cliente.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: 'El código ha expirado' });
    }

    // Verificar código
    if (cliente.resetPasswordCode !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    cliente.password = hashedPassword;
    cliente.resetPasswordCode = null;
    cliente.resetPasswordExpires = null;
    cliente.lastPasswordChange = new Date();
    cliente.loginAttempts = 0;
    cliente.lockUntil = null;
    await cliente.save();

    // Enviar confirmación
    await enviarConfirmacionCambioPassword(email, cliente.nombre);

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    console.error('Error al restablecer contraseña:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// OBTENER PERFIL
exports.obtenerPerfil = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.usuario.id).select('-password');
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({
      nombre: cliente.nombre,
      email: cliente.email,
      celular: cliente.celular,
      rol: cliente.rol,
      isVerified: cliente.isVerified,
      lastPasswordChange: cliente.lastPasswordChange,
      createdAt: cliente.createdAt
    });
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// ACTUALIZAR PERFIL
exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre, celular } = req.body;
    const cliente = await Cliente.findById(req.usuario.id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    if (nombre) cliente.nombre = nombre;
    if (celular) cliente.celular = celular;

    await cliente.save();

    res.json({ 
      mensaje: 'Perfil actualizado exitosamente',
      cliente: {
        nombre: cliente.nombre,
        email: cliente.email,
        celular: cliente.celular,
        rol: cliente.rol
      }
    });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// CAMBIAR CONTRASEÑA
exports.cambiarPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Validar política de contraseñas
    const erroresPassword = validarPassword(newPassword);
    if (erroresPassword.length > 0) {
      return res.status(400).json({ error: erroresPassword.join('. ') });
    }

    const cliente = await Cliente.findById(req.usuario.id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar contraseña actual
    const contraseñaValida = await bcrypt.compare(currentPassword, cliente.password);
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    cliente.password = hashedPassword;
    cliente.lastPasswordChange = new Date();
    await cliente.save();

    // Enviar confirmación
    await enviarConfirmacionCambioPassword(cliente.email, cliente.nombre);

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// REAUTENTICACIÓN
exports.reautenticar = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Contraseña es requerida' });
    }

    const cliente = await Cliente.findById(req.usuario.id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const contraseñaValida = await bcrypt.compare(password, cliente.password);
    
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ mensaje: 'Autenticación exitosa' });
  } catch (err) {
    console.error('Error en reautenticación:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};
