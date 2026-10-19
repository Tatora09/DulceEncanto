import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Solo deja pasar a Administrador / Vendedor. Clientes y visitas van al login. */
const RutaProtegida: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { esStaff } = useAuth();
  const ubicacion = useLocation();
  if (!esStaff) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  return <>{children}</>;
};

export default RutaProtegida;
