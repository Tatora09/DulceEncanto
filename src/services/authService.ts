import type { Rol, Usuario } from "../types";
import { USUARIOS_INICIALES } from "../data/usuarios";
import { validarEmailRestringido, validarRUTChileno } from "../utils/validaciones";
import { borrar, escribir, leer } from "./storage";

export const KEY_USUARIOS = "dulce_encanto_usuarios_lista";
export const KEY_SESION = "dulce_encanto_usuario_actual";

export type ResultadoLogin = { exito: true; usuario: Usuario } | { exito: false; mensaje: string };

// ---------- Usuarios (CRUD) ----------
export function obtenerUsuarios(): Usuario[] {
  return leer<Usuario[]>(KEY_USUARIOS, USUARIOS_INICIALES);
}

export function guardarUsuario(datos: Partial<Usuario> & Pick<Usuario, "email">): Usuario {
  const usuarios = obtenerUsuarios();
  const idx = usuarios.findIndex((u) => (datos.id && u.id === datos.id) || (datos.rut && u.rut === datos.rut));

  if (idx > -1) {
    usuarios[idx] = { ...usuarios[idx], ...datos };
    escribir(KEY_USUARIOS, usuarios);
    return usuarios[idx];
  }
  const nuevo: Usuario = {
    id: "usr-" + Date.now(),
    rut: "",
    nombre: datos.email.split("@")[0],
    rol: "Cliente",
    region: "",
    comuna: "",
    estado: "Activo",
    fechaRegistro: new Date().toISOString().split("T")[0],
    ...datos,
  };
  escribir(KEY_USUARIOS, [...usuarios, nuevo]);
  return nuevo;
}

export function eliminarUsuario(id: string): void {
  escribir(KEY_USUARIOS, obtenerUsuarios().filter((u) => u.id !== id));
}

// ---------- Sesión ----------
/** Devuelve la sesión guardada o null. A diferencia de la versión HTML, NO inicia sesión sola como admin. */
export function obtenerUsuarioActual(): Usuario | null {
  return leer<Usuario | null>(KEY_SESION, null);
}

export function login(email: string): ResultadoLogin {
  const existente = obtenerUsuarios().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existente) {
    escribir(KEY_SESION, existente);
    return { exito: true, usuario: existente };
  }

  // Correo con dominio autorizado que aún no existe: se crea como Cliente
  const v = validarEmailRestringido(email);
  if (!v.valido) {
    return { exito: false, mensaje: "Correo no autorizado. Debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com" };
  }
  const nuevo = guardarUsuario({ email: v.email!, rol: "Cliente" });
  escribir(KEY_SESION, nuevo);
  return { exito: true, usuario: nuevo };
}

export function logout(): void {
  borrar(KEY_SESION);
}

// ---------- Permisos (RBAC) ----------
export function esStaff(usuario: Usuario | null): boolean {
  return !!usuario && usuario.rol !== "Cliente";
}

export function tieneRol(usuario: Usuario | null, ...roles: Rol[]): boolean {
  return !!usuario && roles.includes(usuario.rol);
}

// ---------- Registro ----------
export interface DatosRegistro {
  rut: string;
  nombre: string;
  email: string;
  telefono: string;
  region: string;
  comuna: string;
}

export type ResultadoRegistro =
  | { exito: true; usuario: Usuario }
  | { exito: false; campo: "rut" | "email"; mensaje: string };

/** Crea un Cliente nuevo. Rechaza RUT o correo ya registrados. */
export function registrarUsuario(datos: DatosRegistro): ResultadoRegistro {
  const rut = validarRUTChileno(datos.rut).rutFormateado ?? datos.rut;
  const email = datos.email.trim().toLowerCase();
  const usuarios = obtenerUsuarios();

  if (usuarios.some((u) => u.rut === rut)) {
    return { exito: false, campo: "rut", mensaje: "Ya existe una cuenta con este RUT." };
  }
  if (usuarios.some((u) => u.email.toLowerCase() === email)) {
    return { exito: false, campo: "email", mensaje: "Ya existe una cuenta con este correo." };
  }
  const usuario = guardarUsuario({
    rut,
    email,
    nombre: datos.nombre.trim(),
    telefono: datos.telefono.trim(),
    region: datos.region,
    comuna: datos.comuna,
    rol: "Cliente",
  });
  return { exito: true, usuario };
}
