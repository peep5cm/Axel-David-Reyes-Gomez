// routes/index.js
const express = require('express');
const router  = express.Router();

const ProductController = require('../controllers/ProductController');
const { auth, authorize } = require('../middleware/auth');

// Rutas de productos
router.get   ('/productos',                auth,                         ProductController.index);
router.get   ('/productos/alertas/stock-bajo', auth, authorize('admin', 'gerente'), ProductController.lowStock);
router.get   ('/productos/:id',            auth,                         ProductController.show);
router.post  ('/productos',                auth, authorize('admin'),     ProductController.store);
router.put   ('/productos/:id',            auth, authorize('admin'),     ProductController.update);
router.delete('/productos/:id',            auth, authorize('admin'),     ProductController.destroy);
router.post  ('/productos/:id/ajuste',     auth, authorize('admin'),     ProductController.adjustStock);

module.exports = router;
