import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Rol } from "../../types";
import CampoFormulario from "../../components/CampoFormulario";
import { guardarUsuario } from "../../services/authService";

const ROLES: Rol[] = ["Administrador", "Vendedor / Pastelero", "Cliente"];

const UsuarioForm: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("Cliente");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (nombre.trim().length < 2) return setError("Ingresa el nombre del usuario.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Ingresa un correo válido.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");

    setGuardando(true);
    setError("");
    try {
      await guardarUsuario({ nombre: nombre.trim(), email: email.trim().toLowerCase(), password, rol });
      navigate("/admin/usuarios");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el usuario.");
      setGuardando(false);
    }
  };

  return (
    <section>
      <Link to="/admin/usuarios" className="btn btn-link px-0">← Volver a usuarios</Link>
      <h1 className="h3 mb-3">Nuevo usuario</h1>
      <p className="text-muted">Solo un administrador puede crear cuentas con cualquier rol (el registro público siempre crea clientes).</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={enviar} noValidate className="bg-white p-4 rounded border" style={{ maxWidth: 620 }}>
        <CampoFormulario id="nombre" etiqueta="Nombre completo" valor={nombre} onCambio={setNombre} requerido />
        <CampoFormulario id="email" etiqueta="Correo" tipo="email" valor={email} onCambio={setEmail} requerido />
        <CampoFormulario id="password" etiqueta="Contraseña (mínimo 8 caracteres)" tipo="password" valor={password} onCambio={setPassword} requerido />
        <div className="mb-3">
          <label htmlFor="rol" className="form-label">Rol</label>
          <select id="rol" className="form-select" value={rol} onChange={(evento) => setRol(evento.target.value as Rol)}>
            {ROLES.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
          </select>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Creando…" : "Crear usuario"}
          </button>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </section>
  );
};

export default UsuarioForm;
