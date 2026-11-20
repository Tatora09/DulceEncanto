import { KEY_PRODUCTOS, obtenerProductos } from "./productsService";
import { escribir, leer } from "./storage";

/** Categorías creadas a mano que todavía no tienen productos. */
export const KEY_CATEGORIAS_EXTRA = "dulce_encanto_categorias_extra";

const extras = () => leer<string[]>(KEY_CATEGORIAS_EXTRA, []);
const igual = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Categorías de los productos + las creadas a mano, sin repetir y ordenadas. */
export function listarCategorias(): string[] {
  const deProductos = obtenerProductos().map((p) => p.categoria);
  return [...new Set([...deProductos, ...extras()])].sort((a, b) => a.localeCompare(b, "es"));
}

export function contarProductos(categoria: string): number {
  return obtenerProductos().filter((p) => p.categoria === categoria).length;
}

export function existeCategoria(nombre: string, ignorar?: string): boolean {
  return listarCategorias().some((c) => igual(c, nombre) && !(ignorar && igual(c, ignorar)));
}

export function crearCategoria(nombre: string): void {
  const limpio = nombre.trim();
  if (!limpio) throw new Error("El nombre es obligatorio.");
  if (existeCategoria(limpio)) throw new Error("Ya existe una categoría con ese nombre.");
  escribir(KEY_CATEGORIAS_EXTRA, [...extras(), limpio]);
}

/** Cambia el nombre en la lista y en todos los productos que la usan. */
export function renombrarCategoria(anterior: string, nuevo: string): void {
  const limpio = nuevo.trim();
  if (!limpio) throw new Error("El nombre es obligatorio.");
  if (existeCategoria(limpio, anterior)) throw new Error("Ya existe una categoría con ese nombre.");

  const productos = obtenerProductos().map((p) => (p.categoria === anterior ? { ...p, categoria: limpio } : p));
  escribir(KEY_PRODUCTOS, productos);
  escribir(KEY_CATEGORIAS_EXTRA, extras().map((c) => (c === anterior ? limpio : c)));
}

/** Solo se puede eliminar una categoría sin productos. */
export function eliminarCategoria(nombre: string): void {
  if (contarProductos(nombre) > 0) throw new Error("No se puede eliminar una categoría que tiene productos.");
  escribir(KEY_CATEGORIAS_EXTRA, extras().filter((c) => c !== nombre));
}
