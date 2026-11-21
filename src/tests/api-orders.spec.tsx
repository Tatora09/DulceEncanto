/**
 * Pruebas del cliente HTTP (api.ts) y del servicio de órdenes (ordersService.ts).
 * Se aísla el backend con un espía de Jasmine sobre window.fetch: no se necesita Docker.
 */
import { ApiError, apiRequest, guardarTokens, limpiarTokens, obtenerAccessToken } from "../services/api";
import { anularOrden, crearOrden, obtenerMisOrdenes } from "../services/ordersService";
import type { ItemCarrito } from "../types";

type Ruta = { metodo?: string; url: RegExp; status?: number; cuerpo?: unknown };

/** Responde según método y URL; guarda cada llamada para poder inspeccionarla. */
function simularBackend(rutas: Ruta[]) {
  return spyOn(window, "fetch").and.callFake(async (entrada: RequestInfo | URL, init?: RequestInit) => {
    const url = String(entrada);
    const metodo = init?.method ?? "GET";
    const ruta = rutas.find((r) => (r.metodo ?? "GET") === metodo && r.url.test(url));
    if (!ruta) return new Response(JSON.stringify({ message: "sin ruta simulada: " + metodo + " " + url }), { status: 500 });
    return new Response(ruta.cuerpo === undefined ? null : JSON.stringify(ruta.cuerpo), { status: ruta.status ?? 200 });
  });
}

const productosApi = [
  { id: 1, nombre: "Torta", descripcion: "", precio: 10000, stock: 5, categoria: { id: 1, nombre: "Tortas" } },
];
const ventaApi = (id: number, usuarioId: number, estado: string) => ({
  id, usuarioId, fecha: "2026-11-0" + id + "T10:00:00", total: 10000, estado,
  detalles: [{ productoId: 1, cantidad: 1, precioUnitario: 10000, subtotal: 10000 }],
});

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("api.ts (cliente HTTP)", () => {
  it("debería enviar el accessToken en la cabecera Authorization", async () => {
    guardarTokens("token-abc");
    const fetchSpy = simularBackend([{ url: /\/api\/productos\/productos$/, cuerpo: [] }]);
    await apiRequest("productos", "productos");
    const cabeceras = fetchSpy.calls.mostRecent().args[1]!.headers as Headers;
    expect(cabeceras.get("Authorization")).toBe("Bearer token-abc");
  });

  it("no debería enviar Authorization cuando no hay sesión", async () => {
    const fetchSpy = simularBackend([{ url: /productos$/, cuerpo: [] }]);
    await apiRequest("productos", "productos");
    const cabeceras = fetchSpy.calls.mostRecent().args[1]!.headers as Headers;
    expect(cabeceras.has("Authorization")).toBeFalse();
  });

  it("debería lanzar ApiError con el mensaje y el status del backend", async () => {
    simularBackend([{ url: /productos\/99$/, status: 404, cuerpo: { message: "Producto no encontrado" } }]);
    try {
      await apiRequest("productos", "productos/99");
      fail("debía lanzar ApiError");
    } catch (e) {
      expect(e instanceof ApiError).toBeTrue();
      expect((e as ApiError).status).toBe(404);
      expect((e as ApiError).message).toBe("Producto no encontrado");
    }
  });

  it("debería renovar el token con el refreshToken y repetir la petición ante un 401", async () => {
    guardarTokens("vencido", "refresh-1");
    let intentos = 0;
    spyOn(window, "fetch").and.callFake(async (entrada: RequestInfo | URL) => {
      const url = String(entrada);
      if (url.endsWith("/auth/refresh")) return new Response(JSON.stringify({ accessToken: "nuevo" }), { status: 200 });
      intentos++;
      return intentos === 1
        ? new Response(null, { status: 401 })
        : new Response(JSON.stringify([{ ok: true }]), { status: 200 });
    });
    const r = await apiRequest<unknown[]>("ventas", "ventas");
    expect(r.length).toBe(1);
    expect(obtenerAccessToken()).toBe("nuevo");
  });

  it("debería cerrar la sesión si la renovación del token falla", async () => {
    guardarTokens("vencido", "refresh-malo");
    const evento = jasmine.createSpy("sesionExpirada");
    window.addEventListener("dulce-encanto:sesion-expirada", evento);
    simularBackend([
      { metodo: "GET", url: /ventas\/ventas$/, status: 401 },
      { metodo: "POST", url: /auth\/refresh$/, status: 401 },
    ]);
    try {
      await apiRequest("ventas", "ventas");
    } catch {
      /* el 401 original se propaga */
    }
    window.removeEventListener("dulce-encanto:sesion-expirada", evento);
    expect(obtenerAccessToken()).toBeNull();
    expect(evento).toHaveBeenCalled();
  });

  it("limpiarTokens debería borrar ambos tokens", () => {
    guardarTokens("a", "r");
    limpiarTokens();
    expect(obtenerAccessToken()).toBeNull();
    expect(localStorage.getItem("dulce_encanto_refresh_token")).toBeNull();
  });
});

describe("ordersService", () => {
  it("anularOrden debería hacer PUT /ventas/{id}/anular y devolver la orden como Anulada", async () => {
    guardarTokens("admin");
    const fetchSpy = simularBackend([
      { metodo: "PUT", url: /ventas\/ventas\/7\/anular$/, cuerpo: ventaApi(7, 3, "ANULADA") },
      { url: /productos\/productos$/, cuerpo: productosApi },
    ]);
    const orden = await anularOrden("7");
    expect(orden.estado).toBe("Anulada");
    expect(orden.numero).toBe("BOL-000007");
    const llamadaPut = fetchSpy.calls.allArgs().find((a) => a[1]?.method === "PUT");
    expect(llamadaPut).toBeDefined();
  });

  it("anularOrden debería propagar el 409 cuando la boleta ya estaba anulada", async () => {
    guardarTokens("admin");
    simularBackend([{ metodo: "PUT", url: /anular$/, status: 409, cuerpo: { message: "La boleta ya se encuentra anulada" } }]);
    try {
      await anularOrden("7");
      fail("debía lanzar ApiError");
    } catch (e) {
      expect((e as ApiError).status).toBe(409);
    }
  });

  it("obtenerMisOrdenes debería devolver solo las del usuario, de la más nueva a la más antigua", async () => {
    simularBackend([
      { url: /ventas\/ventas$/, cuerpo: [ventaApi(1, 3, "COMPLETADA"), ventaApi(2, 9, "COMPLETADA"), ventaApi(3, 3, "ANULADA")] },
      { url: /productos\/productos$/, cuerpo: productosApi },
    ]);
    const mias = await obtenerMisOrdenes("3");
    expect(mias.map((o) => o.id)).toEqual(["3", "1"]);
    expect(mias[0].estado).toBe("Anulada");
    expect(mias[1].estado).toBe("Pagada");
  });

  it("crearOrden debería rechazar un carrito con postres personalizados sin llamar al backend", async () => {
    const fetchSpy = simularBackend([]);
    const item: ItemCarrito = {
      id: "1", nombre: "Torta a pedido", precio: 1, imagen: "", categoria: "", porciones: "", opcionPorcion: null,
      cantidad: 1, esPersonalizado: true,
    };
    try {
      await crearOrden({ items: [item], usuarioId: "3" });
      fail("debía lanzar error");
    } catch (e) {
      expect((e as Error).message).toContain("no puede procesar");
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("crearOrden debería exigir un usuario válido antes de pagar", async () => {
    simularBackend([]);
    try {
      await crearOrden({ items: [], usuarioId: "abc" });
      fail("debía lanzar error");
    } catch (e) {
      expect((e as Error).message).toContain("Inicia sesión");
    }
  });
});
