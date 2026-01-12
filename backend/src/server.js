// src/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" Conectado a MongoDB"))
  .catch(err => console.error(" Error de conexión:", err));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando 🚀' });
});

// Importar rutas de autenticación
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Importar rutas de clientes
const clientesRouter = require('./routes/clientes');
app.use('/api/clientes', clientesRouter);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});