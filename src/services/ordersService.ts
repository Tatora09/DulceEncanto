import type { Cupon, DatosCliente, DireccionEntrega, ItemCarrito, Orden, TotalesCarrito } from "../types";
import { descontarStock } from "./productsService";
import { escribir, leer } from "./storage";

export const KEY_ORDENES = "dulce_encanto_ordenes";

export function obtenerOrdenes(): Orden[] {
  return leer<Orden[]>(KEY_ORDENES, []);
}

export function obtenerOrdenPorId(id: string): Orden | undefined {
  return obtenerOrdenes().find((o) => o.id === id);
}

export interface DatosNuevaOrden {
  items: ItemCarrito[];
  totales: TotalesCarrito;
  cupon: Cupon | null;
  cliente: DatosCliente;
  direccion: DireccionEntrega;
  usuarioId?: string;
}

/**
 * Registra la orden. Si el pago fue exitoso descuenta el stock;
 * si fue rechazado la orden queda guardada para poder reintentar.
 */
export function crearOrden(datos: DatosNuevaOrden, pagoExitoso: boolean): Orden {
  const ordenes = obtenerOrdenes();
  const orden: Orden = {
    ...datos,
    id: "ord-" + Date.now(),
    numero: `ORD-2026-${String(ordenes.length + 1).padStart(3, "0")}`,
    fecha: new Date().toISOString(),
    estado: pagoExitoso ? "Pagada" : "Pago rechazado",
  };
  escribir(KEY_ORDENES, [orden, ...ordenes]);
  if (pagoExitoso) descontarStock(datos.items.filter((i) => !i.esPersonalizado));
  return orden;
}


