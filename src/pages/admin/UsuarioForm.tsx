import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Rol, Usuario } from "../../types";
import CampoFormulario from "../../components/CampoFormulario";
import SelectorRegionComuna from "../../components/SelectorRegionComuna";
import { guardarUsuario, obtenerUsuarioPorId, obtenerUsuarios } from "../../services/authService";
import { validarEmailRestringido, validarRUTChileno } from "../../utils/validaciones";

const ROLES: Rol[] = ["Administrador", "Vendedor / Pastelero", "Cliente"];

interface Formulario {
  rut: string;
  nombre: string;
  email: string;
  telefono: string;
  region: string;
  comuna: string;
  rol: Rol;
  estado: string;
}

const VACIO: Formulario = {
  rut: "", nombre: "", email: "", telefono: "", region: "", comuna: "", rol: "Cliente", estado: "Activo",
};

const UsuarioForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState<Formulario>(VACIO);
  const [original, setOriginal] = useState<Usuario | undefined>();
  const [errores, setErrores] = useState<Partial<Record<keyof Formulario, string>>>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    (async () => {
      if (id) {
        const u = await obtenerUsuarioPorId(id);
        if (u) {
          setOriginal(u);
          setForm({
            rut: u.rut, nombre: u.nombre, email: u.email, telefono: u.telefono ?? "",
            region: u.region, comuna: u.comuna, rol: u.rol, estado: u.estado,
          });
        }
      }
      setCargando(false);
    })();
  }, [id]);

  const cambiar = (campo: keyof Formulario) => (valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

  const validar = async () => {
    const e: Partial<Record<keyof Formulario, string>> = {};
    const existentes = await obtenerUsuarios();

    const rut = validarRUTChileno(form.rut);
    if (!rut.valido) e.rut = rut.mensaje;
    else if (existentes.some((u) => u.rut === rut.rutFormateado && u.id !== original?.id))
      e.rut = "Ya existe un usuario con este RUT.";

    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    else if (form.nombre.trim().length > 100) e.nombre = "El nombre no puede exceder 100 caracteres.";

    const email = validarEmailRestringido(form.email);
    if (!email.valido) e.email = email.mensaje;
    else if (existentes.some((u) => u.email.toLowerCase() === email.email && u.id !== original?.id))
      e.email = "Ya existe un usuario con este correo.";

    if (!form.region) e.region = "Selecciona una región.";
    if (!form.comuna) e.comuna = "Selecciona una comuna.";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErrorGeneral("");
    if (!(await validar())) return;
    setGuardando(true);
    try {
      await guardarUsuario({
        ...(original ?? {}),
        id: original?.id,
        rut: validarRUTChileno(form.rut).rutFormateado ?? form.rut,
        nombre: form.nombre.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        region: form.region,
        comuna: form.comuna,
        rol: form.rol,
        estado: form.estado,
      });
      navigate("/admin/usuarios");
    } catch {
      setErrorGeneral("No se pudo guardar el usuario. Intenta nuevamente.");
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando…</p>;
  if (editando && !original) {
    return (
      <div>
        <div className="alert alert-warning">El usuario no existe.</div>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </div>
    );
  }

  return (
    <section>
      <Link to="/admin/usuarios" className="btn btn-link px-0">← Volver a usuarios</Link>
      <h1 className="h3 mb-3">{editando ? "Editar usuario" : "Nuevo usuario"}</h1>
      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate className="bg-white p-4 rounded border">
        <div className="row">
          <div className="col-md-4">
            <CampoFormulario id="rut" etiqueta="RUT (sin puntos ni guión)" valor={form.rut} onCambio={cambiar("rut")} error={errores.rut} requerido placeholder="19011022K" />
          </div>
          <div className="col-md-8">
            <CampoFormulario id="nombre" etiqueta="Nombre completo" valor={form.nombre} onCambio={cambiar("nombre")} error={errores.nombre} requerido />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="email" etiqueta="Correo" tipo="email" valor={form.email} onCambio={cambiar("email")} error={errores.email} requerido />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="telefono" etiqueta="Teléfono" tipo="tel" valor={form.telefono} onCambio={cambiar("telefono")} />
          </div>
        </div>

        <SelectorRegionComuna
          region={form.region}
          comuna={form.comuna}
          onCambio={(region, comuna) => setForm((f) => ({ ...f, region, comuna }))}
          errorRegion={errores.region}
          errorComuna={errores.comuna}
        />

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="rol" className="form-label">Rol</label>
            <select id="rol" className="form-select" value={form.rol} onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value as Rol }))}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="estado" className="form-label">Estado</label>
            <select id="estado" className="form-select" value={form.estado} onChange={(e) => cambiar("estado")(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear usuario"}
          </button>
          <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </section>
  );
};

export default UsuarioForm;