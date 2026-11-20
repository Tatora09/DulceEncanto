# Dulce Encanto — frontend

Aplicación React/Vite conectada a los microservicios del backend:

- Usuarios y autenticación: `http://localhost:8081/api/v1`
- Productos y categorías: `http://localhost:8082/api/v1`
- Ventas: `http://localhost:8083/api/v1`

## Desarrollo local

1. Inicia el backend por separado con su `docker-compose`.
2. Copia `.env.example` a `.env` si necesitas cambiar las direcciones.
3. Ejecuta `npm install` y `npm run dev`.

Vite reenvía `/api/usuarios`, `/api/productos` y `/api/ventas` a los puertos anteriores, evitando CORS durante el desarrollo. Puedes cambiar los destinos con `VITE_BACKEND_USUARIOS_URL`, `VITE_BACKEND_PRODUCTOS_URL` y `VITE_BACKEND_VENTAS_URL`.

Para desplegar el frontend, configura `VITE_API_USUARIOS_URL`, `VITE_API_PRODUCTOS_URL` y `VITE_API_VENTAS_URL` con rutas accesibles desde el navegador. El backend adjunto no configura CORS; en producción usa un proxy/reverse proxy del mismo origen o habilita CORS en los microservicios.

## Funcionalidad según la API disponible

El frontend crea e inicia sesión con contraseña y JWT, consulta/edita productos, administra categorías y registra ventas. El checkout requiere sesión; el backend determina el precio final y descuenta stock.

La API actual no almacena direcciones de despacho, descuentos, tamaños de producto ni postres personalizados. Tampoco ofrece edición o eliminación de usuarios. La interfaz no presenta esos datos como si se guardaran en el servidor.

El SQL inicial solo crea las bases de datos; no incluye una cuenta administradora. El registro público crea cuentas `CLIENTE`, por lo que el backend debe inicializar una cuenta `ADMIN` antes de usar las pantallas administrativas.
