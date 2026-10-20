import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { useAuth } from "../../context/AuthContext";
import { esStaff } from "../../services/authService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const desde = (useLocation().state as { desde?: string } | null)?.desde;

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(email);
    if (!r.exito) {
      setError(r.mensaje);
      return;
    }
    navigate(desde ?? (esStaff(r.usuario) ? "/admin" : "/"), { replace: true });
  };

  return (
    <section className="mx-auto" style={{ maxWidth: 420 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h4 mb-3">Iniciar sesión</h1>
          <form noValidate onSubmit={enviar}>
            <CampoFormulario id="email" etiqueta="Correo" tipo="email" requerido valor={email} onCambio={(v) => { setEmail(v); setError(""); }} error={error} placeholder="usuario@duoc.cl" />
            <button type="submit" className="btn btn-primary w-100">Ingresar</button>
          </form>
          <p className="small text-muted mt-3 mb-1">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
          <p className="small text-muted mb-0">
            Demo: <code>admin@duoc.cl</code> (admin), <code>carlos@profesor.duoc.cl</code> (pastelero), <code>fernanda.cliente@gmail.com</code> (cliente).
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
