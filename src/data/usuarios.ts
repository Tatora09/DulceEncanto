import type { Usuario } from "../types";

export const USUARIOS_INICIALES: Usuario[] = [
  {
    "id": "usr-001",
    "rut": "152345674",
    "nombre": "María Paz Encanto",
    "email": "admin@duoc.cl",
    "rol": "Administrador",
    "region": "Región Metropolitana de Santiago",
    "comuna": "Providencia",
    "telefono": "+56 9 9876 5432",
    "estado": "Activo",
    "fechaRegistro": "2026-01-15"
  },
  {
    "id": "usr-002",
    "rut": "167891233",
    "nombre": "Carlos Repostero",
    "email": "carlos@profesor.duoc.cl",
    "rol": "Vendedor / Pastelero",
    "region": "Región Metropolitana de Santiago",
    "comuna": "Ñuñoa",
    "telefono": "+56 9 8765 1234",
    "estado": "Activo",
    "fechaRegistro": "2026-03-10"
  },
  {
    "id": "usr-003",
    "rut": "190110222",
    "nombre": "Fernanda Silva",
    "email": "fernanda.cliente@gmail.com",
    "rol": "Cliente",
    "region": "Región de Valparaíso",
    "comuna": "Viña del Mar",
    "telefono": "+56 9 5555 4321",
    "estado": "Activo",
    "fechaRegistro": "2026-05-20"
  }
];
