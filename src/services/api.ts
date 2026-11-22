type ServicioApi = "usuarios" | "productos" | "ventas";

const bases: Record<ServicioApi, string> = {
  usuarios: import.meta.env.VITE_API_USUARIOS_URL ?? "/api/usuarios",
  productos: import.meta.env.VITE_API_PRODUCTOS_URL ?? "/api/productos",
  ventas: import.meta.env.VITE_API_VENTAS_URL ?? "/api/ventas",
};

export function resolverUrlImagenProducto(imagenUrl?: string): string {
  const imagen = imagenUrl?.trim() ?? "";
  if (!imagen) return "";
  if (/^(https?:|data:|blob:|\/\/)/i.test(imagen)) return imagen;

  const ruta = imagen.startsWith("/") ? imagen : `/${imagen}`;
  const baseProductos = bases.productos;
  return /^https?:\/\//i.test(baseProductos) ? new URL(ruta, baseProductos).toString() : ruta;
}

const ACCESS_TOKEN_KEY = "dulce_encanto_access_token";
const REFRESH_TOKEN_KEY = "dulce_encanto_refresh_token";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function guardarTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function limpiarTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new Event("dulce-encanto:sesion-expirada"));
}

export function obtenerAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

async function leerRespuesta<T>(respuesta: Response): Promise<T> {
  if (respuesta.status === 204) return undefined as T;

  const texto = await respuesta.text();
  let cuerpo: unknown;
  try {
    cuerpo = texto ? JSON.parse(texto) : undefined;
  } catch {
    cuerpo = texto;
  }

  if (!respuesta.ok) {
    const mensaje =
      typeof cuerpo === "object" && cuerpo !== null && "message" in cuerpo && typeof cuerpo.message === "string"
        ? cuerpo.message
        : typeof cuerpo === "string" && cuerpo
          ? cuerpo
          : `Error de conexión con el servidor (${respuesta.status}).`;
    throw new ApiError(mensaje, respuesta.status);
  }
  return cuerpo as T;
}

async function renovarAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    limpiarTokens();
    return null;
  }

  const respuesta = await fetch(`${bases.usuarios.replace(/\/$/, "")}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!respuesta.ok) {
    limpiarTokens();
    return null;
  }
  const datos = (await respuesta.json()) as { accessToken: string };
  guardarTokens(datos.accessToken);
  return datos.accessToken;
}

export async function apiRequest<T>(
  servicio: ServicioApi,
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const url = `${bases[servicio].replace(/\/$/, "")}/${ruta.replace(/^\//, "")}`;
  const headers = new Headers(opciones.headers);
  if (opciones.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const accessToken = obtenerAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const respuesta = await fetch(url, { ...opciones, headers });
  if (respuesta.status === 401 && !ruta.startsWith("auth/")) {
    const tokenRenovado = await renovarAccessToken();
    if (tokenRenovado) {
      headers.set("Authorization", `Bearer ${tokenRenovado}`);
      const reintento = await fetch(url, { ...opciones, headers });
      if (reintento.status === 401) limpiarTokens();
      return leerRespuesta<T>(reintento);
    }
  }
  return leerRespuesta<T>(respuesta);
}
