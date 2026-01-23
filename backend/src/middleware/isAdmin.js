const isAdmin = (req, res, next) => {
  try {
    // Verificar que el usuario esté autenticado y sea admin
    if (!req.usuario || req.usuario.rol !== 'admin') {
      console.log('Acceso denegado - Usuario no es admin:', req.usuario);
      return res.status(403).json({
        success: false,
        mensaje: 'Acceso denegado. Solo administradores pueden realizar esta acción.'
      });
    }
    next();
  } catch (error) {
    console.error('Error en isAdmin:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error de servidor'
    });
  }
};

module.exports = isAdmin;
