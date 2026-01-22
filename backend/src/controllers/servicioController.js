const Servicio = require('../models/servicio');

// Obtener todos los servicios
const obtenerServicios = async (req, res) => {
  try {
    const esAdmin = req.usuario?.rol === 'admin';
    const filtro = esAdmin ? {} : { activo: true };
    const servicios = await Servicio.find(filtro).sort({ createdAt: 1 });
    
    const serviciosConUrl = servicios.map(serv => {
      const obj = serv.toObject ? serv.toObject() : serv;
      if (obj.fotos && Array.isArray(obj.fotos)) {
        obj.fotos = obj.fotos.map(foto => ({
          ...foto,
          url: foto.url ? (foto.url.startsWith('http') ? foto.url : `http://localhost:5000${foto.url}`) : foto.url
        }));
      }
      return obj;
    });
    
    res.json({
      success: true,
      mensaje: 'Servicios obtenidos exitosamente',
      servicios: serviciosConUrl
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
    
    const obj = servicio.toObject ? servicio.toObject() : servicio;
    if (obj.fotos && Array.isArray(obj.fotos)) {
      obj.fotos = obj.fotos.map(foto => ({
        ...foto,
        url: foto.url ? (foto.url.startsWith('http') ? foto.url : `http://localhost:5000${foto.url}`) : foto.url
      }));
    }
    
    res.json({
      success: true,
      mensaje: 'Servicio obtenido exitosamente',
      servicio: obj
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
    const { nombre, descripcion, precio, activo } = req.body;

    if (!nombre) {
      return res.status(400).json({ success: false, mensaje: 'Falta el nombre del servicio' });
    }

    const existente = await Servicio.findOne({ nombre });
    if (existente) {
      return res.status(400).json({ success: false, mensaje: 'Ya existe un servicio con ese nombre' });
    }

    const fotos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const desc = req.body[`fotoMeta[${index}][descripcion]`] || '';
        fotos.push({ url: '/uploads/servicios/' + file.filename, descripcion: desc });
      });
    }

    const nuevoServicio = new Servicio({
      nombre,
      descripcion,
      precio: precio !== undefined && precio !== '' ? parseFloat(precio) || 0 : undefined,
      fotos,
      activo: activo !== undefined ? activo === 'true' || activo === true : true
    });

    await nuevoServicio.save();

    res.status(201).json({ success: true, mensaje: 'Servicio creado exitosamente', servicio: nuevoServicio });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ success: false, mensaje: 'Error al crear el servicio', error: error.message });
  }
};

// Actualizar servicio
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, activo, fotosExistentes } = req.body;

    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ success: false, mensaje: 'Servicio no encontrado' });
    }

    if (nombre) {
      const duplicado = await Servicio.findOne({ nombre, _id: { $ne: id } });
      if (duplicado) {
        return res.status(400).json({ success: false, mensaje: 'Ya existe otro servicio con ese nombre' });
      }
      servicio.nombre = nombre;
    }
    if (descripcion !== undefined) servicio.descripcion = descripcion;
    if (precio !== undefined && precio !== '') servicio.precio = parseFloat(precio) || 0;
    if (activo !== undefined) servicio.activo = activo === 'true' || activo === true;

    let fotos = [];
    if (fotosExistentes) {
      try { fotos = JSON.parse(fotosExistentes); } catch { fotos = []; }
    }
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const desc = req.body[`fotoMeta[${index}][descripcion]`] || '';
        fotos.push({ url: '/uploads/servicios/' + file.filename, descripcion: desc });
      });
    }
    servicio.fotos = fotos;

    await servicio.save();
    res.json({ success: true, mensaje: 'Servicio actualizado exitosamente', servicio });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ success: false, mensaje: 'Error al actualizar el servicio', error: error.message });
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
