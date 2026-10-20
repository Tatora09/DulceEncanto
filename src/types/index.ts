export interface OpcionPorcion {
  etiqueta: string;
  precio: number;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  /** Precio rebajado. Si existe, el producto aparece en /ofertas */
  precioOferta?: number;
  stock: number;
  stockCritico: number;
  porciones: string;
  descripcion: string;
  ingredientes: string[];
  alergenos: string[];
  imagen: string;
  opcionesPorciones: OpcionPorcion[];
  destacado?: boolean;
}

export type EstadoSolicitud = "Pendiente" | "En Preparación" | "Listo";

export interface Solicitud {
  id: string;
  codigo: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  tipoPostre: string;
  porciones: number;
  saborBizcocho: string;
  rellenoPrincipal: string;
  fechaEntrega: string;
  dedicatoria: string;
  tematica: string;
  urlImagen: string;
  precioEstimado: number;
  estado: EstadoSolicitud | string;
  fechaSolicitud: string;
}

export interface Blog {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  autor: string;
  fecha: string;
  categoria: string;
  imagen: string;
  tiempoLectura: string;
  /** HTML ya preparado (se muestra con dangerouslySetInnerHTML) */
  contenido: string;
}

export type Rol = "Administrador" | "Vendedor / Pastelero" | "Cliente";

export interface Usuario {
  id: string;
  rut: string;
  nombre: string;
  email: string;
  rol: Rol;
  region: string;
  comuna: string;
  telefono?: string;
  estado: string;
  fechaRegistro: string;
}

export interface RegionChile {
  region: string;
  codigo: string;
  comunas: string[];
}

export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  porciones: string;
  opcionPorcion: string | null;
  cantidad: number;
  /** Postre personalizado: cada uno es una línea distinta, nunca se agrupa */
  esPersonalizado?: boolean;
  detallesPersonalizados?: Record<string, string | number> | null;
}

export interface Cupon {
  codigo: string;
  descuentoPct: number;
  descripcion: string;
}

export interface TotalesCarrito {
  cantidadTotal: number;
  subtotal: number;
  montoDescuento: number;
  costoEnvio: number;
  total: number;
}

export interface ResultadoValidacion {
  valido: boolean;
  mensaje?: string;
}

export interface DatosCliente {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export interface DireccionEntrega {
  calle: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
}

export type EstadoOrden = "Pagada" | "Pago rechazado";

export interface Orden {
  id: string;
  numero: string;
  fecha: string;
  items: ItemCarrito[];
  totales: TotalesCarrito;
  cupon: Cupon | null;
  cliente: DatosCliente;
  direccion: DireccionEntrega;
  estado: EstadoOrden;
  usuarioId?: string;
}
