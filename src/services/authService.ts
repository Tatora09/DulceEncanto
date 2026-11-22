import type { Rol, Usuario } from "../types";
import { ApiError, apiRequest, guardarTokens, limpiarTokens, obtenerAccessToken } from "./api";
import { leer, escribir, borrar } from "./storage";

export const KEY_SESION = "dulce_encanto_usuario_actual";

export type ResultadoLogin = { exito: true; usuario: Usuario } | { exito: false; mensaje: string };

interface UsuarioApi {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

interface RespuestaLogin {
  accessToken: string;
  refreshToken: string;
  usuario: { id: number; nombre: string; rol: string };
}

function adaptarRol(rol: string): Rol {
  switch (rol.replace(/^ROLE_/, "").toUpperCase()) {
    case "ADMIN":
    case "ADMINISTRADOR":
      return "Administrador";
    case "VENDEDOR":
    case "PASTELERO":
    case "VENDEDOR / PASTELERO":
      return "Vendedor / Pastelero";
    case "CLIENTE":
      return "Cliente";
    default:
      throw new Error(`El backend devolvió un rol no reconocido: ${rol}`);
  }
}

function adaptarUsuario(usuario: UsuarioApi): Usuario {
  return {
    id: String(usuario.id),
    rut: "",
    nombre: usuario.nombre,
    email: usuario.correo,
    rol: adaptarRol(usuario.rol),
    region: "",
    comuna: "",
    estado: "Activo",
    fechaRegistro: "",
  };
}

function rolApi(rol: Rol): string {
  if (rol === "Administrador") return "ADMIN";
  if (rol === "Vendedor / Pastelero") return "VENDEDOR";
  return "CLIENTE";
}

export async function obtenerUsuarios(): Promise<Usuario[]> {
  const usuarios = await apiRequest<UsuarioApi[]>("usuarios", "usuarios");
  return usuarios.map(adaptarUsuario);
}

export async function obtenerUsuarioPorId(id: string): Promise<Usuario | undefined> {
  try {
    return adaptarUsuario(await apiRequest<UsuarioApi>("usuarios", `usuarios/${id}`));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

/** Crea (POST) o edita (PUT) un usuario. En edición, password vacío = conservar la actual. */
export async function guardarUsuario(
  datos: Partial<Usuario> & Pick<Usuario, "email" | "nombre"> & { password?: string },
): Promise<Usuario> {
  const cuerpo = {
    nombre: datos.nombre,
    correo: datos.email,
    password: datos.password || undefined,
    rol: rolApi(datos.rol ?? "Cliente"),
  };
  const usuario = datos.id
    ? await apiRequest<UsuarioApi>("usuarios", `usuarios/${datos.id}`, { method: "PUT", body: JSON.stringify(cuerpo) })
    : await apiRequest<UsuarioApi>("usuarios", "usuarios", { method: "POST", body: JSON.stringify(cuerpo) });
  return adaptarUsuario(usuario);
}

/** Elimina un usuario (solo ADMIN). El backend responde 409 si intentas borrar tu propia cuenta. */
export async function eliminarUsuario(id: string): Promise<void> {
  await apiRequest<void>("usuarios", `usuarios/${id}`, { method: "DELETE" });
}

interface DatosJwt {
  rol?: string;
  userId?: number;
  exp?: number;
}

/** Lee el payload del JWT (solo lectura: la firma la valida el backend en cada petición). */
function decodificarJwt(token: string): DatosJwt | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json) as DatosJwt;
  } catch {
    return null;
  }
}

/**
 * Restaura la sesión al recargar la página.
 * El rol y el id se toman del token (firmado por el backend) y NO del localStorage,
 * que el usuario puede editar a mano desde las DevTools para "hacerse administrador".
 */
export function obtenerUsuarioActual(): Usuario | null {
  const token = obtenerAccessToken();
  const guardado = leer<Usuario | null>(KEY_SESION, null);
  if (!token || !guardado) return null;

  const datos = decodificarJwt(token);
  if (!datos?.rol) return null;
  try {
    return { ...guardado, id: String(datos.userId ?? guardado.id), rol: adaptarRol(datos.rol) };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<ResultadoLogin> {
  try {
    const respuesta = await apiRequest<RespuestaLogin>("usuarios", "auth/login", {
      method: "POST",
      body: JSON.stringify({ correo: email.trim().toLowerCase(), password }),
    });
    guardarTokens(respuesta.accessToken, respuesta.refreshToken);
    const usuario = adaptarUsuario({
      id: respuesta.usuario.id,
      nombre: respuesta.usuario.nombre,
      correo: email.trim().toLowerCase(),
      rol: respuesta.usuario.rol,
    });
    escribir(KEY_SESION, usuario);
    return { exito: true, usuario };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { exito: false, mensaje: "Correo o contraseña incorrectos." };
    }
    if (error instanceof ApiError && error.status === 403) {
      return {
        exito: false,
        mensaje: "El backend bloqueó el inicio de sesión (403). Revisa que /api/v1/auth/login esté permitido sin token en su configuración de seguridad.",
      };
    }
    throw error;
  }
}

export function logout(): void {
  limpiarTokens();
  borrar(KEY_SESION);
}

export function esStaff(usuario: Usuario | null): boolean {
  return !!usuario && usuario.rol !== "Cliente";
}

export function esAdministrador(usuario: Usuario | null): boolean {
  return usuario?.rol === "Administrador";
}

export function tieneRol(usuario: Usuario | null, ...roles: Rol[]): boolean {
  return !!usuario && roles.includes(usuario.rol);
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
}

export type ResultadoRegistro =
  | { exito: true; usuario: Usuario }
  | { exito: false; campo: "email"; mensaje: string };

export async function registrarUsuario(datos: DatosRegistro): Promise<ResultadoRegistro> {
  try {
    const usuario = await apiRequest<UsuarioApi>("usuarios", "auth/register", {
      method: "POST",
      body: JSON.stringify({
        nombre: datos.nombre.trim(),
        correo: datos.email.trim().toLowerCase(),
        password: datos.password,
        rol: "CLIENTE",
      }),
    });
    return { exito: true, usuario: adaptarUsuario(usuario) };
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { exito: false, campo: "email", mensaje: "Ya existe una cuenta con este correo." };
    }
    if (error instanceof ApiError && error.status === 403) {
      throw new Error("El backend bloqueó el registro (403). Revisa que /api/v1/auth/register esté permitido sin token.");
    }
    throw error;
  }
}
