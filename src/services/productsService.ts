import type { Blog, EstadoSolicitud, OpcionPorcion, Producto, Solicitud } from "../types";
import { SOLICITUDES_INICIALES } from "../data/solicitudes";
import { BLOGS_INICIALES } from "../data/blogs";
import { apiRequest, ApiError, resolverUrlImagenProducto } from "./api";
import { escribir, leer } from "./storage";

export const KEY_SOLICITUDES = "dulce_encanto_solicitudes";
export const KEY_BLOGS = "dulce_encanto_blogs";
const IMAGEN_ANTERIOR_BLOG_PRINCIPAL =
  "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80";

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
  if (p.precio === 0) return opcion.precio;
  return Math.round(opcion.precio * (precioVigente(p) / p.precio));
}

interface CategoriaApi {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface ProductoApi {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria: CategoriaApi;
  imagenUrl?: string;
}

function adaptarProducto(producto: ProductoApi): Producto {
  return {
    id: String(producto.id),
    codigo: `PRD-${producto.id}`,
    nombre: producto.nombre,
    categoria: producto.categoria.nombre,
    categoriaId: String(producto.categoria.id),
    precio: producto.precio,
    stock: producto.stock,
    stockCritico: 5,
    porciones: "Unidad",
    descripcion: producto.descripcion ?? "",
    ingredientes: [],
    alergenos: [],
    imagen: resolverUrlImagenProducto(producto.imagenUrl),
    opcionesPorciones: [{ etiqueta: "Unidad", precio: producto.precio }],
  };
}

export async function obtenerProductos(): Promise<Producto[]> {
  const productos = await apiRequest<ProductoApi[]>("productos", "productos");
  return productos.map(adaptarProducto);
}

export async function obtenerProductoPorId(id: string): Promise<Producto | undefined> {
  if (!/^\d+$/.test(id)) return (await obtenerProductos()).find((p) => p.codigo === id);
  try {
    return adaptarProducto(await apiRequest<ProductoApi>("productos", `productos/${id}`));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

export async function guardarProducto(datos: Partial<Producto> & Pick<Producto, "nombre">): Promise<Producto> {
  const categorias = await apiRequest<CategoriaApi[]>("productos", "categorias");
  const categoria = categorias.find((item) => item.nombre === datos.categoria);
  if (!categoria) throw new Error("Selecciona una categoría existente.");

  const cuerpo = {
    nombre: datos.nombre,
    descripcion: datos.descripcion ?? "",
    precio: datos.precio ?? 0,
    stock: datos.stock ?? 0,
    imagenUrl: datos.imagen ?? "",
    categoria: { id: categoria.id },
  };
  const guardado = datos.id
    ? await apiRequest<ProductoApi>("productos", `productos/${datos.id}`, { method: "PUT", body: JSON.stringify(cuerpo) })
    : await apiRequest<ProductoApi>("productos", "productos", { method: "POST", body: JSON.stringify(cuerpo) });
  return adaptarProducto(guardado);
}

export async function eliminarProducto(id: string): Promise<void> {
  await apiRequest<void>("productos", `productos/${id}`, { method: "DELETE" });
}

export async function obtenerCategorias(): Promise<string[]> {
  const categorias = await apiRequest<CategoriaApi[]>("productos", "categorias");
  return categorias.map((categoria) => categoria.nombre).sort((a, b) => a.localeCompare(b, "es"));
}

export async function obtenerProductosCriticos(): Promise<Producto[]> {
  return (await obtenerProductos()).filter((producto) => producto.stock <= producto.stockCritico);
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
  let imagenActualizada = false;
  const blogs = leer<Blog[]>(KEY_BLOGS, BLOGS_INICIALES).map((blog) => {
    const inicial = BLOGS_INICIALES.find((item) => item.id === blog.id);
    if (blog.id === "blog-001" && blog.imagen === IMAGEN_ANTERIOR_BLOG_PRINCIPAL && inicial) {
      imagenActualizada = true;
      return { ...blog, imagen: inicial.imagen };
    }
    return blog;
  });

  if (imagenActualizada) escribir(KEY_BLOGS, blogs);
  return blogs;
}

export function obtenerBlogPorSlug(slug: string): Blog | undefined {
  return obtenerBlogs().find((b) => b.slug === slug || b.id === slug);
}
