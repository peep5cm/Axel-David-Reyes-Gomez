# SRS – Sistema Inventario para Tienda

**Documento:** Especificación de Requisitos de Software (SRS)  
**Versión:** 1.0  
**Fecha:** 2026-04-23  
**Autor:** Axel Gomez  
**Asignatura:** Ingeniería de Software I

---

## 1. Introducción

### 1.1 Propósito

Este documento describe los requisitos funcionales y no funcionales del **Sistema de Gestión de Inventario para Tienda (SGIT)**, una aplicación web diseñada para administrar productos, entradas, salidas, proveedores y reportes de stock de una tienda comercial.

### 1.2 Alcance

El sistema permitirá a los administradores y empleados gestionar el inventario en tiempo real, generando alertas de stock bajo, registrando movimientos de mercancía y produciendo reportes gerenciales.

### 1.3 Definiciones y Acrónimos

| Término | Definición |
|---|---|
| SRS | Software Requirements Specification |
| SGIT | Sistema de Gestión de Inventario para Tienda |
| SKU | Stock Keeping Unit (código único de producto) |
| HU | Historia de Usuario |
| RNF | Requisito No Funcional |
| Stock | Cantidad disponible de un producto en bodega |

---

## 2. Descripción General del Sistema

### 2.1 Perspectiva del Producto

El SGIT es una aplicación web independiente, accesible desde navegadores modernos, que centraliza la gestión del inventario sustituyendo procesos manuales en hojas de cálculo o registros en papel.

### 2.2 Funciones Principales

- Gestión de productos y categorías
- Control de entradas y salidas de mercancía
- Gestión de proveedores
- Alertas automáticas de stock mínimo
- Generación de reportes e historial de movimientos

### 2.3 Roles de Usuario

| Rol | Descripción |
|---|---|
| Administrador | Acceso total al sistema |
| Empleado | Registro de movimientos y consulta |
| Gerente | Acceso a reportes y estadísticas |

---

## 3. Historias de Usuario

### HU-01 – Registro de nuevo usuario
**Como** administrador,  
**quiero** registrar nuevos usuarios en el sistema,  
**para que** puedan acceder con sus propias credenciales según su rol.

**Criterios de aceptación:**
- El sistema solicita nombre, correo, contraseña y rol.
- El correo debe ser único en el sistema.
- Se envía correo de bienvenida al usuario registrado.

---

### HU-02 – Inicio de sesión
**Como** usuario registrado,  
**quiero** iniciar sesión con correo y contraseña,  
**para** acceder a las funciones según mi rol.

**Criterios de aceptación:**
- Autenticación mediante credenciales válidas.
- Mensaje de error claro si las credenciales son incorrectas.
- Sesión con tiempo de expiración configurable.

---

### HU-03 – Registro de productos
**Como** administrador,  
**quiero** registrar nuevos productos con nombre, SKU, categoría, precio y stock inicial,  
**para** tener un catálogo actualizado de la tienda.

**Criterios de aceptación:**
- El SKU debe ser único y generarse automáticamente o ingresarse manualmente.
- Los campos nombre, SKU y stock inicial son obligatorios.
- El producto queda visible en el listado de inventario al guardar.

---

### HU-04 – Edición de productos
**Como** administrador,  
**quiero** editar la información de un producto existente,  
**para** mantener los datos actualizados ante cambios de precio o descripción.

**Criterios de aceptación:**
- Todos los campos del producto son editables excepto el SKU.
- Los cambios quedan registrados con fecha y usuario que los realizó.

---

### HU-05 – Eliminación lógica de productos
**Como** administrador,  
**quiero** desactivar productos que ya no se venden,  
**para** mantenerlos en historial sin que aparezcan en el inventario activo.

**Criterios de aceptación:**
- El producto se marca como "inactivo" en lugar de eliminarse de la base de datos.
- Los productos inactivos no aparecen en búsquedas por defecto, pero pueden consultarse con un filtro.

---

### HU-06 – Registro de entrada de mercancía
**Como** empleado,  
**quiero** registrar la entrada de productos al inventario,  
**para** actualizar el stock disponible tras recibir un pedido.

**Criterios de aceptación:**
- Se registra: producto, cantidad, proveedor, fecha y número de factura.
- El stock del producto aumenta automáticamente al confirmar.
- Se genera un comprobante de entrada descargable en PDF.

---

### HU-07 – Registro de salida de mercancía
**Como** empleado,  
**quiero** registrar la salida de productos del inventario,  
**para** reflejar ventas o consumos internos y mantener el stock real.

**Criterios de aceptación:**
- Se registra: producto, cantidad, motivo (venta, uso interno, merma) y fecha.
- El sistema impide registrar salidas mayores al stock disponible.
- El stock se descuenta automáticamente al confirmar.

---

### HU-08 – Búsqueda y filtrado de productos
**Como** empleado,  
**quiero** buscar productos por nombre, SKU o categoría,  
**para** encontrarlos rápidamente sin navegar por el listado completo.

**Criterios de aceptación:**
- Búsqueda en tiempo real al escribir en el campo de búsqueda.
- Filtros combinables por categoría, estado (activo/inactivo) y nivel de stock.

---

### HU-09 – Gestión de categorías
**Como** administrador,  
**quiero** crear, editar y eliminar categorías de productos,  
**para** organizar el inventario de forma lógica.

**Criterios de aceptación:**
- No se puede eliminar una categoría que tenga productos activos asignados.
- Las categorías son visibles al registrar o editar un producto.

---

### HU-10 – Gestión de proveedores
**Como** administrador,  
**quiero** registrar y mantener actualizada la información de proveedores,  
**para** asociarlos a las entradas de mercancía y facilitar el reabastecimiento.

**Criterios de aceptación:**
- Se registra: nombre, RUC/NIT, teléfono, correo y dirección.
- Un proveedor puede asociarse a múltiples productos.

---

### HU-11 – Alerta de stock mínimo
**Como** administrador,  
**quiero** definir un nivel mínimo de stock por producto y recibir alertas cuando se alcance,  
**para** reabastecer el inventario antes de quedarse sin existencias.

**Criterios de aceptación:**
- El stock mínimo se configura por producto.
- El sistema muestra un banner y envía correo cuando el stock cae al nivel mínimo.
- Los productos en alerta se resaltan en el listado con color diferenciado.

---

### HU-12 – Historial de movimientos
**Como** gerente,  
**quiero** ver el historial completo de entradas y salidas de un producto,  
**para** auditar los movimientos y detectar inconsistencias.

**Criterios de aceptación:**
- El historial muestra: fecha, tipo de movimiento, cantidad, usuario responsable y saldo resultante.
- Filtrable por rango de fechas y tipo de movimiento.

---

### HU-13 – Reporte de inventario actual
**Como** gerente,  
**quiero** generar un reporte del inventario actual con stock y valor total,  
**para** conocer el estado financiero del almacén.

**Criterios de aceptación:**
- El reporte incluye: producto, SKU, stock actual, precio unitario y valor total.
- Exportable en formato PDF y Excel.
- Refleja datos en tiempo real al momento de la generación.

---

### HU-14 – Reporte de movimientos por período
**Como** gerente,  
**quiero** generar reportes de entradas y salidas en un rango de fechas,  
**para** analizar la rotación del inventario.

**Criterios de aceptación:**
- El usuario selecciona fecha de inicio y fecha de fin.
- El reporte muestra totales agrupados por producto y por tipo de movimiento.
- Exportable en PDF y Excel.

---

### HU-15 – Dashboard con indicadores clave
**Como** gerente,  
**quiero** ver un tablero principal con indicadores clave (productos en alerta, movimientos recientes, valor del inventario),  
**para** tener una visión rápida del estado del almacén al iniciar sesión.

**Criterios de aceptación:**
- El dashboard carga en menos de 3 segundos.
- Muestra: total de productos, valor del inventario, número de alertas activas y últimos 5 movimientos.

---

### HU-16 – Gestión de roles y permisos
**Como** administrador,  
**quiero** asignar y modificar roles a los usuarios,  
**para** controlar qué acciones puede realizar cada persona en el sistema.

**Criterios de aceptación:**
- Los roles disponibles son: Administrador, Empleado y Gerente.
- Los menús y acciones visibles cambian según el rol asignado.
- Solo el administrador puede cambiar roles.

---

### HU-17 – Restablecimiento de contraseña
**Como** usuario,  
**quiero** restablecer mi contraseña si la olvido,  
**para** recuperar el acceso al sistema sin depender del administrador.

**Criterios de aceptación:**
- El usuario ingresa su correo y recibe un enlace de restablecimiento.
- El enlace expira en 30 minutos.
- La nueva contraseña debe cumplir con los criterios de seguridad del sistema.

---

### HU-18 – Carga masiva de productos
**Como** administrador,  
**quiero** importar productos desde un archivo CSV o Excel,  
**para** cargar el catálogo inicial o actualizaciones masivas sin ingresar cada producto manualmente.

**Criterios de aceptación:**
- El sistema provee una plantilla de importación descargable.
- Se validan los datos antes de insertar y se muestra un resumen con errores encontrados.
- Los registros válidos se insertan aunque existan errores en otros.

---

### HU-19 – Ajuste manual de inventario
**Como** administrador,  
**quiero** realizar un ajuste manual del stock de un producto,  
**para** corregir diferencias detectadas en un conteo físico.

**Criterios de aceptación:**
- El administrador ingresa la cantidad real contada.
- El sistema calcula y registra la diferencia como movimiento de "ajuste".
- El ajuste queda registrado con observación obligatoria.

---

### HU-20 – Cierre y auditoría de sesión
**Como** administrador,  
**quiero** ver un registro de las sesiones activas e inactivas de los usuarios,  
**para** auditar accesos y detectar usos no autorizados.

**Criterios de aceptación:**
- Se registra: usuario, IP, fecha/hora de inicio y cierre de sesión.
- El administrador puede cerrar sesiones activas de otros usuarios remotamente.
- El log de sesiones es de solo lectura y no puede ser modificado.

---

## 4. Requisitos No Funcionales

### RNF-01 – Rendimiento

- El sistema debe responder a cualquier consulta o acción del usuario en **menos de 3 segundos** bajo condiciones normales de uso (hasta 50 usuarios concurrentes).
- La carga del dashboard principal no debe superar **2 segundos** con una conexión estándar de 10 Mbps.
- Las consultas a la base de datos deben estar optimizadas mediante índices en los campos de búsqueda frecuente (SKU, nombre de producto, fecha).

---

### RNF-02 – Seguridad

- Todas las contraseñas deben almacenarse con **hashing bcrypt** (costo mínimo 12).
- Las comunicaciones entre cliente y servidor deben usar **HTTPS/TLS 1.2 o superior**.
- El sistema debe implementar **protección contra ataques CSRF, XSS e inyección SQL**.
- Los tokens de sesión deben expirar tras **30 minutos de inactividad**.
- Se deben registrar en un log inmutable todos los eventos de autenticación (login, logout, intentos fallidos).

---

### RNF-03 – Disponibilidad y Confiabilidad

- El sistema debe tener una disponibilidad mínima del **99.5% mensual** (tiempo de inactividad máximo permitido: ~3.6 horas/mes).
- Se deben realizar **copias de seguridad automáticas de la base de datos** cada 24 horas, con retención de 30 días.
- Ante fallos del servidor, el sistema debe recuperarse automáticamente sin pérdida de transacciones confirmadas.

---

### RNF-04 – Usabilidad y Accesibilidad

- La interfaz debe ser **responsiva**, adaptándose correctamente a resoluciones de escritorio (1280px+) y tabletas (768px+).
- El sistema debe cumplir con las pautas de accesibilidad **WCAG 2.1 nivel AA** (contraste, navegación por teclado, etiquetas ARIA).
- Un usuario nuevo con conocimientos básicos de computación debe ser capaz de registrar un producto y una entrada de mercancía sin capacitación, en un tiempo máximo de **10 minutos**.

---

### RNF-05 – Mantenibilidad y Escalabilidad

- El código fuente debe seguir una arquitectura **MVC (Modelo-Vista-Controlador)** con separación clara de capas.
- El sistema debe poder escalar horizontalmente para soportar hasta **200 usuarios concurrentes** sin cambios en el código de aplicación.
- Toda la lógica de negocio debe estar documentada con comentarios y se debe proveer un **manual técnico** de al menos 10 páginas para facilitar el mantenimiento futuro.

---

## 5. Restricciones del Sistema

- El sistema se desarrollará como aplicación web compatible con los navegadores: **Chrome 110+, Firefox 110+, Edge 110+**.
- El backend se implementará en **[tecnología a definir: Node.js / PHP / Python / Java]**.
- La base de datos a utilizar será **[MySQL / PostgreSQL / MongoDB]**.
- El despliegue se realizará en un servidor con al menos **2 GB de RAM y 20 GB de almacenamiento**.

---

## 6. Supuestos y Dependencias

- Se asume que la tienda cuenta con acceso a internet estable para el uso del sistema.
- Los usuarios finales disponen de dispositivos con navegadores modernos actualizados.
- El sistema depende de un servicio de correo electrónico (SMTP) para el envío de alertas y notificaciones.

---

## 7. Historial de Versiones

| Versión | Fecha | Descripción | Autor |
|---|---|---|---|
| 1.0 | 2026-04-23 | Versión inicial del SRS | Axel Gomez |

---

*Fin del documento SRS – Sistema de Inventario para Tienda v1.0*
