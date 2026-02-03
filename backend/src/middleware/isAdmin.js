const isAdmin = (req, res, next) => {
  try {
    // Verificar que el usuario esté autenticado y sea admin
    // También permitir email específico israelmendoza18@hotmail.com
    if (!req.usuario || (req.usuario.rol !== 'admin' && req.usuario.email !== 'israelmendoza18@hotmail.com')) {
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
