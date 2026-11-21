/**
 * Pruebas de la lógica del carrito (src/services/cartService.ts).
 * Funciones puras sobre arreglos: no necesitan DOM.
 */
import {
  actualizarCantidad,
  agregarItem,
  calcularTotales,
  eliminarItem,
  validarCupon,
} from "../services/cartService";
import type { ItemCarrito } from "../types";

const torta: Omit<ItemCarrito, "cantidad"> = {
  id: "1", nombre: "Torta de chocolate", precio: 10000, imagen: "", categoria: "Tortas",
  porciones: "Unidad", opcionPorcion: null,
};
const brownie: Omit<ItemCarrito, "cantidad"> = { ...torta, id: "2", nombre: "Brownie", precio: 2500 };

describe("cartService", () => {
  describe("agregarItem", () => {
    it("debería agregar un producto nuevo con la cantidad indicada", () => {
      const r = agregarItem([], torta, 2);
      expect(r.length).toBe(1);
      expect(r[0].cantidad).toBe(2);
    });

    it("debería sumar la cantidad cuando el producto ya está en el carrito", () => {
      const r = agregarItem(agregarItem([], torta, 1), torta, 2);
      expect(r.length).toBe(1);
      expect(r[0].cantidad).toBe(3);
    });

    it("no debería agrupar el mismo producto con distinta opción de porción", () => {
      const r = agregarItem(agregarItem([], torta, 1), { ...torta, opcionPorcion: "12 porciones" }, 1);
      expect(r.length).toBe(2);
    });

    it("no debería agrupar los postres personalizados", () => {
      const personalizado = { ...torta, esPersonalizado: true };
      const r = agregarItem(agregarItem([], personalizado, 1), personalizado, 1);
      expect(r.length).toBe(2);
    });
  });

  describe("actualizarCantidad y eliminarItem", () => {
    it("debería cambiar la cantidad de la línea indicada", () => {
      const base = agregarItem(agregarItem([], torta, 1), brownie, 1);
      const r = actualizarCantidad(base, "2", null, 5);
      expect(r.find((i) => i.id === "2")?.cantidad).toBe(5);
      expect(r.find((i) => i.id === "1")?.cantidad).toBe(1);
    });

    it("debería quitar la línea cuando la cantidad llega a 0", () => {
      const base = agregarItem([], torta, 1);
      expect(actualizarCantidad(base, "1", null, 0).length).toBe(0);
    });

    it("debería eliminar solo la línea pedida", () => {
      const base = agregarItem(agregarItem([], torta, 1), brownie, 1);
      const r = eliminarItem(base, "1", null);
      expect(r.map((i) => i.id)).toEqual(["2"]);
    });
  });

  describe("validarCupon", () => {
    it("debería aceptar un cupón válido sin importar mayúsculas ni espacios", () => {
      const r = validarCupon("  dulce10 ");
      expect(r.valido).toBeTrue();
      expect(r.cupon?.codigo).toBe("DULCE10");
      expect(r.cupon?.descuentoPct).toBe(10);
    });

    it("debería rechazar un cupón desconocido", () => {
      expect(validarCupon("NOEXISTE").valido).toBeFalse();
    });

    it("debería rechazar un cupón vacío", () => {
      expect(validarCupon("   ").valido).toBeFalse();
    });
  });

  describe("calcularTotales", () => {
    it("debería calcular cantidad total y subtotal", () => {
      const items = agregarItem(agregarItem([], torta, 2), brownie, 3);
      const t = calcularTotales(items, null);
      expect(t.cantidadTotal).toBe(5);
      expect(t.subtotal).toBe(2 * 10000 + 3 * 2500);
    });

    it("debería dejar el total igual al subtotal: el backend no maneja cupones ni envío", () => {
      const items = agregarItem([], torta, 1);
      const t = calcularTotales(items, { codigo: "DULCE10", descuentoPct: 10, descripcion: "" });
      expect(t.total).toBe(t.subtotal);
      expect(t.montoDescuento).toBe(0);
      expect(t.costoEnvio).toBe(0);
    });

    it("debería devolver 0 con el carrito vacío", () => {
      expect(calcularTotales([], null).total).toBe(0);
    });
  });
});
