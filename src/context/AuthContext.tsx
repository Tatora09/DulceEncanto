import React, { createContext, useContext, useState } from "react";
import type { Usuario } from "../types";
import * as auth from "../services/authService";

interface AuthContextValue {
  usuario: Usuario | null;
  esStaff: boolean;
  login: (email: string) => auth.ResultadoLogin;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => auth.obtenerUsuarioActual());

  const value: AuthContextValue = {
    usuario,
    esStaff: auth.esStaff(usuario),
    login: (email) => {
      const r = auth.login(email);
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
