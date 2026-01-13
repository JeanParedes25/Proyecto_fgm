const Servicio = require('../models/servicio');

// Obtener todos los servicios
const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find({ activo: true }).sort({ createdAt: 1 });
    
    res.json({
      success: true,
      mensaje: 'Servicios obtenidos exitosamente',
      servicios: servicios
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los servicios',
      error: error.message
    });
  }
};

// Obtener servicio por ID
const obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findById(id);
    
    if (!servicio) {
      return res.status(404).json({
        success: false,
        mensaje: 'Servicio no encontrado'
      });
    }
    
    res.json({
      success: true,
      mensaje: 'Servicio obtenido exitosamente',
      servicio: servicio
    });
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el servicio',
      error: error.message
    });
  }
};

// Crear nuevo servicio
const crearServicio = async (req, res) => {
  try {
    const {
      nombre,
      nombrePlan,
      icono,
      color,
      descripcion,
      descripcionPlan,
      introduccion,
      cantidadSalas,
      precio,
      includes,
      additional,
      noChargeServices,
      extraServices,
      brindamos,
      halls,
      capacity,
      misaEnVivo
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !icono || !color || !introduccion || !precio) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos requeridos: nombre, icono, color, introduccion, precio'
      });
    }

    // Verificar que no exista un servicio con el mismo nombre
    const servicioExistente = await Servicio.findOne({ nombre });
    if (servicioExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya existe un servicio con ese nombre'
      });
    }

    // Procesar fotos
    const fotos = [];
    const ataudes = [];
    
    // Separar archivos de fotos y ataúdes
    if (req.files && req.files.length > 0) {
      let fotoIndex = 0;
      let ataudIndex = 0;

      req.files.forEach((file) => {
        // Verificar si es foto normal
        const fotoDesc = req.body[`fotoMeta[${fotoIndex}][descripcion]`];
        
        if (fotoDesc !== undefined) {
          // Es una foto normal
          fotos.push({
            url: '/uploads/servicios/' + file.filename,
            descripcion: fotoDesc
          });
          fotoIndex++;
        } else {
          // Es un ataúd
          const ataudNombre = req.body[`ataudMeta[${ataudIndex}][nombre]`];
          if (ataudNombre !== undefined) {
            const ataudDesc = req.body[`ataudMeta[${ataudIndex}][descripcion]`] || '';
            const ataudPrecio = parseFloat(req.body[`ataudMeta[${ataudIndex}][precio]`]) || 0;
            ataudes.push({
              nombre: ataudNombre,
              imagen: '/uploads/servicios/' + file.filename,
              descripcion: ataudDesc,
              precio: ataudPrecio
            });
            ataudIndex++;
          }
        }
      });
    }

    const nuevoServicio = new Servicio({
      nombre,
      nombrePlan,
      icono,
      color,
      descripcion,
      descripcionPlan,
      introduccion,
      cantidadSalas: cantidadSalas || 0,
      precio: parseFloat(precio) || 0,
      includes: includes ? JSON.parse(includes) : [],
      additional: additional ? JSON.parse(additional) : [],
      noChargeServices: noChargeServices ? JSON.parse(noChargeServices) : [],
      extraServices: extraServices ? JSON.parse(extraServices) : [],
      brindamos: brindamos ? JSON.parse(brindamos) : [],
      fotos: fotos,
      ataudes: ataudes,
      halls: halls ? JSON.parse(halls) : [],
      capacity,
      misaEnVivo: misaEnVivo ? JSON.parse(misaEnVivo) : { disponible: false, precio: 0 }
    });

    await nuevoServicio.save();

    res.status(201).json({
      success: true,
      mensaje: 'Servicio creado exitosamente',
      servicio: nuevoServicio
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear el servicio',
      error: error.message
    });
  }
};

// Actualizar servicio
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      nombrePlan,
      icono,
      color,
      descripcion,
      descripcionPlan,
      introduccion,
      cantidadSalas,
      precio,
      includes,
      additional,
      noChargeServices,
      extraServices,
      brindamos,
      halls,
      capacity,
      misaEnVivo,
      activo,
      fotosExistentes,
      ataudesExistentes
    } = req.body;

    // Verificar si el servicio existe
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({
        success: false,
        mensaje: 'Servicio no encontrado'
      });
    }

    // Actualizar campos
    if (nombre) {
      // Verificar que no exista otro servicio con el mismo nombre
      const servicioExistente = await Servicio.findOne({ 
        nombre: nombre,
        _id: { $ne: id }
      });
      if (servicioExistente) {
        return res.status(400).json({
          success: false,
          mensaje: 'Ya existe otro servicio con ese nombre'
        });
      }
      servicio.nombre = nombre;
    }

    if (icono) servicio.icono = icono;
    if (color) servicio.color = color;
    if (descripcion) servicio.descripcion = descripcion;
    if (descripcionPlan) servicio.descripcionPlan = descripcionPlan;
    if (nombrePlan) servicio.nombrePlan = nombrePlan;
    if (introduccion) servicio.introduccion = introduccion;
    if (cantidadSalas !== undefined) servicio.cantidadSalas = cantidadSalas;
    if (precio !== undefined) servicio.precio = parseFloat(precio) || 0;
    if (includes) servicio.includes = JSON.parse(includes);
    if (additional) servicio.additional = JSON.parse(additional);
    if (noChargeServices) servicio.noChargeServices = JSON.parse(noChargeServices);
    if (extraServices) servicio.extraServices = JSON.parse(extraServices);
    if (brindamos) servicio.brindamos = JSON.parse(brindamos);
    if (halls) servicio.halls = JSON.parse(halls);
    if (capacity) servicio.capacity = capacity;
    if (misaEnVivo) servicio.misaEnVivo = JSON.parse(misaEnVivo);
    if (activo !== undefined) servicio.activo = activo;

    // Procesar fotos y ataúdes
    let fotos = [];
    let ataudes = [];
    
    if (fotosExistentes) {
      fotos = JSON.parse(fotosExistentes);
    }
    if (ataudesExistentes) {
      ataudes = JSON.parse(ataudesExistentes);
    }

    // Agregar nuevas fotos y ataúdes
    if (req.files && req.files.length > 0) {
      let fotoIndex = 0;
      let ataudIndex = 0;

      req.files.forEach((file) => {
        const fotoDesc = req.body[`fotoMeta[${fotoIndex}][descripcion]`];
        
        if (fotoDesc !== undefined) {
          fotos.push({
            url: '/uploads/servicios/' + file.filename,
            descripcion: fotoDesc
          });
          fotoIndex++;
        } else {
          const ataudNombre = req.body[`ataudMeta[${ataudIndex}][nombre]`];
          if (ataudNombre !== undefined) {
            const ataudDesc = req.body[`ataudMeta[${ataudIndex}][descripcion]`] || '';
            const ataudPrecio = parseFloat(req.body[`ataudMeta[${ataudIndex}][precio]`]) || 0;
            ataudes.push({
              nombre: ataudNombre,
              imagen: '/uploads/servicios/' + file.filename,
              descripcion: ataudDesc,
              precio: ataudPrecio
            });
            ataudIndex++;
          }
        }
      });
    }

    if (fotos.length > 0) {
      servicio.fotos = fotos;
    }
    if (ataudes.length > 0) {
      servicio.ataudes = ataudes;
    }

    await servicio.save();

    res.json({
      success: true,
      mensaje: 'Servicio actualizado exitosamente',
      servicio: servicio
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar el servicio',
      error: error.message
    });
  }
};

// Eliminar servicio
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await Servicio.findByIdAndDelete(id);
    
    if (!servicio) {
      return res.status(404).json({
        success: false,
        mensaje: 'Servicio no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Servicio eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar el servicio',
      error: error.message
    });
  }
};

module.exports = {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio
};
