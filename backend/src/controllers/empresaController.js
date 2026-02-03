const Empresa = require('../models/empresa');

// Obtener información de la empresa
const obtenerEmpresa = async (req, res) => {
  try {
    console.log('=== OBTENER INFORMACIÓN DE LA EMPRESA ===');
    
    let empresa = await Empresa.findOne({ esUnico: true });
    
    // Si no existe, crear documento con datos por defecto
    if (!empresa) {
      console.log('Creando documento de empresa con datos por defecto...');
      empresa = new Empresa({ esUnico: true });
      await empresa.save();
      console.log('✅ Documento de empresa creado');
    }

    // Migrar campo legado telefono -> telefonos si es necesario
    if (empresa.telefono && !empresa.telefonos) {
      empresa.telefonos = empresa.telefono;
      empresa.telefono = undefined;
      await empresa.save();
    }
    
    res.json({
      success: true,
      empresa
    });
  } catch (error) {
    console.error('Error al obtener información de la empresa:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener información de la empresa: ' + error.message
    });
  }
};

// Actualizar información de la empresa (solo administrador)
const actualizarEmpresa = async (req, res) => {
  try {
    console.log('=== ACTUALIZAR INFORMACIÓN DE LA EMPRESA ===');
    console.log('Datos recibidos:', req.body);
    
    // Verificar que el usuario es administrador
    if (req.usuario?.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permisos para actualizar la información de la empresa'
      });
    }
    
    const {
      nombreEmpresa,
      direccion,
      telefonos,
      telefono,
      correo,
      paginaWeb,
      derechosReservados
    } = req.body;

    const telefonosFinal = Array.isArray(telefonos) ? telefonos : telefono;
    
    // Validaciones básicas
    if (!nombreEmpresa || !direccion || !telefonosFinal || !correo) {
      return res.status(400).json({
        success: false,
        mensaje: 'Los campos nombreEmpresa, direccion, telefonos y correo son requeridos'
      });
    }
    
    // Verificar que telefono es un array
    if (!Array.isArray(telefonosFinal)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El campo telefonos debe ser un array'
      });
    }
    
    // Actualizar o crear el documento
    const empresa = await Empresa.findOneAndUpdate(
      { esUnico: true },
      {
        nombreEmpresa,
        direccion,
        telefonos: telefonosFinal,
        correo,
        paginaWeb,
        derechosReservados,
        esUnico: true
      },
      { 
        new: true,
        upsert: true // Crear si no existe
      }
    );
    
    console.log('✅ Información de la empresa actualizada');
    res.json({
      success: true,
      mensaje: 'Información de la empresa actualizada correctamente',
      empresa
    });
  } catch (error) {
    console.error('Error al actualizar información de la empresa:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar información de la empresa: ' + error.message
    });
  }
};

module.exports = {
  obtenerEmpresa,
  actualizarEmpresa
};
