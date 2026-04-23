// services/AlertService.js
// Patrón: Observer — los suscriptores reaccionan a eventos del inventario

const nodemailer = require('nodemailer');

class AlertService {
  constructor() {
    this.subscribers = {}; // { evento: [handler1, handler2, ...] }
  }

  // Suscribir un handler a un tipo de evento
  subscribe(evento, handler) {
    if (!this.subscribers[evento]) {
      this.subscribers[evento] = [];
    }
    this.subscribers[evento].push(handler);
  }

  // Notificar a todos los suscriptores del evento
  async notify(evento, data) {
    const handlers = this.subscribers[evento] || [];
    await Promise.all(handlers.map(handler => handler(data)));
  }
}

// Instancia singleton
const alertService = new AlertService();

// Suscriptor: enviar correo al administrador
alertService.subscribe('LOW_STOCK', async (productos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const lista = productos
    .map(p => `- ${p.nombre} (SKU: ${p.sku}): ${p.stock} uds (mínimo: ${p.stock_minimo})`)
    .join('\n');

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `⚠️ Alerta de stock bajo — ${productos.length} producto(s)`,
    text: `Los siguientes productos están por debajo del stock mínimo:\n\n${lista}`
  });
});

module.exports = alertService;
