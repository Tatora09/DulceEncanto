import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Rol, Usuario } from "../../types";
import { eliminarUsuario, obtenerUsuarios } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const ROLES: Rol[] = ["Administrador", "Vendedor / Pastelero", "Cliente"];

const claseRol = (rol: Rol) =>
  rol === "Administrador" ? "bg-dark" : rol === "Cliente" ? "bg-secondary" : "bg-info text-dark";

const UsuariosAdmin: React.FC = () => {
  const { usuario: sesion } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");

  const cargar = useCallback(async () => {
    try {
      setUsuarios(await obtenerUsuarios());
      setError("");
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const eliminar = async (u: Usuario) => {
    if (u.id === sesion?.id) return;
    if (!window.confirm(`¿Eliminar a "${u.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarUsuario(u.id);
      await cargar();
    } catch {
      setError("No se pudo eliminar el usuario.");
    }
  };

  const filtrados = usuarios.filter((u) => {
    const texto = busqueda.toLowerCase();
    const cumpleTexto =
      u.nombre.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto) ||
      u.rut.toLowerCase().includes(texto);
    return cumpleTexto && (filtroRol === "Todos" || u.rol === filtroRol);
  });

  if (cargando) return <p>Cargando usuarios…</p>;

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">+ Nuevo usuario</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-8">
          <input
            className="form-control"
            placeholder="Buscar por nombre, correo o RUT"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
            <option value="Todos">Todos los roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="text-muted">No hay usuarios que coincidan.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead>
              <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Comuna</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => (
                <tr key={u.id}>
                  <td>{u.rut}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${claseRol(u.rol)}`}>{u.rol}</span></td>
                  <td>{u.comuna}</td>
                  <td>
                    <span className={`badge ${u.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>{u.estado}</span>
                  </td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/usuarios/${u.id}/historial`} className="btn btn-sm btn-outline-secondary me-2">Compras</Link>
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={u.id === sesion?.id}
                      title={u.id === sesion?.id ? "No puedes eliminar tu propia cuenta" : undefined}
                      onClick={() => eliminar(u)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UsuariosAdmin;