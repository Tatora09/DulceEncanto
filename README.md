# Dulce Encanto — Plataforma Web y Panel de Administración

Aplicación web desarrollada en **React + TypeScript + Vite** para la repostería artesanal **Dulce Encanto**. El sistema funciona como interfaz pública de comercio electrónico y panel de gestión administrativa, conectándose en tiempo real con una arquitectura de microservicios en **Spring Boot + MySQL + Docker**.

> **Repositorio del Backend:** [MietzeDiva/backend-dulce-encanto](https://github.com/MietzeDiva/backend-dulce-encanto)

---

## Funcionalidades Principales

### Tienda Pública (Clientes)
* **Catálogo dinámico:** Visualización de productos y filtrado por categorías obtenidos desde el servidor.
* **Carrito de compras:** Gestión de cantidades, cálculo de subtotales y confirmación visual al agregar productos.
* **Autenticación:** Registro e inicio de sesión de usuarios con validación de contraseña y tokens **JWT**.
* **Proceso de compra (Checkout):** Emisión de boletas reales en el backend con validación de precios y descuento automático de stock.

### Panel de Administración (`/admin`)
* **Dashboard:** Resumen de productos en catálogo, alertas de inventario con stock bajo y total de usuarios registrados.
* **Gestión de Órdenes:** Listado de boletas emitidas y vista de detalle de cada compra.
* **Productos y Categorías:** Creación, edición y eliminación de productos y categorías en la base de datos.
* **Usuarios y Reportes:** Consulta de cuentas registradas y métricas de ventas totales y productos más vendidos.

---

## Conexión con Microservicios (Backend)

El frontend se comunica con tres microservicios independientes orquestados en Docker:

| Microservicio | Ruta Proxy Frontend | Puerto Backend | Función |
| :--- | :--- | :--- | :--- |
| **ms-usuarios** | `/api/usuarios` | `http://localhost:8081/api/v1` | Registro, login JWT y control de roles (`CLIENTE` / `ADMIN`). |
| **ms-productos** | `/api/productos` | `http://localhost:8082/api/v1` | CRUD de productos, categorías e inventario. |
| **ms-ventas** | `/api/ventas` | `http://localhost:8083/api/v1` | Procesamiento de órdenes, boletas y descuento de stock. |

*Durante el desarrollo local, Vite redirige automáticamente las peticiones `/api/...` hacia los puertos del backend para evitar bloqueos de CORS.*
Las imágenes de productos servidas por el backend en `/images/productos/...` también se redirigen a `ms-productos`. En producción, configura `VITE_API_PRODUCTOS_URL` con la URL del servicio para resolver esas rutas en el mismo host.

---

## Instalación y Ejecución Local

### 1. Levantar el Backend (Requisito previo)
Antes de iniciar la web, asegúrate de tener corriendo los contenedores de Docker del repositorio `backend-dulce-encanto` (`docker-compose up -d`).

### 2. Clonar e instalar el Frontend
```bash
git clone [https://github.com/Tatora09/DulceEncanto.git](https://github.com/Tatora09/DulceEncanto.git)
cd DulceEncanto
npm install
```

### 3. Configurar variables de entorno (Opcional)
Si necesitas modificar las URLs por defecto de los microservicios, crea un archivo `.env` a partir de la plantilla:
```bash
cp .env.example .env
```
* Variables para desarrollo (proxy Vite): `VITE_BACKEND_USUARIOS_URL`, `VITE_BACKEND_PRODUCTOS_URL`, `VITE_BACKEND_VENTAS_URL`.
* Variables para producción: `VITE_API_USUARIOS_URL`, `VITE_API_PRODUCTOS_URL`, `VITE_API_VENTAS_URL`
