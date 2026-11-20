import { apiRequest } from "./api";

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

interface CategoriaApi {
  id: number;
  nombre: string;
  descripcion?: string;
}

const adaptarCategoria = (categoria: CategoriaApi): Categoria => ({
  id: String(categoria.id),
  nombre: categoria.nombre,
  descripcion: categoria.descripcion ?? "",
});

export async function listarCategorias(): Promise<Categoria[]> {
  const categorias = await apiRequest<CategoriaApi[]>("productos", "categorias");
  return categorias.map(adaptarCategoria);
}

export async function obtenerCategoriaPorId(id: string): Promise<Categoria | undefined> {
  return (await listarCategorias()).find((categoria) => categoria.id === id);
}

export async function contarProductos(categoria: string): Promise<number> {
  const productos = await apiRequest<Array<{ categoria: { nombre: string } }>>("productos", "productos");
  return productos.filter((producto) => producto.categoria.nombre === categoria).length;
}

export async function existeCategoria(nombre: string, ignorar?: string): Promise<boolean> {
  const categorias = await listarCategorias();
  return categorias.some(
    (categoria) =>
      categoria.id !== ignorar &&
      categoria.nombre.trim().toLocaleLowerCase() === nombre.trim().toLocaleLowerCase(),
  );
}

export async function crearCategoria(nombre: string): Promise<void> {
  const limpio = nombre.trim();
  if (!limpio) throw new Error("El nombre es obligatorio.");
  if (await existeCategoria(limpio)) throw new Error("Ya existe una categoría con ese nombre.");
  await apiRequest("productos", "categorias", {
    method: "POST",
    body: JSON.stringify({ nombre: limpio, descripcion: "" }),
  });
}

export async function renombrarCategoria(id: string, nuevo: string): Promise<void> {
  const limpio = nuevo.trim();
  if (!limpio) throw new Error("El nombre es obligatorio.");
  if (await existeCategoria(limpio, id)) throw new Error("Ya existe una categoría con ese nombre.");
  const categoria = await obtenerCategoriaPorId(id);
  if (!categoria) throw new Error("La categoría ya no existe.");
  await apiRequest("productos", `categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nombre: limpio, descripcion: categoria.descripcion }),
  });
}

export async function eliminarCategoria(id: string): Promise<void> {
  const categoria = await obtenerCategoriaPorId(id);
  if (!categoria) throw new Error("La categoría ya no existe.");
  if (await contarProductos(categoria.nombre)) {
    throw new Error("No se puede eliminar una categoría que tiene productos.");
  }
  await apiRequest<void>("productos", `categorias/${id}`, { method: "DELETE" });
}
