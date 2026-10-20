import type { Cupon, ItemCarrito, TotalesCarrito } from "../types";

export const KEY_CARRITO = "dulce_encanto_cart";
export const KEY_CUPON = "dulce_encanto_cupon";

export const ENVIO_GRATIS_DESDE = 35000;
export const COSTO_ENVIO = 3500;

export const CUPONES_VALIDOS: Record<string, Omit<Cupon, "codigo">> = {
  DULCE10: { descuentoPct: 10, descripcion: "10% de Descuento de Bienvenida" },
  ENCANTO15: { descuentoPct: 15, descripcion: "15% de Descuento Dulce Encanto" },
  DUOCPASTEL: { descuentoPct: 20, descripcion: "20% de Descuento Comunidad Duoc" },
};

/** Misma línea = mismo producto y misma opción de porción */
const mismaLinea = (a: ItemCarrito, id: string, opcion: string | null) =>
  a.id === id && a.opcionPorcion === opcion;

export function agregarItem(items: ItemCarrito[], nuevo: Omit<ItemCarrito, "cantidad">, cantidad = 1): ItemCarrito[] {
  const existe = !nuevo.esPersonalizado && items.some((i) => mismaLinea(i, nuevo.id, nuevo.opcionPorcion));
  if (existe) {
    return items.map((i) => (mismaLinea(i, nuevo.id, nuevo.opcionPorcion) ? { ...i, cantidad: i.cantidad + cantidad } : i));
  }
  return [...items, { ...nuevo, cantidad }];
}

export function actualizarCantidad(items: ItemCarrito[], id: string, opcion: string | null, cantidad: number): ItemCarrito[] {
  if (cantidad <= 0) return eliminarItem(items, id, opcion);
  return items.map((i) => (mismaLinea(i, id, opcion) ? { ...i, cantidad } : i));
}

export function eliminarItem(items: ItemCarrito[], id: string, opcion: string | null): ItemCarrito[] {
  return items.filter((i) => !mismaLinea(i, id, opcion));
}

export function validarCupon(codigo: string): { valido: boolean; cupon?: Cupon; mensaje: string } {
  const cod = codigo.trim().toUpperCase();
  if (!cod) return { valido: false, mensaje: "Cupón no ingresado." };
  const datos = CUPONES_VALIDOS[cod];
  if (!datos) return { valido: false, mensaje: "Cupón inválido o expirado. Pruebe: DULCE10 o DUOCPASTEL" };
  const cupon = { codigo: cod, ...datos };
  return { valido: true, cupon, mensaje: `¡Cupón ${cod} aplicado! ${datos.descripcion}` };
}

export function calcularTotales(items: ItemCarrito[], cupon: Cupon | null): TotalesCarrito {
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const montoDescuento = Math.round((subtotal * (cupon?.descuentoPct ?? 0)) / 100);
  const costoEnvio = subtotal === 0 ? 0 : subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
  return {
    cantidadTotal: items.reduce((acc, i) => acc + i.cantidad, 0),
    subtotal,
    montoDescuento,
    costoEnvio,
    total: Math.max(0, subtotal - montoDescuento + costoEnvio),
  };
}
