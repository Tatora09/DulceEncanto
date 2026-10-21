import { useCallback } from "react";
import { useCart } from "../context/CartContext";
import { precioVigente } from "../services/productsService";
import type { Producto } from "../types";

/**
 * Añade un producto desde la tarjeta (Home / Productos) con la porción
 * estándar y su precio vigente; en el detalle el cliente elige la porción.
 */
export function useAgregarAlCarrito(): (producto: Producto) => void {
  const { agregar } = useCart();
  return useCallback(
    (producto: Producto) =>
      agregar({
        id: producto.id,
        nombre: producto.nombre,
        precio: precioVigente(producto),
        imagen: producto.imagen,
        categoria: producto.categoria,
        porciones: producto.porciones,
        opcionPorcion: null,
      }),
    [agregar]
  );
}
