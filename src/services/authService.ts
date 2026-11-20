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
  return (await obtenerUsuarios()).find((usuario) => usuario.id === id);
}

export async function guardarUsuario(datos: Partial<Usuario> & Pick<Usuario, "email" | "nombre"> & { password: string }): Promise<Usuario> {
  if (datos.id) throw new Error("El backend todavía no permite editar usuarios.");
  const usuario = await apiRequest<UsuarioApi>("usuarios", "usuarios", {
    method: "POST",
    body: JSON.stringify({
      nombre: datos.nombre,
      correo: datos.email,
      password: datos.password,
      rol: rolApi(datos.rol ?? "Cliente"),
    }),
  });
  return adaptarUsuario(usuario);
}

export function obtenerUsuarioActual(): Usuario | null {
  if (!obtenerAccessToken()) return null;
  return leer<Usuario | null>(KEY_SESION, null);
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
