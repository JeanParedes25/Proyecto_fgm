const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  obtenerObituarios,
  obtenerObituarioPorId,
  crearObituario,
  actualizarObituario,
  eliminarObituario,
  obtenerObituariosRecientes
} = require('../controllers/obituarioController');

// Configurar Multer aquí en las rutas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/obituarios');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'obituario-' + uniqueSuffix + ext);
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Manejo de errores de Multer
const handleUpload = (req, res, next) => {
  upload.single('imagen')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, mensaje: 'Error al subir imagen: ' + err.message });
    } else if (err) {
      return res.status(400).json({ success: false, mensaje: err.message });
    }
    next();
  });
};

// Rutas públicas (GET)
router.get('/', obtenerObituarios);
router.get('/recientes', obtenerObituariosRecientes);
router.get('/:id', obtenerObituarioPorId);

// Rutas para crear/actualizar/eliminar
router.post('/', handleUpload, crearObituario);
router.put('/:id', handleUpload, actualizarObituario);
router.delete('/:id', eliminarObituario);

module.exports = router;
