import type { Rol } from "../types";

/** Módulos del panel de administración. */
export type Modulo = "dashboard" | "ordenes" | "productos" | "categorias" | "usuarios" | "reportes" | "perfil";

/** Acciones que un rol puede hacer dentro de un módulo. */
export type Accion = "ver" | "crear" | "editar" | "eliminar" | "anular";

/**
 * Matriz de permisos del panel. Es solo para la experiencia de usuario:
 * la seguridad real la aplica el backend (SecurityConfig de cada microservicio).
 *
 * - Administrador: todo.
 * - Vendedor / Pastelero: solo Órdenes y Productos, en modo lectura (sin crear, editar, eliminar ni anular).
 * - Cliente: no entra al panel.
 */
const PERMISOS: Record<Rol, Partial<Record<Modulo, Accion[]>>> = {
  Administrador: {
    dashboard: ["ver"],
    ordenes: ["ver", "anular"],
    productos: ["ver", "crear", "editar", "eliminar"],
    categorias: ["ver", "crear", "editar", "eliminar"],
    usuarios: ["ver", "crear"],
    reportes: ["ver"],
    perfil: ["ver"],
  },
  "Vendedor / Pastelero": {
    ordenes: ["ver"],
    productos: ["ver"],
    perfil: ["ver"],
  },
  Cliente: {},
};

/** Orden en que se prueban los módulos para decidir la pantalla inicial del panel. */
const ORDEN_MODULOS: Modulo[] = ["dashboard", "ordenes", "productos", "categorias", "usuarios", "reportes", "perfil"];

export function puede(rol: Rol | undefined | null, modulo: Modulo, accion: Accion = "ver"): boolean {
  if (!rol) return false;
  return PERMISOS[rol]?.[modulo]?.includes(accion) ?? false;
}

export function modulosVisibles(rol: Rol | undefined | null): Modulo[] {
  return ORDEN_MODULOS.filter((modulo) => puede(rol, modulo, "ver"));
}

/** Primera pantalla del panel a la que el rol tiene acceso (el vendedor no ve el dashboard). */
export function rutaInicioAdmin(rol: Rol | undefined | null): string {
  const [primero] = modulosVisibles(rol);
  return primero ? `/admin/${primero}` : "/";
}
