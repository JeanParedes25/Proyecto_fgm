// Script para probar la ruta de seguros directamente
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm')
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Importar rutas
const segurosRouter = require('../routes/seguros');
app.use('/api/seguros', segurosRouter);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ mensaje: 'Servidor de prueba funcionando' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba corriendo en http://localhost:${PORT}`);
  console.log(`📋 Prueba: http://localhost:${PORT}/api/seguros/exequial`);
  console.log(`📋 Prueba: http://localhost:${PORT}/test`);
});
