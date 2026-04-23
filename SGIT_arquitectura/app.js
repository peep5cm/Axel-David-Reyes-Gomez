// app.js — Punto de entrada del servidor

const express = require('express');
const helmet  = require('helmet');   // RNF-02: Seguridad HTTP headers
const cors    = require('cors');
const rateLimit = require('express-rate-limit'); // RNF-01: Rendimiento
require('dotenv').config();

const routes = require('./routes');

const app = express();

// Seguridad: headers HTTP seguros
app.use(helmet());

// Parseo de JSON
app.use(express.json());

// CORS
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Rate limiting: máximo 100 requests por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { ok: false, mensaje: 'Demasiadas solicitudes, intenta más tarde' }
});
app.use('/api', limiter);

// Rutas
app.use('/api', routes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor SGIT corriendo en puerto ${PORT}`);
});

module.exports = app;
