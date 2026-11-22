import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Rol } from "../../types";
import CampoFormulario from "../../components/CampoFormulario";
import { guardarUsuario, obtenerUsuarioPorId } from "../../services/authService";

const ROLES: Rol[] = ["Administrador", "Vendedor / Pastelero", "Cliente"];

const UsuarioForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("Cliente");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(editando);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(!editando);

  useEffect(() => {
    if (!id) return;
    obtenerUsuarioPorId(id)
      .then((usuario) => {
        if (!usuario) {
          setError("El usuario no existe.");
          return;
        }
        setNombre(usuario.nombre);
        setEmail(usuario.email);
        setRol(usuario.rol);
        setUsuarioEncontrado(true);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudo cargar el usuario."))
      .finally(() => setCargando(false));
  }, [id]);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (nombre.trim().length < 2) return setError("Ingresa el nombre del usuario.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Ingresa un correo válido.");
    if ((!editando || password) && password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");

    setGuardando(true);
    setError("");
    try {
      await guardarUsuario({ id, nombre: nombre.trim(), email: email.trim().toLowerCase(), password, rol });
      navigate("/admin/usuarios");
    } catch (e) {
      setError(e instanceof Error ? e.message : `No se pudo ${editando ? "actualizar" : "crear"} el usuario.`);
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando usuario…</p>;

  return (
    <section>
      <Link to="/admin/usuarios" className="btn btn-link px-0">← Volver a usuarios</Link>
      <h1 className="h3 mb-3">{editando ? "Editar usuario" : "Nuevo usuario"}</h1>
      {!editando && <p className="text-muted">Solo un administrador puede crear cuentas con cualquier rol (el registro público siempre crea clientes).</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {usuarioEncontrado && <form onSubmit={enviar} noValidate className="bg-white p-4 rounded border" style={{ maxWidth: 620 }}>
        <CampoFormulario id="nombre" etiqueta="Nombre completo" valor={nombre} onCambio={setNombre} requerido />
        <CampoFormulario id="email" etiqueta="Correo" tipo="email" valor={email} onCambio={setEmail} requerido />
        <CampoFormulario
          id="password"
          etiqueta={editando ? "Nueva contraseña (opcional)" : "Contraseña (mínimo 8 caracteres)"}
          tipo="password"
          valor={password}
          onCambio={setPassword}
          requerido={!editando}
        />
        {editando && <p className="form-text">Deja la contraseña vacía para conservar la actual. Si la cambias, debe tener al menos 8 caracteres.</p>}
        <div className="mb-3">
          <label htmlFor="rol" className="form-label">Rol</label>
          <select id="rol" className="form-select" value={rol} onChange={(evento) => setRol(evento.target.value as Rol)}>
            {ROLES.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
          </select>
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear usuario"}
          </button>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>}
    </section>
  );
};

export default UsuarioForm;
