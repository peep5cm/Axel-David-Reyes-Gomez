// controllers/ProductController.js
// Patrón: CRUD Controller — maneja peticiones HTTP y delega al modelo

const ProductModel = require('../models/ProductModel');
const AlertService  = require('../services/AlertService'); // Patrón Observer

class ProductController {

  // GET /api/productos
  static async index(req, res) {
    try {
      const { categoria, busqueda } = req.query;
      const productos = await ProductModel.getAll({ categoria, busqueda });
      res.json({ ok: true, data: productos });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: 'Error al obtener productos' });
    }
  }

  // GET /api/productos/:id
  static async show(req, res) {
    try {
      const producto = await ProductModel.getById(req.params.id);
      if (!producto) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
      res.json({ ok: true, data: producto });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: 'Error al obtener producto' });
    }
  }

  // POST /api/productos
  static async store(req, res) {
    try {
      const { nombre, sku, categoria_id, precio, stock, stock_minimo } = req.body;

      if (!nombre || !sku || stock === undefined) {
        return res.status(400).json({ ok: false, mensaje: 'Campos requeridos: nombre, sku, stock' });
      }

      const id = await ProductModel.create({ nombre, sku, categoria_id, precio, stock, stock_minimo });
      res.status(201).json({ ok: true, id, mensaje: 'Producto creado exitosamente' });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ ok: false, mensaje: 'El SKU ya existe' });
      }
      res.status(500).json({ ok: false, mensaje: 'Error al crear producto' });
    }
  }

  // PUT /api/productos/:id
  static async update(req, res) {
    try {
      const actualizado = await ProductModel.update(req.params.id, req.body);
      if (!actualizado) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
      res.json({ ok: true, mensaje: 'Producto actualizado' });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: 'Error al actualizar producto' });
    }
  }

  // DELETE /api/productos/:id  (baja lógica)
  static async destroy(req, res) {
    try {
      const desactivado = await ProductModel.deactivate(req.params.id);
      if (!desactivado) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
      res.json({ ok: true, mensaje: 'Producto desactivado' });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: 'Error al desactivar producto' });
    }
  }

  // GET /api/productos/alertas/stock-bajo
  static async lowStock(req, res) {
    try {
      const productos = await ProductModel.getLowStock();
      // Patrón Observer: notifica a los suscriptores de la alerta
      if (productos.length > 0) {
        await AlertService.notify('LOW_STOCK', productos);
      }
      res.json({ ok: true, data: productos, total: productos.length });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: 'Error al verificar stock' });
    }
  }

  // POST /api/productos/:id/ajuste
  static async adjustStock(req, res) {
    try {
      const { cantidad_real, observacion } = req.body;
      if (cantidad_real === undefined || !observacion) {
        return res.status(400).json({ ok: false, mensaje: 'Se requiere cantidad_real y observacion' });
      }
      await ProductModel.adjustStock(req.params.id, cantidad_real, req.user.id, observacion);
      res.json({ ok: true, mensaje: 'Ajuste de inventario registrado' });
    } catch (err) {
      res.status(500).json({ ok: false, mensaje: 'Error al ajustar inventario' });
    }
  }
}

module.exports = ProductController;
