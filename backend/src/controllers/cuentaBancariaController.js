const CuentaBancaria = require('../models/cuentaBancaria');

// Obtener todas las cuentas bancarias
const obtenerCuentas = async (req, res) => {
  try {
    const cuentas = await CuentaBancaria.find({ activa: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      mensaje: 'Cuentas obtenidas exitosamente',
      cuentas
    });
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las cuentas',
      error: error.message
    });
  }
};

// Crear nueva cuenta bancaria (admin)
const crearCuenta = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    const { banco, numeroCuenta, tipoCuenta, nombreTitular } = req.body;

    if (!banco || !numeroCuenta || !tipoCuenta || !nombreTitular) {
      console.log('Campos faltantes:', { banco, numeroCuenta, tipoCuenta, nombreTitular });
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos requeridos: banco, numeroCuenta, tipoCuenta, nombreTitular'
      });
    }

    // Verificar si la cuenta ya existe
    const existente = await CuentaBancaria.findOne({ numeroCuenta });
    if (existente) {
      console.log('Cuenta ya existe:', numeroCuenta);
      return res.status(400).json({
        success: false,
        mensaje: 'El número de cuenta ya existe'
      });
    }

    const nuevaCuenta = new CuentaBancaria({
      banco,
      numeroCuenta,
      tipoCuenta,
      nombreTitular,
      activa: true
    });

    console.log('Guardando cuenta:', nuevaCuenta);
    const cuentaGuardada = await nuevaCuenta.save();
    console.log('Cuenta guardada exitosamente:', cuentaGuardada);

    res.status(201).json({
      success: true,
      mensaje: 'Cuenta creada exitosamente',
      cuenta: cuentaGuardada
    });
  } catch (error) {
    console.error('Error completo al crear cuenta:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear la cuenta: ' + error.message,
      error: error.message
    });
  }
};

// Actualizar cuenta bancaria (admin)
const actualizarCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { banco, numeroCuenta, tipoCuenta, nombreTitular } = req.body;

    const cuenta = await CuentaBancaria.findById(id);
    if (!cuenta) {
      return res.status(404).json({
        success: false,
        mensaje: 'Cuenta no encontrada'
      });
    }

    if (numeroCuenta && numeroCuenta !== cuenta.numeroCuenta) {
      const existente = await CuentaBancaria.findOne({ numeroCuenta });
      if (existente) {
        return res.status(400).json({
          success: false,
          mensaje: 'El número de cuenta ya existe'
        });
      }
    }

    if (banco) cuenta.banco = banco;
    if (numeroCuenta) cuenta.numeroCuenta = numeroCuenta;
    if (tipoCuenta) cuenta.tipoCuenta = tipoCuenta;
    if (nombreTitular) cuenta.nombreTitular = nombreTitular;
    cuenta.updatedAt = Date.now();

    await cuenta.save();

    res.json({
      success: true,
      mensaje: 'Cuenta actualizada exitosamente',
      cuenta
    });
  } catch (error) {
    console.error('Error al actualizar cuenta:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar la cuenta',
      error: error.message
    });
  }
};

// Desactivar cuenta bancaria (admin)
const desactivarCuenta = async (req, res) => {
  try {
    const { id } = req.params;

    const cuenta = await CuentaBancaria.findByIdAndUpdate(
      id,
      { activa: false },
      { new: true }
    );

    if (!cuenta) {
      return res.status(404).json({
        success: false,
        mensaje: 'Cuenta no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Cuenta desactivada exitosamente',
      cuenta
    });
  } catch (error) {
    console.error('Error al desactivar cuenta:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al desactivar la cuenta',
      error: error.message
    });
  }
};

// Obtener todas las cuentas incluyendo inactivas (admin)
const obtenerTodasCuentas = async (req, res) => {
  try {
    const cuentas = await CuentaBancaria.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      mensaje: 'Cuentas obtenidas exitosamente',
      cuentas
    });
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener las cuentas',
      error: error.message
    });
  }
};

module.exports = {
  obtenerCuentas,
  crearCuenta,
  actualizarCuenta,
  desactivarCuenta,
  obtenerTodasCuentas
};
