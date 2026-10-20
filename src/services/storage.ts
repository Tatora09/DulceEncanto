/**
 * Acceso seguro a localStorage. Todos los services pasan por aquí,
 * así en los tests basta con espiar estas dos funciones (mock).
 */
export function leer<T>(clave: string, porDefecto: T): T {
  try {
    const data = localStorage.getItem(clave);
    return data ? (JSON.parse(data) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export function escribir<T>(clave: string, valor: T): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
    console.error(`No se pudo guardar "${clave}":`, e);
  }
}

export function borrar(clave: string): void {
  try {
    localStorage.removeItem(clave);
  } catch {
    /* sin acción */
  }
}
