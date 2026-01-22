const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ 
        success: false, 
        mensaje: 'Acceso denegado. No se proporcionó token.' 
      });
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_funeraria_2024');
    console.log('Token verificado:', decoded);
    
    // Agregar usuario al request
    req.usuario = decoded;
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ 
      success: false, 
      mensaje: 'Token inválido o expirado: ' + error.message 
    });
  }
};

// Middleware para verificar rol de administrador
const isAdmin = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ 
        success: false, 
        mensaje: 'No autenticado' 
      });
    }

    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        mensaje: 'Acceso denegado. Se requieren permisos de administrador' 
      });
    }

    next();
  } catch (error) {
    console.error('Error en verificación de admin:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error en la verificación: ' + error.message 
    });
  }
};

module.exports = auth;
module.exports.isAdmin = isAdmin;
