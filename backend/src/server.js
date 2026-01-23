// src/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes de obituarios)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/proyecto_fgm')
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    
    // Ejecutar seeding de datos temporales
    const seedearClientes = require('./scripts/seedClientes');
    seedearClientes();
  })
  .catch(err => console.error("❌ Error de conexión:", err));

// Inicializar colección de obituarios en MongoDB
const Obituario = require('./models/obituario');
Obituario.crearTabla()
  .then(() => console.log("✅ Colección de obituarios lista en MongoDB"))
  .catch(err => console.error("❌ Error al inicializar colección de obituarios:", err));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando 🚀' });
});

// Ruta de prueba POST para validar JSON
app.post('/api/test-post', (req, res) => {
  console.log('\n=== TEST POST ===');
  console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
  res.json({ 
    message: 'POST funcionando ✅',
    datosRecibidos: req.body
  });
});

// Importar rutas de autenticación
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Importar rutas de clientes
const clientesRouter = require('./routes/clientes');
app.use('/api/clientes', clientesRouter);

// Importar rutas de obituarios
const obituariosRouter = require('./routes/obituarios');
app.use('/api/obituarios', obituariosRouter);

// Importar rutas de estadísticas
const estadisticasRouter = require('./routes/estadisticas');
app.use('/api/estadisticas', estadisticasRouter);

// Importar rutas de auditoría
const auditRouter = require('./routes/audit');
app.use('/api/audit', auditRouter);

// Importar rutas de servicios
const serviciosRouter = require('./routes/servicios');
app.use('/api/servicios', serviciosRouter);

// Importar rutas de floristerias
const floristeriasRouter = require('./routes/floristerias');
app.use('/api/floristerias', floristeriasRouter);

// Importar rutas de pedidos de floristerías
const pedidosFloristeriasRouter = require('./routes/pedidosFloristerias');
app.use('/api/pedidos-floristerias', pedidosFloristeriasRouter);

// Importar rutas de notificaciones de floristerías
const notificacionesFloristeriasRouter = require('./routes/notificacionesFloristerias');
app.use('/api/notificaciones-floristerias', notificacionesFloristeriasRouter);

// Importar rutas de cuentas bancarias
const cuentasBancariasRouter = require('./routes/cuentasBancarias');
app.use('/api/cuentas-bancarias', cuentasBancariasRouter);

// Importar rutas de planes
const planesRouter = require('./routes/planes');
app.use('/api/planes', planesRouter);

// Importar rutas de seguros
const segurosRouter = require('./routes/seguros');
app.use('/api/seguros', segurosRouter);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});