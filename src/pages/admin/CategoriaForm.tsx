import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { crearCategoria, existeCategoria, renombrarCategoria } from "../../services/categoriesService";

const CategoriaForm: React.FC = () => {
  const { id } = useParams(); // en esta versión el id es el propio nombre de la categoría
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [nombre, setNombre] = useState(id ?? "");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) return setError("El nombre es obligatorio.");
    if (limpio.length > 40) return setError("El nombre no puede exceder 40 caracteres.");
    if (await existeCategoria(limpio, id)) return setError("Ya existe una categoría con ese nombre.");

    setGuardando(true);
    try {
      if (id) await renombrarCategoria(id, limpio);
      else await crearCategoria(limpio);
      navigate("/admin/categorias");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la categoría.");
      setGuardando(false);
    }
  };

  return (
    <section>
      <Link to="/admin/categorias" className="btn btn-link px-0">← Volver a categorías</Link>
      <h1 className="h3 mb-3">{editando ? "Editar categoría" : "Nueva categoría"}</h1>

      <form onSubmit={enviar} noValidate className="bg-white p-4 rounded border" style={{ maxWidth: 520 }}>
        <CampoFormulario id="nombre" etiqueta="Nombre" valor={nombre} onCambio={(v) => { setNombre(v); setError(""); }} error={error} requerido />
        {editando && (
          <p className="text-muted small">Al cambiar el nombre, se actualizan también los productos de esta categoría.</p>
        )}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear categoría"}
          </button>
          <Link to="/admin/categorias" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </section>
  );
};

export default CategoriaForm;
