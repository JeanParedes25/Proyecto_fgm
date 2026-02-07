const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registrarEvento } = require('./auditController');
const { enviarCodigoVerificacion, enviarCodigoRecuperacion } = require('../services/emailService');

// Constantes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_funeraria_2024';
const CODIGO_VERIFICACION_TIEMPO = 10 * 60 * 1000; // 10 minutos
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'fgmtransmisiones@gmail.com').toLowerCase();

// Función para generar código numérico de 5 dígitos
const generarCodigoVerificacion = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const normalizarRespuesta = (valor) => (valor || '').toString().trim().toLowerCase();

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
    const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailNormalizado = email.toLowerCase();
    const nuevoUsuario = new Usuario({
      nombre,
      email: emailNormalizado,
      celular,
      password: hashedPassword,
      rol: emailNormalizado === ADMIN_EMAIL ? 'admin' : 'usuario',
      activo: true
    });

    // Generar código de verificación
    const codigoVerificacion = generarCodigoVerificacion();
    const tiempoExpiracion = new Date(Date.now() + CODIGO_VERIFICACION_TIEMPO);

    nuevoUsuario.codigoCorreo = codigoVerificacion;
    nuevoUsuario.codigoCorreoExpira = tiempoExpiracion;
    nuevoUsuario.verificadoCorreo = false;

    await nuevoUsuario.save();

    // Registrar creación de usuario en auditoría
    await registrarEvento({
      usuarioId: nuevoUsuario._id.toString(),
      nombreUsuario: nuevoUsuario.nombre,
      rol: nuevoUsuario.rol,
      accion: 'CREATE',
      modulo: 'Usuarios',
      descripcion: `Registro de usuario ${nuevoUsuario.email}`,
      ip: req.ip || null
    });

    // Enviar código por correo
    const emailEnviado = await enviarCodigoVerificacion(
      nuevoUsuario.email,
      codigoVerificacion,
      nuevoUsuario.nombre
    );

    if (!emailEnviado) {
      console.error('⚠️ No se pudo enviar el código de verificación a:', nuevoUsuario.email);
      // No frenamos el registro si el email falla - el usuario puede intentar reenviar después
    }

    res.status(201).json({ 
      mensaje: 'Registro exitoso. Te enviamos un código de verificación a tu correo',
      usuarioId: nuevoUsuario._id,
      email: nuevoUsuario.email,
      requiereVerificacion: true,
      emailFallo: !emailEnviado
    });
  } catch (err) {
    console.error('Error en registro:', err);
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

    // Buscar cliente
    const emailNormalizado = email.toLowerCase();
    const usuario = await Usuario.findOne({ email: emailNormalizado });
    
    if (!usuario) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar si la cuenta está inactiva
    if (usuario.activo === false) {
      return res.status(403).json({ error: 'Usuario inactivo. Contacta al administrador' });
    }

    // Verificar si la cuenta está bloqueada
    if (usuario.lockUntil && usuario.lockUntil > new Date()) {
      const minutosRestantes = Math.ceil((usuario.lockUntil - new Date()) / 60000);
      return res.status(423).json({ 
        error: `Cuenta bloqueada por múltiples intentos fallidos. Intenta en ${minutosRestantes} minutos` 
      });
    }


    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(password, usuario.password);
    
    if (!contraseñaValida) {
      // Incrementar intentos fallidos
      usuario.loginAttempts += 1;
      
      if (usuario.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        usuario.lockUntil = new Date(Date.now() + LOCK_TIME);
        await usuario.save();
        return res.status(423).json({ 
          error: 'Cuenta bloqueada por múltiples intentos fallidos. Intenta en 15 minutos' 
        });
      }
      
      await usuario.save();
      return res.status(401).json({ 
        error: `Email o contraseña incorrectos. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - usuario.loginAttempts}` 
      });
    }

    // Resetear intentos fallidos
    if (usuario.loginAttempts > 0 || usuario.lockUntil) {
      usuario.loginAttempts = 0;
      usuario.lockUntil = null;
      await usuario.save();
    }

    // Forzar regla de administrador unico
    if (emailNormalizado === ADMIN_EMAIL && usuario.rol !== 'admin') {
      usuario.rol = 'admin';
      await usuario.save();
    }
    if (emailNormalizado !== ADMIN_EMAIL && usuario.rol === 'admin') {
      usuario.rol = 'usuario';
      await usuario.save();
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario._id, 
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Registrar login en auditoría
    await registrarEvento({
      usuarioId: usuario._id.toString(),
      nombreUsuario: usuario.nombre,
      rol: usuario.rol,
      accion: 'LOGIN',
      modulo: 'Usuarios',
      descripcion: `Login exitoso desde ${req.ip || 'IP desconocida'}`,
      ip: req.ip || null
    });

    // Respuesta exitosa
    res.json({
      mensaje: 'Login exitoso',
      token: token,
      cliente: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        celular: usuario.celular,
        rol: usuario.rol
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// OBTENER PERFIL
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      nombre: usuario.nombre,
      email: usuario.email,
      celular: usuario.celular,
      rol: usuario.rol,
      lastPasswordChange: usuario.lastPasswordChange,
      createdAt: usuario.createdAt
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
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (nombre) usuario.nombre = nombre;
    if (celular) usuario.celular = celular;

    await usuario.save();

    res.json({ 
      mensaje: 'Perfil actualizado exitosamente',
      cliente: {
        nombre: usuario.nombre,
        email: usuario.email,
        celular: usuario.celular,
        rol: usuario.rol
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

    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const contraseñaValida = await bcrypt.compare(currentPassword, usuario.password);
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.password = hashedPassword;
    usuario.lastPasswordChange = new Date();
    await usuario.save();

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

    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const contraseñaValida = await bcrypt.compare(password, usuario.password);
    
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ mensaje: 'Autenticación exitosa' });
  } catch (err) {
    console.error('Error en reautenticación:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// GOOGLE OAUTH
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token de Google es requerido' });
    }

    // Validar token de Google
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: 'No se pudo obtener el email de Google' });
    }

    // Buscar o crear usuario
    const emailNormalizado = email.toLowerCase();
    let usuario = await Usuario.findOne({ email: emailNormalizado });

    if (!usuario) {
      return res.status(403).json({ error: 'Acceso denegado. Usuario no registrado' });
    }

    if (usuario.activo === false) {
      return res.status(403).json({ error: 'Usuario inactivo. Contacta al administrador' });
    }

    // Usuario ya existe - actualizar información si viene de Google
    if (usuario.proveedor === 'google') {
      usuario.fotoGoogle = picture || usuario.fotoGoogle;
      if (name) usuario.nombre = name;
    }

    // Forzar regla de administrador unico
    if (emailNormalizado === ADMIN_EMAIL && usuario.rol !== 'admin') {
      usuario.rol = 'admin';
    }
    if (emailNormalizado !== ADMIN_EMAIL && usuario.rol === 'admin') {
      usuario.rol = 'usuario';
    }

    await usuario.save();

    // Generar JWT
    const jwtToken = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Registrar evento de auditoría
    await registrarEvento({
      usuarioId: usuario._id.toString(),
      nombreUsuario: usuario.nombre,
      rol: usuario.rol,
      accion: 'LOGIN',
      modulo: 'Usuarios',
      descripcion: `Login con Google (${emailNormalizado}) desde ${req.ip || 'IP desconocida'}`,
      ip: req.ip || null
    });

    res.json({
      token: jwtToken,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        foto: usuario.fotoGoogle
      }
    });
  } catch (err) {
    console.error('Error en login de Google:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// VERIFICAR CÓDIGO DE CORREO (DESPUÉS DEL REGISTRO)
exports.verificarCodigoCorreo = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({ error: 'Email y código son requeridos' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si ya está verificado
    if (usuario.verificadoCorreo) {
      return res.status(400).json({ error: 'El correo ya ha sido verificado' });
    }

    // Verificar si el código existe y no ha expirado
    if (!usuario.codigoCorreo || !usuario.codigoCorreoExpira) {
      return res.status(400).json({ error: 'No hay código válido solicitado' });
    }

    if (usuario.codigoCorreoExpira < new Date()) {
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo' });
    }

    // Verificar si el código es correcto
    if (usuario.codigoCorreo !== codigo.trim()) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }

    // Marcar como verificado
    usuario.verificadoCorreo = true;
    usuario.codigoCorreo = null;
    usuario.codigoCorreoExpira = null;

    await usuario.save();

    res.json({ 
      mensaje: 'Correo verificado exitosamente. Ahora puedes iniciar sesión',
      verificado: true
    });
  } catch (err) {
    console.error('Error al verificar código:', err);
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

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si ya está verificado
    if (usuario.verificadoCorreo) {
      return res.status(400).json({ error: 'El correo ya ha sido verificado' });
    }

    // Generar nuevo código
    const codigoVerificacion = generarCodigoVerificacion();
    const tiempoExpiracion = new Date(Date.now() + CODIGO_VERIFICACION_TIEMPO);

    usuario.codigoCorreo = codigoVerificacion;
    usuario.codigoCorreoExpira = tiempoExpiracion;

    await usuario.save();

    // Enviar código por correo
    const emailEnviado = await enviarCodigoVerificacion(
      usuario.email,
      codigoVerificacion,
      usuario.nombre
    );

    if (!emailEnviado) {
      console.error('⚠️ No se pudo reenviar el código a:', usuario.email);
      return res.status(500).json({ 
        error: 'No se pudo enviar el código de verificación. Intenta nuevamente o contacta a soporte.' 
      });
    }

    res.json({ 
      mensaje: 'Código de verificación reenviado a tu correo',
      email: usuario.email
    });
  } catch (err) {
    console.error('Error al reenviar código:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// ENVIAR CÓDIGO PARA RECUPERACIÓN DE CONTRASEÑA (después de validar preguntas)
// ENVIAR CÓDIGO PARA RECUPERACIÓN DE CONTRASEÑA (SOLO EMAIL)
exports.enviarCodigoRecuperacionPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      return res.status(404).json({ error: 'No se encontró una cuenta con este correo' });
    }

    // Generar código de verificación
    const codigoVerificacion = generarCodigoVerificacion();
    const tiempoExpiracion = new Date(Date.now() + CODIGO_VERIFICACION_TIEMPO);

    usuario.codigoCorreo = codigoVerificacion;
    usuario.codigoCorreoExpira = tiempoExpiracion;

    await usuario.save();

    // Enviar código por correo
    const emailEnviado = await enviarCodigoRecuperacion(
      usuario.email,
      codigoVerificacion,
      usuario.nombre
    );

    if (!emailEnviado) {
      console.error('⚠️ No se pudo enviar el código de recuperación a:', usuario.email);
      return res.status(500).json({ 
        error: 'No se pudo enviar el código de recuperación. Intenta nuevamente o contacta a soporte.' 
      });
    }

    res.json({ 
      mensaje: 'Código de recuperación enviado a tu correo',
      email: usuario.email,
      requiereCodigoRecuperacion: true
    });
  } catch (err) {
    console.error('Error al enviar código de recuperación:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

// VERIFICAR CÓDIGO DE RECUPERACIÓN Y CAMBIAR CONTRASEÑA
exports.verificarCodigoRecuperacionPassword = async (req, res) => {
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

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el código existe y no ha expirado
    if (!usuario.codigoCorreo || !usuario.codigoCorreoExpira) {
      return res.status(400).json({ error: 'No hay código válido solicitado' });
    }

    if (usuario.codigoCorreoExpira < new Date()) {
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo' });
    }

    // Verificar si el código es correcto
    if (usuario.codigoCorreo !== codigo.trim()) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.password = hashedPassword;
    usuario.lastPasswordChange = new Date();
    usuario.codigoCorreo = null;
    usuario.codigoCorreoExpira = null;
    usuario.recoveryAttempts = 0;
    usuario.recoveryLockUntil = null;

    await usuario.save();

    res.json({ 
      mensaje: 'Contraseña restablecida exitosamente',
      contrasenaActualizada: true
    });
  } catch (err) {
    console.error('Error al verificar código de recuperación:', err);
    res.status(500).json({ error: 'Error en el servidor: ' + err.message });
  }
};

