import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const desde = (useLocation().state as { desde?: string } | null)?.desde;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setEnviando(true);
    try {
      const r = await login(email, password);
      if (!r.exito) {
        setError(r.mensaje);
        return;
      }
      navigate(desde ?? (r.usuario.rol !== "Cliente" ? "/admin" : "/"), { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="mx-auto" style={{ maxWidth: 420 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h4 mb-3">Iniciar sesión</h1>
          <form noValidate onSubmit={enviar}>
            <CampoFormulario id="email" etiqueta="Correo" tipo="email" requerido valor={email} onCambio={(v) => { setEmail(v); setError(""); }} error={error} placeholder="usuario@duoc.cl" />
            <CampoFormulario id="password" etiqueta="Contraseña" tipo="password" requerido valor={password} onCambio={(v) => { setPassword(v); setError(""); }} />
            <button type="submit" className="btn btn-primary w-100" disabled={enviando}>{enviando ? "Ingresando…" : "Ingresar"}</button>
          </form>
          <p className="small text-muted mt-3 mb-1">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Login;
