/**
 * Pruebas de la matriz de permisos por rol (src/auth/permisos.ts).
 * Son funciones puras: no necesitan DOM ni backend.
 */
import { modulosVisibles, puede, rutaInicioAdmin } from "../auth/permisos";

describe("permisos por rol", () => {
  describe("Administrador", () => {
    it("debería poder hacer todas las acciones de productos", () => {
      for (const accion of ["ver", "crear", "editar", "eliminar"] as const) {
        expect(puede("Administrador", "productos", accion)).toBeTrue();
      }
    });

    it("debería poder anular órdenes", () => {
      expect(puede("Administrador", "ordenes", "anular")).toBeTrue();
    });

    it("debería ver los 7 módulos del panel", () => {
      expect(modulosVisibles("Administrador").length).toBe(7);
    });

    it("debería partir en el dashboard", () => {
      expect(rutaInicioAdmin("Administrador")).toBe("/admin/dashboard");
    });
  });

  describe("Vendedor / Pastelero", () => {
    it("debería poder ver órdenes y productos", () => {
      expect(puede("Vendedor / Pastelero", "ordenes", "ver")).toBeTrue();
      expect(puede("Vendedor / Pastelero", "productos", "ver")).toBeTrue();
    });

    it("no debería poder crear, editar ni eliminar productos", () => {
      for (const accion of ["crear", "editar", "eliminar"] as const) {
        expect(puede("Vendedor / Pastelero", "productos", accion)).toBeFalse();
      }
    });

    it("no debería poder anular órdenes", () => {
      expect(puede("Vendedor / Pastelero", "ordenes", "anular")).toBeFalse();
    });

    it("no debería ver dashboard, categorías, usuarios ni reportes", () => {
      for (const modulo of ["dashboard", "categorias", "usuarios", "reportes"] as const) {
        expect(puede("Vendedor / Pastelero", modulo, "ver")).toBeFalse();
      }
    });

    it("debería partir en órdenes, porque no tiene dashboard", () => {
      expect(rutaInicioAdmin("Vendedor / Pastelero")).toBe("/admin/ordenes");
    });
  });

  describe("Cliente y sin sesión", () => {
    it("el cliente no debería tener acceso a ningún módulo", () => {
      expect(modulosVisibles("Cliente")).toEqual([]);
      expect(puede("Cliente", "productos", "ver")).toBeFalse();
    });

    it("sin rol (sin sesión) nunca debería tener permiso", () => {
      expect(puede(undefined, "ordenes", "ver")).toBeFalse();
      expect(puede(null, "productos", "ver")).toBeFalse();
    });

    it("el cliente debería volver a la tienda y no al panel", () => {
      expect(rutaInicioAdmin("Cliente")).toBe("/");
    });
  });
});
