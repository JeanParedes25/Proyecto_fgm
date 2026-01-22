const Plan = require('../models/plan');

// Obtener todos los planes
exports.obtenerPlanes = async (req, res) => {
  try {
    const planes = await Plan.find({ activo: true }).sort({ destacado: -1, precio: 1 });
    res.json(planes);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ mensaje: 'Error al obtener los planes' });
  }
};

// Obtener todos los planes (incluidos inactivos) - Solo admin
exports.obtenerTodosPlanes = async (req, res) => {
  try {
    const planes = await Plan.find().sort({ createdAt: -1 });
    res.json(planes);
  } catch (error) {
    console.error('Error al obtener todos los planes:', error);
    res.status(500).json({ mensaje: 'Error al obtener los planes' });
  }
};

// Obtener un plan por ID
exports.obtenerPlanPorId = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
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
    const nuevoPlan = new Plan(req.body);
    const planGuardado = await nuevoPlan.save();
    res.status(201).json(planGuardado);
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ mensaje: 'Error al crear el plan', error: error.message });
  }
};

// Actualizar plan
exports.actualizarPlan = async (req, res) => {
  try {
    const planActualizado = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!planActualizado) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    res.json(planActualizado);
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el plan', error: error.message });
  }
};

// Eliminar plan (soft delete)
exports.eliminarPlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    res.json({ mensaje: 'Plan eliminado correctamente', plan });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el plan' });
  }
};

// Eliminar plan permanentemente
exports.eliminarPlanPermanente = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    res.json({ mensaje: 'Plan eliminado permanentemente' });
  } catch (error) {
    console.error('Error al eliminar plan permanentemente:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el plan' });
  }
};

// Destacar/quitar destacado de un plan
exports.toggleDestacado = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    plan.destacado = !plan.destacado;
    await plan.save();
    
    res.json(plan);
  } catch (error) {
    console.error('Error al cambiar destacado:', error);
    res.status(500).json({ mensaje: 'Error al cambiar el estado destacado' });
  }
};
