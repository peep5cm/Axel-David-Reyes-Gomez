// models/ProductModel.js
// Patrón: Repository — abstrae el acceso a la base de datos

const db = require('../config/db');

class ProductModel {

  // Obtener todos los productos activos
  static async getAll({ categoria, busqueda } = {}) {
    let query = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      WHERE p.activo = 1
    `;
    const params = [];

    if (categoria) {
      query += ' AND p.categoria_id = ?';
      params.push(categoria);
    }
    if (busqueda) {
      query += ' AND (p.nombre LIKE ? OR p.sku LIKE ?)';
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Obtener producto por ID
  static async getById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE id = ? AND activo = 1',
      [id]
    );
    return rows[0] || null;
  }

  // Crear producto
  static async create({ nombre, sku, categoria_id, precio, stock, stock_minimo }) {
    const [result] = await db.execute(
      `INSERT INTO products (nombre, sku, categoria_id, precio, stock, stock_minimo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, sku, categoria_id, precio, stock, stock_minimo]
    );
    return result.insertId;
  }

  // Actualizar producto (no modifica SKU)
  static async update(id, { nombre, categoria_id, precio, stock_minimo }) {
    const [result] = await db.execute(
      `UPDATE products SET nombre=?, categoria_id=?, precio=?, stock_minimo=?
       WHERE id = ? AND activo = 1`,
      [nombre, categoria_id, precio, stock_minimo, id]
    );
    return result.affectedRows > 0;
  }

  // Baja lógica
  static async deactivate(id) {
    const [result] = await db.execute(
      'UPDATE products SET activo = 0 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Productos con stock bajo el mínimo (Patrón Observer: trigger de alertas)
  static async getLowStock() {
    const [rows] = await db.execute(
      `SELECT id, nombre, sku, stock, stock_minimo
       FROM products
       WHERE activo = 1 AND stock <= stock_minimo`
    );
    return rows;
  }

  // Ajuste manual de inventario
  static async adjustStock(id, cantidadReal, usuarioId, observacion) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [[producto]] = await conn.execute(
        'SELECT stock FROM products WHERE id = ?', [id]
      );
      const diferencia = cantidadReal - producto.stock;

      await conn.execute(
        'UPDATE products SET stock = ? WHERE id = ?',
        [cantidadReal, id]
      );

      await conn.execute(
        `INSERT INTO movements (product_id, tipo, cantidad, usuario_id, observacion)
         VALUES (?, 'ajuste', ?, ?, ?)`,
        [id, diferencia, usuarioId, observacion]
      );

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

module.exports = ProductModel;
