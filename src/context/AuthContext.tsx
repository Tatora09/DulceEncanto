import React, { createContext, useContext, useEffect, useState } from "react";
import type { Usuario } from "../types";
import * as auth from "../services/authService";

interface AuthContextValue {
  usuario: Usuario | null;
  esStaff: boolean;
  esAdministrador: boolean;
  login: (email: string, password: string) => Promise<auth.ResultadoLogin>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => auth.obtenerUsuarioActual());

  useEffect(() => {
    const expiroSesion = () => setUsuario(null);
    window.addEventListener("dulce-encanto:sesion-expirada", expiroSesion);
    return () => window.removeEventListener("dulce-encanto:sesion-expirada", expiroSesion);
  }, []);

  const value: AuthContextValue = {
    usuario,
    esStaff: auth.esStaff(usuario),
    esAdministrador: auth.esAdministrador(usuario),
    login: async (email, password) => {
      const r = await auth.login(email, password);
      if (r.exito) setUsuario(r.usuario);
      return r;
    },
    logout: () => {
      auth.logout();
      setUsuario(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
