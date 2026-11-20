import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { crearCategoria, existeCategoria, obtenerCategoriaPorId, renombrarCategoria } from "../../services/categoriesService";

const CategoriaForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    obtenerCategoriaPorId(id)
      .then((categoria) => {
        if (categoria) setNombre(categoria.nombre);
        else setError("La categoría no existe.");
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudo cargar la categoría."))
      .finally(() => setCargando(false));
  }, [id]);

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) return setError("El nombre es obligatorio.");
    if (limpio.length > 40) return setError("El nombre no puede exceder 40 caracteres.");
    setGuardando(true);
    try {
      if (await existeCategoria(limpio, id)) {
        setError("Ya existe una categoría con ese nombre.");
        setGuardando(false);
        return;
      }
      if (id) await renombrarCategoria(id, limpio);
      else await crearCategoria(limpio);
      navigate("/admin/categorias");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la categoría.");
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando categoría…</p>;

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
