// services/ReportFactory.js
// Patrón: Factory — crea el tipo de reporte correcto según el parámetro

const db = require('../config/db');

// Interfaz base (implícita en JS)
class Report {
  async generate(params) {
    throw new Error('Método generate() debe implementarse');
  }
}

// Reporte de inventario actual
class InventoryReport extends Report {
  async generate({ fecha }) {
    const [rows] = await db.execute(`
      SELECT p.nombre, p.sku, c.nombre AS categoria,
             p.stock, p.precio, (p.stock * p.precio) AS valor_total
      FROM products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      WHERE p.activo = 1
      ORDER BY c.nombre, p.nombre
    `);
    return { tipo: 'inventario', fecha: fecha || new Date(), datos: rows };
  }
}

// Reporte de movimientos por período
class MovementsReport extends Report {
  async generate({ fechaInicio, fechaFin }) {
    const [rows] = await db.execute(`
      SELECT m.tipo, m.cantidad, m.fecha, m.observacion,
             p.nombre AS producto, p.sku,
             u.nombre AS usuario
      FROM movements m
      JOIN products p ON m.product_id = p.id
      JOIN users u ON m.usuario_id = u.id
      WHERE m.fecha BETWEEN ? AND ?
      ORDER BY m.fecha DESC
    `, [fechaInicio, fechaFin]);
    return { tipo: 'movimientos', fechaInicio, fechaFin, datos: rows };
  }
}

// Reporte de productos con stock bajo
class LowStockReport extends Report {
  async generate() {
    const [rows] = await db.execute(`
      SELECT nombre, sku, stock, stock_minimo,
             (stock_minimo - stock) AS unidades_faltantes
      FROM products
      WHERE activo = 1 AND stock <= stock_minimo
      ORDER BY unidades_faltantes DESC
    `);
    return { tipo: 'stock_bajo', datos: rows };
  }
}

// FACTORY: decide qué clase instanciar
class ReportFactory {
  static create(tipo) {
    switch (tipo) {
      case 'inventario':  return new InventoryReport();
      case 'movimientos': return new MovementsReport();
      case 'stock_bajo':  return new LowStockReport();
      default: throw new Error(`Tipo de reporte desconocido: ${tipo}`);
    }
  }
}

module.exports = ReportFactory;
