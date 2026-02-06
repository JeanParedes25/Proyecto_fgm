const Plan = require('../models/plan');
const { registrarEvento } = require('./auditController');

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
    console.log('\n=== CREAR PLAN ===');
    console.log('Datos recibidos (req.body):', JSON.stringify(req.body, null, 2));
    
    // Validar y convertir tipos de datos
    const datosValidados = {
      ...req.body,
      precio: Number(req.body.precio),
      salasIncluidas: Array.isArray(req.body.salasIncluidas) ? req.body.salasIncluidas : [],
      activo: req.body.activo !== undefined ? req.body.activo : true,
      destacado: req.body.destacado !== undefined ? req.body.destacado : false
    };

    console.log('Datos validados:', JSON.stringify(datosValidados, null, 2));

    const nuevoPlan = new Plan(datosValidados);
    const planGuardado = await nuevoPlan.save();
    console.log('Plan guardado exitosamente:', planGuardado._id);

    await registrarEvento({
      usuarioId: req.usuario?.id || null,
      nombreUsuario: req.usuario?.nombre || 'Sistema',
      rol: req.usuario?.rol || 'admin',
      accion: 'CREATE',
      modulo: 'Planes',
      descripcion: `Creación de plan funerario ${planGuardado.nombre || planGuardado._id}`,
      ip: req.ip || null
    });

    res.status(201).json(planGuardado);
  } catch (error) {
    console.error('❌ Error al crear plan:', error);
    res.status(400).json({ 
      mensaje: 'Error al crear el plan', 
      error: error.message,
      detalles: error.errors ? Object.keys(error.errors).map(k => `${k}: ${error.errors[k].message}`) : []
    });
  }
};

// Actualizar plan
exports.actualizarPlan = async (req, res) => {
  try {
    console.log('\n=== ACTUALIZAR PLAN ===');
    console.log('ID del plan:', req.params.id);
    console.log('Datos recibidos (req.body):', JSON.stringify(req.body, null, 2));
    
    // Validar y convertir tipos de datos, omitiendo undefined
    const datosValidados = {};
    
    // Copiar todos los campos excepto los que necesitan validación especial
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
        datosValidados[key] = req.body[key];
      }
    });
    
    // Procesar campos específicos
    if (req.body.precio !== undefined) {
      // Convertir a null si está vacío, es "0" o es 0
      const precioValue = req.body.precio === '' || req.body.precio === '0' || Number(req.body.precio) === 0 
        ? null 
        : Number(req.body.precio);
      datosValidados.precio = precioValue;
    }
    
    if (req.body.salasIncluidas !== undefined) {
      datosValidados.salasIncluidas = Array.isArray(req.body.salasIncluidas) ? req.body.salasIncluidas : [];
    }
    
    if (req.body.activo !== undefined) {
      datosValidados.activo = req.body.activo;
    }
    
    if (req.body.destacado !== undefined) {
      datosValidados.destacado = req.body.destacado;
    }

    console.log('Datos validados:', JSON.stringify(datosValidados, null, 2));

    const planActualizado = await Plan.findByIdAndUpdate(
      req.params.id,
      datosValidados,
      { new: true, runValidators: true }
    );
    
    if (!planActualizado) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
    
    console.log('✅ Plan actualizado exitosamente:', planActualizado._id);

    await registrarEvento({
      usuarioId: req.usuario?.id || null,
      nombreUsuario: req.usuario?.nombre || 'Sistema',
      rol: req.usuario?.rol || 'admin',
      accion: 'UPDATE',
      modulo: 'Planes',
      descripcion: `Edición de plan funerario ${planActualizado.nombre || planActualizado._id}`,
      ip: req.ip || null
    });

    res.json(planActualizado);
  } catch (error) {
    console.error('❌ Error al actualizar plan:', error);
    console.error('Error details:', error.message);
    console.error('Validation errors:', error.errors);
    res.status(400).json({ 
      mensaje: 'Error al actualizar el plan', 
      error: error.message,
      detalles: error.errors ? Object.keys(error.errors).map(k => `${k}: ${error.errors[k].message}`) : []
    });
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

    await registrarEvento({
      usuarioId: req.usuario?.id || null,
      nombreUsuario: req.usuario?.nombre || 'Sistema',
      rol: req.usuario?.rol || 'admin',
      accion: 'DELETE',
      modulo: 'Planes',
      descripcion: `Eliminación de plan funerario ${plan.nombre || plan._id}`,
      ip: req.ip || null
    });
    
    res.json({ mensaje: 'Plan eliminado correctamente', plan });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el plan', error: error.message });
  }
};

// Eliminar plan permanentemente
exports.eliminarPlanPermanente = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ mensaje: 'Plan no encontrado' });
    }

    await registrarEvento({
      usuarioId: req.usuario?.id || null,
      nombreUsuario: req.usuario?.nombre || 'Sistema',
      rol: req.usuario?.rol || 'admin',
      accion: 'DELETE',
      modulo: 'Planes',
      descripcion: `Eliminación permanente de plan funerario ${plan.nombre || plan._id}`,
      ip: req.ip || null
    });
    
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

    await registrarEvento({
      usuarioId: req.usuario?.id || null,
      nombreUsuario: req.usuario?.nombre || 'Sistema',
      rol: req.usuario?.rol || 'admin',
      accion: 'UPDATE',
      modulo: 'Planes',
      descripcion: `Cambio de destacado en plan funerario ${plan.nombre || plan._id}`,
      ip: req.ip || null
    });
    
    res.json(plan);
  } catch (error) {
    console.error('Error al cambiar destacado:', error);
    res.status(500).json({ mensaje: 'Error al cambiar el estado destacado' });
  }
};
