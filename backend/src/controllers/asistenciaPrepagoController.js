const AsistenciaPrepago = require('../models/asistenciaPrepago');

// Obtener todos los planes de asistencia prepago activos (para usuarios)
exports.obtenerPlanesActivos = async (req, res) => {
  try {
    const planes = await AsistenciaPrepago.find({ activo: true }).sort({ destacado: -1, precio: 1 });
    res.json(planes);
  } catch (error) {
    console.error('Error al obtener planes de asistencia prepago:', error);
    res.status(500).json({ mensaje: 'Error al obtener los planes de asistencia prepago' });
  }
};

// Obtener todos los planes (incluidos inactivos) - Solo admin
exports.obtenerTodosPlanes = async (req, res) => {
  try {
    const planes = await AsistenciaPrepago.find().sort({ createdAt: -1 });
    res.json(planes);
  } catch (error) {
    console.error('Error al obtener todos los planes de asistencia prepago:', error);
    res.status(500).json({ mensaje: 'Error al obtener los planes' });
  }
};

// Obtener un plan por ID
exports.obtenerPlanPorId = async (req, res) => {
  try {
    const plan = await AsistenciaPrepago.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error al obtener el plan:', error);
    res.status(500).json({ mensaje: 'Error al obtener el plan' });
  }
};

// Crear nuevo plan
exports.crearPlan = async (req, res) => {
  try {
    console.log('\n=== CREAR PLAN ASISTENCIA PREPAGO ===');
    console.log('Datos recibidos (req.body):', JSON.stringify(req.body, null, 2));
    
    // Validar y convertir tipos de datos
    const datosValidados = {
      ...req.body,
      precio: req.body.precio ? Number(req.body.precio) : undefined
    };

    if (req.body.obituariosDomiciliarios && req.body.obituariosDomiciliarios.cantidad) {
      datosValidados.obituariosDomiciliarios = {
        ...req.body.obituariosDomiciliarios,
        cantidad: parseInt(req.body.obituariosDomiciliarios.cantidad) || 0
      };
    }

    console.log('Datos validados:', JSON.stringify(datosValidados, null, 2));

    const nuevoPlan = new AsistenciaPrepago(datosValidados);
    const planGuardado = await nuevoPlan.save();
    
    console.log('Plan guardado exitosamente:', planGuardado._id);
    res.status(201).json(planGuardado);
  } catch (error) {
    console.error('Error al crear plan de asistencia prepago:', error);
    res.status(500).json({ 
      mensaje: 'Error al crear el plan',
      error: error.message 
    });
  }
};

// Actualizar plan
exports.actualizarPlan = async (req, res) => {
  try {
    console.log('\n=== ACTUALIZAR PLAN ASISTENCIA PREPAGO ===');
    console.log('ID:', req.params.id);
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    // Validar y convertir tipos de datos
    const datosValidados = {
      ...req.body,
      precio: req.body.precio ? Number(req.body.precio) : undefined
    };

    if (req.body.obituariosDomiciliarios && req.body.obituariosDomiciliarios.cantidad) {
      datosValidados.obituariosDomiciliarios = {
        ...req.body.obituariosDomiciliarios,
        cantidad: parseInt(req.body.obituariosDomiciliarios.cantidad) || 0
      };
    }

    const planActualizado = await AsistenciaPrepago.findByIdAndUpdate(
      req.params.id,
      datosValidados,
      { new: true, runValidators: true }
    );
    
    if (!planActualizado) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    console.log('Plan actualizado exitosamente');
    res.json(planActualizado);
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar el plan',
      error: error.message 
    });
  }
};

// Eliminar plan
exports.eliminarPlan = async (req, res) => {
  try {
    const planEliminado = await AsistenciaPrepago.findByIdAndDelete(req.params.id);
    
    if (!planEliminado) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    res.json({ mensaje: 'Plan eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el plan' });
  }
};

// Toggle destacado
exports.toggleDestacado = async (req, res) => {
  try {
    const plan = await AsistenciaPrepago.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    plan.destacado = !plan.destacado;
    await plan.save();
    
    res.json(plan);
  } catch (error) {
    console.error('Error al cambiar destacado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el plan' });
  }
};
