const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      mensaje: 'Acceso denegado. Solo administradores pueden realizar esta acción.'
    });
  }
  next();
};

module.exports = isAdmin;
