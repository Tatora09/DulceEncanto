/**
 * Pruebas de authService: login, adaptación de roles del backend y mensajes de error.
 * El backend se simula con un espía sobre window.fetch.
 */
import { esAdministrador, esStaff, login, logout, obtenerUsuarioActual, registrarUsuario } from "../services/authService";
import { obtenerAccessToken } from "../services/api";
import type { Usuario } from "../types";

function responder(status: number, cuerpo?: unknown) {
  return spyOn(window, "fetch").and.resolveTo(new Response(cuerpo === undefined ? null : JSON.stringify(cuerpo), { status }));
}

const usuarioCon = (rol: Usuario["rol"]): Usuario => ({
  id: "1", rut: "", nombre: "x", email: "x@x.cl", rol, region: "", comuna: "", estado: "Activo", fechaRegistro: "",
});

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("authService", () => {
  it("login correcto debería guardar los tokens y la sesión", async () => {
    responder(200, { accessToken: "AT", refreshToken: "RT", usuario: { id: 4, nombre: "Ana", rol: "ADMIN" } });
    const r = await login("  ANA@Duoc.cl ", "clave123");
    expect(r.exito).toBeTrue();
    expect(obtenerAccessToken()).toBe("AT");
    expect(obtenerUsuarioActual()?.email).toBe("ana@duoc.cl");
    expect(obtenerUsuarioActual()?.rol).toBe("Administrador");
  });

  it("debería traducir el rol VENDEDOR del backend a 'Vendedor / Pastelero'", async () => {
    responder(200, { accessToken: "AT", refreshToken: "RT", usuario: { id: 5, nombre: "Cami", rol: "VENDEDOR" } });
    const r = await login("cami@duoc.cl", "clave123");
    expect(r.exito && r.usuario.rol).toBe("Vendedor / Pastelero");
  });

  it("debería aceptar el rol con prefijo ROLE_", async () => {
    responder(200, { accessToken: "AT", refreshToken: "RT", usuario: { id: 6, nombre: "Pedro", rol: "ROLE_CLIENTE" } });
    const r = await login("pedro@gmail.com", "clave123");
    expect(r.exito && r.usuario.rol).toBe("Cliente");
  });

  it("un 401 debería mostrar 'Correo o contraseña incorrectos.' y no guardar tokens", async () => {
    responder(401, { message: "Credenciales inválidas" });
    const r = await login("a@a.cl", "mala");
    expect(r.exito).toBeFalse();
    if (!r.exito) expect(r.mensaje).toBe("Correo o contraseña incorrectos.");
    expect(obtenerAccessToken()).toBeNull();
  });

  it("logout debería borrar tokens y sesión", async () => {
    responder(200, { accessToken: "AT", refreshToken: "RT", usuario: { id: 4, nombre: "Ana", rol: "ADMIN" } });
    await login("ana@duoc.cl", "clave123");
    logout();
    expect(obtenerAccessToken()).toBeNull();
    expect(obtenerUsuarioActual()).toBeNull();
  });

  it("registrarUsuario debería informar el 409 como correo ya registrado", async () => {
    responder(409, { message: "Correo ya existe" });
    const r = await registrarUsuario({ nombre: "Ana", email: "ana@duoc.cl", password: "clave123" });
    expect(r.exito).toBeFalse();
    if (!r.exito) {
      expect(r.campo).toBe("email");
      expect(r.mensaje).toBe("Ya existe una cuenta con este correo.");
    }
  });

  it("esStaff debería ser verdadero para Administrador y Vendedor, y falso para Cliente o sin sesión", () => {
    expect(esStaff(usuarioCon("Administrador"))).toBeTrue();
    expect(esStaff(usuarioCon("Vendedor / Pastelero"))).toBeTrue();
    expect(esStaff(usuarioCon("Cliente"))).toBeFalse();
    expect(esStaff(null)).toBeFalse();
  });

  it("esAdministrador no debería incluir al vendedor", () => {
    expect(esAdministrador(usuarioCon("Administrador"))).toBeTrue();
    expect(esAdministrador(usuarioCon("Vendedor / Pastelero"))).toBeFalse();
  });
});
