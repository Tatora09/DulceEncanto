import type { Blog, EstadoSolicitud, ItemCarrito, OpcionPorcion, Producto, Solicitud } from "../types";
import { PRODUCTOS_INICIALES } from "../data/productos";
import { SOLICITUDES_INICIALES } from "../data/solicitudes";
import { BLOGS_INICIALES } from "../data/blogs";
import { escribir, leer } from "./storage";

export const KEY_PRODUCTOS = "dulce_encanto_productos";
export const KEY_SOLICITUDES = "dulce_encanto_solicitudes";
export const KEY_BLOGS = "dulce_encanto_blogs";

/** "$26.900". Siempre numérico, sirve tanto para el navbar como para tablas. */
export function formatearPrecio(monto: number): string {
  return "$" + Number(monto).toLocaleString("es-CL");
}

/** Precio que realmente se cobra (oferta si existe) */
export function precioVigente(p: Producto): number {
  return p.precioOferta !== undefined && p.precioOferta < p.precio ? p.precioOferta : p.precio;
}

/** Precio de una opción de porción, aplicando la misma rebaja porcentual si el producto está en oferta */
export function precioOpcion(p: Producto, opcion: OpcionPorcion): number {
  return Math.round(opcion.precio * (precioVigente(p) / p.precio));
}

// ---------- Productos (CRUD) ----------
export function obtenerProductos(): Producto[] {
  return leer<Producto[]>(KEY_PRODUCTOS, PRODUCTOS_INICIALES);
}

export function obtenerProductoPorId(id: string): Producto | undefined {
  return obtenerProductos().find((p) => p.id === id || p.codigo === id);
}

export function guardarProducto(datos: Partial<Producto> & Pick<Producto, "nombre">): Producto {
  const productos = obtenerProductos();
  const idx = datos.id ? productos.findIndex((p) => p.id === datos.id) : -1;

  if (idx > -1) {
    productos[idx] = { ...productos[idx], ...datos } as Producto;
    escribir(KEY_PRODUCTOS, productos);
    return productos[idx];
  }
  const nuevo = { ...datos, id: datos.id ?? "prod-" + Date.now() } as Producto;
  escribir(KEY_PRODUCTOS, [nuevo, ...productos]);
  return nuevo;
}

export function eliminarProducto(id: string): void {
  escribir(KEY_PRODUCTOS, obtenerProductos().filter((p) => p.id !== id));
}

/** Resta del inventario lo vendido. Nunca deja stock negativo. */
export function descontarStock(items: ItemCarrito[]): void {
  const productos = obtenerProductos();
  const actualizados = productos.map((p) => {
    const vendido = items.filter((i) => i.id === p.id).reduce((acc, i) => acc + i.cantidad, 0);
    return vendido > 0 ? { ...p, stock: Math.max(0, p.stock - vendido) } : p;
  });
  escribir(KEY_PRODUCTOS, actualizados);
}

// ---------- Consultas derivadas ----------
export function obtenerCategorias(): string[] {
  return [...new Set(obtenerProductos().map((p) => p.categoria))].sort();
}

export function obtenerProductosPorCategoria(categoria: string): Producto[] {
  return obtenerProductos().filter((p) => p.categoria === categoria);
}

export function obtenerOfertas(): Producto[] {
  return obtenerProductos().filter((p) => p.precioOferta !== undefined && p.precioOferta < p.precio);
}

export function obtenerProductosCriticos(): Producto[] {
  return obtenerProductos().filter((p) => p.stock <= p.stockCritico);
}

export function buscarProductos(texto: string): Producto[] {
  const q = texto.trim().toLowerCase();
  if (!q) return obtenerProductos();
  return obtenerProductos().filter(
    (p) => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
  );
}

// ---------- Solicitudes de postres personalizados ----------
export function obtenerSolicitudes(): Solicitud[] {
  return leer<Solicitud[]>(KEY_SOLICITUDES, SOLICITUDES_INICIALES);
}

export function guardarSolicitud(datos: Omit<Solicitud, "id" | "codigo" | "fechaSolicitud" | "estado">): Solicitud {
  const lista = obtenerSolicitudes();
  const nueva: Solicitud = {
    ...datos,
    id: "sol-" + Date.now(),
    codigo: `SOL-2026-${String(lista.length + 1).padStart(3, "0")}`,
    fechaSolicitud: new Date().toISOString().split("T")[0],
    estado: "Pendiente",
  };
  escribir(KEY_SOLICITUDES, [nueva, ...lista]);
  return nueva;
}

export function actualizarEstadoSolicitud(id: string, estado: EstadoSolicitud): void {
  escribir(KEY_SOLICITUDES, obtenerSolicitudes().map((s) => (s.id === id ? { ...s, estado } : s)));
}

// ---------- Blogs ----------
export function obtenerBlogs(): Blog[] {
  return leer<Blog[]>(KEY_BLOGS, BLOGS_INICIALES);
}

export function obtenerBlogPorSlug(slug: string): Blog | undefined {
  return obtenerBlogs().find((b) => b.slug === slug || b.id === slug);
}
