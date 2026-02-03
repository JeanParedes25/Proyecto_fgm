const Configuracion = require('../models/configuracion');

// Obtener configuración del sistema
const obtenerConfiguracion = async (req, res) => {
  try {
    console.log('=== OBTENER CONFIGURACIÓN ===');
    let config = await Configuracion.findOne({ esUnico: true });
    
    // Si no existe configuración, crear una por defecto
    if (!config) {
      config = new Configuracion({
        esUnico: true
      });
      await config.save();
      console.log('✅ Configuración inicial creada');
    }
    
    console.log('Configuración obtenida:', config);
    res.json({
      success: true,
      configuracion: config
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener configuración: ' + error.message
    });
  }
};

// Actualizar configuración del sistema
const actualizarConfiguracion = async (req, res) => {
  try {
    console.log('=== ACTUALIZAR CONFIGURACIÓN ===');
    console.log('Datos recibidos:', req.body);
    
    const {
      nombreEmpresa,
      telefono1,
      telefono2,
      telefonoOficina,
      email,
      direccion
    } = req.body;

    await Configuracion.updateOne(
      { esUnico: true },
      {
        $set: {
          nombreEmpresa,
          telefono1,
          telefono2,
          telefonoOficina,
          email,
          direccion,
          esUnico: true
        },
        $unset: {
          permitirRegistro: "",
          modoMantenimiento: "",
          emailsConfirmacion: "",
          notificacionesPush: ""
        }
      },
      { upsert: true }
    );

    const config = await Configuracion.findOne({ esUnico: true });

    console.log('✅ Configuración actualizada (empresa)');

    res.json({
      success: true,
      mensaje: 'Configuración actualizada exitosamente',
      configuracion: config
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar configuración: ' + error.message
    });
  }
};

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion
};
