import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Cupon, ItemCarrito, TotalesCarrito } from "../types";
import * as cart from "../services/cartService";
import { borrar, escribir, leer } from "../services/storage";

interface CartContextValue extends TotalesCarrito {
  items: ItemCarrito[];
  cupon: Cupon | null;
  agregar: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void;
  cambiarCantidad: (id: string, opcion: string | null, cantidad: number) => void;
  quitar: (id: string, opcion: string | null) => void;
  vaciar: () => void;
  aplicarCupon: (codigo: string) => { valido: boolean; mensaje: string };
  quitarCupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemCarrito[]>(() => leer<ItemCarrito[]>(cart.KEY_CARRITO, []));
  const [cupon, setCupon] = useState<Cupon | null>(() => leer<Cupon | null>(cart.KEY_CUPON, null));

  // Persistencia: cada cambio queda guardado en localStorage
  useEffect(() => escribir(cart.KEY_CARRITO, items), [items]);
  useEffect(() => {
    if (cupon) escribir(cart.KEY_CUPON, cupon);
    else borrar(cart.KEY_CUPON);
  }, [cupon]);

  const totales = useMemo(() => cart.calcularTotales(items, cupon), [items, cupon]);

  const value: CartContextValue = {
    items,
    cupon,
    ...totales,
    agregar: (item, cantidad = 1) => setItems((prev) => cart.agregarItem(prev, item, cantidad)),
    cambiarCantidad: (id, opcion, cantidad) => setItems((prev) => cart.actualizarCantidad(prev, id, opcion, cantidad)),
    quitar: (id, opcion) => setItems((prev) => cart.eliminarItem(prev, id, opcion)),
    vaciar: () => {
      setItems([]);
      setCupon(null);
    },
    aplicarCupon: (codigo) => {
      const r = cart.validarCupon(codigo);
      if (r.valido && r.cupon) setCupon(r.cupon);
      return { valido: r.valido, mensaje: r.mensaje };
    },
    quitarCupon: () => setCupon(null),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
