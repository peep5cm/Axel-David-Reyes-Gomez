# SGIT — Sistema de Inventario para Tienda

> Aplicación web para gestionar inventario, proveedores, movimientos de stock y reportes.  
> Stack: Node.js + Express · MySQL · HTML/CSS/JS

---

## Arquitectura: MVC (Model-View-Controller)

El sistema sigue el patrón **MVC**, separando las responsabilidades en tres capas principales:

```
Cliente (Navegador)
       ↕  HTTP Request / JSON Response
Controlador (Express Controllers)
       ↕  Llamada a métodos
Modelo (Business Logic + DB Access)
       ↕  SQL Queries
Base de Datos (MySQL)
```

### Estructura de carpetas

```
sgit/
├── app.js                  ← Punto de entrada
├── config/
│   └── db.js               ← Conexión a MySQL
├── controllers/
│   ├── ProductController.js
│   ├── AuthController.js
│   ├── MovementController.js
│   └── ReportController.js
├── models/
│   ├── ProductModel.js
│   ├── UserModel.js
│   ├── MovementModel.js
│   └── SupplierModel.js
├── middleware/
│   └── auth.js             ← JWT + autorización por rol
├── routes/
│   └── index.js
├── services/
│   ├── AlertService.js     ← Patrón Observer
│   └── ReportFactory.js    ← Patrón Factory
└── views/                  ← HTML + CSS + JS del frontend
```

---

## Patrones de Diseño Implementados

### 1. Repository Pattern (Modelos)

**Dónde:** `models/ProductModel.js`, `models/UserModel.js`, etc.

**Justificación:** Cada modelo encapsula toda la lógica de acceso a base de datos. Los controladores nunca escriben SQL directamente — solo llaman métodos del modelo. Esto hace el código más fácil de mantener y permite cambiar el motor de base de datos (de MySQL a PostgreSQL, por ejemplo) sin tocar los controladores.

```js
// ✅ Correcto: el controlador solo llama al modelo
const productos = await ProductModel.getAll({ categoria, busqueda });

// ❌ Incorrecto: SQL en el controlador
const [rows] = await db.execute('SELECT * FROM products WHERE...');
```

**Beneficio:** Separación de responsabilidades (SRP). Si cambia la estructura de la tabla `products`, solo se edita `ProductModel.js`.

---

### 2. Observer Pattern (Alertas de Stock)

**Dónde:** `services/AlertService.js`

**Justificación:** Cuando el stock de un producto cae al mínimo, múltiples acciones deben ocurrir: enviar correo, registrar en log, mostrar notificación en dashboard. En lugar de escribir todas esas acciones dentro del controlador (acoplando el código), el `AlertService` permite que cada acción sea un suscriptor independiente. Se pueden agregar nuevas reacciones sin modificar el código existente.

```js
// Suscribir handlers al evento
alertService.subscribe('LOW_STOCK', enviarCorreo);
alertService.subscribe('LOW_STOCK', registrarEnLog);
alertService.subscribe('LOW_STOCK', notificarDashboard);

// Disparar el evento — todos los handlers se ejecutan
await alertService.notify('LOW_STOCK', productosEnAlerta);
```

**Beneficio:** Principio Abierto/Cerrado (OCP) — abierto para extensión, cerrado para modificación.

---

### 3. Factory Pattern (Reportes)

**Dónde:** `services/ReportFactory.js`

**Justificación:** El sistema genera tres tipos de reportes (inventario actual, movimientos por período, stock bajo). Sin Factory, el controlador necesitaría un `if/else` largo para decidir qué lógica ejecutar. Con el patrón Factory, solo se llama `ReportFactory.create('inventario')` y la fábrica devuelve el objeto correcto.

```js
// Sin Factory (malo):
if (tipo === 'inventario') { /* 20 líneas de lógica */ }
else if (tipo === 'movimientos') { /* 20 líneas más */ }

// Con Factory (bueno):
const reporte = ReportFactory.create(tipo);
const resultado = await reporte.generate(params);
```

**Beneficio:** Fácil de extender. Para agregar un nuevo tipo de reporte (por ejemplo, `reporte_proveedor`), solo se crea una clase nueva y se agrega un `case` en el Factory.

---

### 4. Middleware Pattern (Autenticación y Autorización)

**Dónde:** `middleware/auth.js`

**Justificación:** En lugar de repetir la verificación del JWT en cada controlador, se usa un middleware de Express que intercepta la petición antes de llegar al controlador. El middleware encadena: `verificar token → decodificar usuario → verificar rol → pasar al controlador`.

```js
// Cadena de middleware en la ruta:
router.post('/productos', auth, authorize('admin'), ProductController.store);
//                        ↑        ↑
//              verifica JWT   verifica rol
```

**Beneficio:** DRY (Don't Repeat Yourself). La lógica de seguridad está en un solo lugar.

---

## Instalación y configuración

### Requisitos previos

- Node.js 18+
- MySQL 8+
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/sgit.git
cd sgit

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Crear la base de datos
mysql -u root -p < config/schema.sql

# 5. Iniciar el servidor
npm start
```

### Variables de entorno (`.env`)

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sgit
JWT_SECRET=tu_clave_secreta_muy_larga
JWT_EXPIRES_IN=30m
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=correo@gmail.com
SMTP_PASS=tu_app_password
ADMIN_EMAIL=admin@tienda.com
CLIENT_URL=http://localhost:5500
```

---

## API Endpoints

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/api/auth/login` | Público | Iniciar sesión |
| GET | `/api/productos` | Todos | Listar productos |
| POST | `/api/productos` | Admin | Crear producto |
| PUT | `/api/productos/:id` | Admin | Editar producto |
| DELETE | `/api/productos/:id` | Admin | Desactivar producto |
| POST | `/api/productos/:id/ajuste` | Admin | Ajuste de inventario |
| GET | `/api/productos/alertas/stock-bajo` | Admin, Gerente | Productos en alerta |
| GET | `/api/movimientos` | Todos | Ver movimientos |
| POST | `/api/movimientos/entrada` | Empleado, Admin | Registrar entrada |
| POST | `/api/movimientos/salida` | Empleado, Admin | Registrar salida |
| GET | `/api/reportes/:tipo` | Gerente, Admin | Generar reporte |

---

## Decisiones de diseño justificadas

| Decisión | Justificación |
|----------|---------------|
| **Node.js + Express** | Asíncrono por naturaleza, ideal para operaciones I/O frecuentes (BD, correo). JavaScript en frontend y backend reduce la curva de aprendizaje. |
| **MySQL** | Sistema de inventario con relaciones claras (producto↔categoría, movimiento↔producto↔usuario). Un modelo relacional es más apropiado que NoSQL. |
| **JWT sin sesiones en servidor** | Permite escalar horizontalmente (varios servidores) sin sincronizar sesiones. El token lleva el rol del usuario, reduciendo consultas a BD. |
| **Baja lógica (activo=0)** | Los registros eliminados mantienen integridad referencial en el historial de movimientos. Un producto "borrado" no rompe reportes históricos. |
| **Transacciones en ajustes** | El ajuste de stock modifica dos tablas (products y movements). Sin transacción, un fallo a mitad deja el inventario en estado inconsistente. |

---

## Requisitos no funcionales cubiertos

- **RNF-01 Rendimiento:** Rate limiting (100 req/min), índices en SKU y fecha, dashboard < 3s
- **RNF-02 Seguridad:** Helmet.js, JWT, bcrypt, validación de entradas, HTTPS
- **RNF-03 Disponibilidad:** Manejo de errores con try/catch, transacciones atómicas
- **RNF-04 Usabilidad:** API RESTful estándar, mensajes de error descriptivos
- **RNF-05 Mantenibilidad:** Arquitectura MVC, código documentado, estructura modular

---

## Autores

- Axel Gomez

## Licencia

MIT
