import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { puede, rutaInicioAdmin } from "../auth/permisos";
import type { Accion, Modulo } from "../auth/permisos";

interface Props {
  children: React.ReactNode;
  /** Si se indica, además de ser personal (Administrador o Vendedor) el rol debe poder usar este módulo. */
  modulo?: Modulo;
  accion?: Accion;
}

/**
 * Sin sesión → /login. Cliente → tienda. Personal sin permiso en el módulo → su pantalla inicial.
 * Ocultar rutas aquí es solo experiencia de usuario: el backend vuelve a validar el rol en cada petición.
 */
const RutaProtegida: React.FC<Props> = ({ children, modulo, accion = "ver" }) => {
  const { usuario, esStaff } = useAuth();
  const ubicacion = useLocation();

  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (!esStaff) return <Navigate to="/" replace />;
  if (modulo && !puede(usuario.rol, modulo, accion)) {
    return <Navigate to={rutaInicioAdmin(usuario.rol)} replace />;
  }
  return <>{children}</>;
};

export default RutaProtegida;
