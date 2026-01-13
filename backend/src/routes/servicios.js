const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const servicioController = require('../controllers/servicioController');
const auth = require('../middleware/auth');

// Configurar Multer para fotos de servicios
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/servicios');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'servicio-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Manejo de errores de Multer
const handleUpload = (req, res, next) => {
  upload.array('fotos[]', 4)(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, mensaje: 'Error al subir imágenes: ' + err.message });
    } else if (err) {
      return res.status(400).json({ success: false, mensaje: err.message });
    }
    next();
  });
};

// Rutas públicas
router.get('/', servicioController.obtenerServicios);
router.get('/:id', servicioController.obtenerServicioPorId);

// Rutas protegidas (solo admin)
router.post('/', auth, handleUpload, servicioController.crearServicio);
router.put('/:id', auth, handleUpload, servicioController.actualizarServicio);
router.delete('/:id', auth, servicioController.eliminarServicio);

module.exports = router;
