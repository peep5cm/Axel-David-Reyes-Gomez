// middleware/auth.js
// Patrón: Middleware Chain — verifica JWT antes de ejecutar el controlador

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, nombre, rol }
    next();
  } catch (err) {
    return res.status(403).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
};

// Middleware de autorización por rol
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ ok: false, mensaje: 'Acceso no autorizado para tu rol' });
  }
  next();
};

module.exports = { auth, authorize };
