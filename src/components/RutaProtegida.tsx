import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Las operaciones administrativas del backend requieren el rol ADMIN. */
const RutaProtegida: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { esAdministrador, usuario } = useAuth();
  const ubicacion = useLocation();
  if (!esAdministrador) {
    return <Navigate to={usuario ? "/" : "/login"} replace state={{ desde: ubicacion.pathname }} />;
  }
  return <>{children}</>;
};

export default RutaProtegida;
