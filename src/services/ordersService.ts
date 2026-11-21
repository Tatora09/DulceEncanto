import type { DatosCliente, DireccionEntrega, ItemCarrito, Orden, TotalesCarrito } from "../types";
import { apiRequest, ApiError } from "./api";
import { obtenerProductos } from "./productsService";

interface DetalleVentaApi {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface VentaApi {
  id: number;
  usuarioId: number;
  fecha: string;
  total: number;
  estado: string;
  detalles: DetalleVentaApi[];
}

export interface DatosNuevaOrden {
  items: ItemCarrito[];
  usuarioId: string;
}

const datosClienteVacios: DatosCliente = { nombre: "", apellidos: "", correo: "", telefono: "" };
const direccionVacia: DireccionEntrega = {
  calle: "",
  departamento: "",
  region: "",
  comuna: "",
  indicaciones: "",
};

function mapearVenta(
  venta: VentaApi,
  productos: Awaited<ReturnType<typeof obtenerProductos>>,
  carrito: ItemCarrito[] = [],
): Orden {
  const items = venta.detalles.map((detalle) => {
    const producto = productos.find((item) => item.id === String(detalle.productoId));
    const itemCarrito = carrito.find((item) => item.id === String(detalle.productoId));
    return {
      ...itemCarrito,
      id: String(detalle.productoId),
      nombre: producto?.nombre ?? itemCarrito?.nombre ?? `Producto ${detalle.productoId}`,
      precio: detalle.precioUnitario,
      imagen: producto?.imagen ?? itemCarrito?.imagen ?? "",
      categoria: producto?.categoria ?? itemCarrito?.categoria ?? "",
      porciones: producto?.porciones ?? itemCarrito?.porciones ?? "Unidad",
      opcionPorcion: null,
      cantidad: detalle.cantidad,
    };
  });
  const totales: TotalesCarrito = {
    cantidadTotal: items.reduce((total, item) => total + item.cantidad, 0),
    subtotal: venta.total,
    montoDescuento: 0,
    costoEnvio: 0,
    total: venta.total,
  };
  return {
    id: String(venta.id),
    numero: `BOL-${String(venta.id).padStart(6, "0")}`,
    fecha: venta.fecha,
    items,
    totales,
    cupon: null,
    cliente: { ...datosClienteVacios, nombre: `Usuario ${venta.usuarioId}` },
    direccion: direccionVacia,
    estado: venta.estado === "ANULADA" ? "Anulada" : "Pagada",
    usuarioId: String(venta.usuarioId),
  };
}

export async function obtenerOrdenes(): Promise<Orden[]> {
  const [ventas, productos] = await Promise.all([
    apiRequest<VentaApi[]>("ventas", "ventas"),
    obtenerProductos(),
  ]);
  return ventas.map((venta) => mapearVenta(venta, productos));
}

export async function obtenerOrdenPorId(id: string): Promise<Orden | undefined> {
  try {
    const [venta, productos] = await Promise.all([
      apiRequest<VentaApi>("ventas", `ventas/${id}`),
      obtenerProductos(),
    ]);
    return mapearVenta(venta, productos);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

/**
 * Anula una boleta (solo ADMIN). ms-ventas repone el stock de cada producto y responde la boleta ya anulada.
 * Responde 409 si la boleta ya estaba anulada.
 */
export async function anularOrden(id: string): Promise<Orden> {
  const venta = await apiRequest<VentaApi>("ventas", `ventas/${id}/anular`, { method: "PUT" });
  return mapearVenta(venta, await obtenerProductos());
}

/**
 * Compras del cliente con sesión iniciada.
 * ms-ventas todavía no tiene GET /ventas/mias, así que se filtran por usuarioId.
 * TODO (backend): cuando exista /ventas/mias, usarlo aquí y cerrar GET /ventas a ADMIN/VENDEDOR.
 */
export async function obtenerMisOrdenes(usuarioId: string): Promise<Orden[]> {
  const ordenes = await obtenerOrdenes();
  return ordenes
    .filter((orden) => orden.usuarioId === usuarioId)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function crearOrden(datos: DatosNuevaOrden): Promise<Orden> {
  const usuarioId = Number(datos.usuarioId);
  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    throw new Error("Inicia sesión con una cuenta válida antes de pagar.");
  }
  if (datos.items.length === 0 || datos.items.some((item) => !/^\d+$/.test(item.id) || item.esPersonalizado)) {
    throw new Error("El carrito contiene productos que el backend no puede procesar.");
  }

  const venta = await apiRequest<VentaApi>("ventas", "ventas", {
    method: "POST",
    body: JSON.stringify({
      usuarioId,
      items: datos.items.map((item) => ({ productoId: Number(item.id), cantidad: item.cantidad })),
    }),
  });
  return mapearVenta(venta, [], datos.items);
}
