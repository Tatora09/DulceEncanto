import React, { useEffect, useMemo, useState } from "react";
import {
  Categoria,
  CategoriaForm,
  CategoriaFormData,
} from "./CategoriaForm";
import "./Admin.css";

const STORAGE_KEY = "dulce_encanto_categorias";

const CATEGORIAS_BASE: Categoria[] = [
  {
    id: "cat-1",
    nombre: "Tortas y Pasteles",
    slug: "tortas-y-pasteles",
    descripcion: "Tortas artesanales para cumpleaños y celebraciones.",
    activa: true,
    orden: 1,
  },
  {
    id: "cat-2",
    nombre: "Postres Individuales",
    slug: "postres-individuales",
    descripcion: "Porciones personales de repostería.",
    activa: true,
    orden: 2,
  },
  {
    id: "cat-3",
    nombre: "Postres Personalizados",
    slug: "postres-personalizados",
    descripcion: "Diseños y sabores preparados a pedido.",
    activa: true,
    orden: 3,
  },
];

function leerCategoriasIniciales(): Categoria[] {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (!guardado) return CATEGORIAS_BASE;
    const parsed = JSON.parse(guardado);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : CATEGORIAS_BASE;
  } catch {
    return CATEGORIAS_BASE;
  }
}

export const CategoriasAdmin: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>(leerCategoriasIniciales);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<"todas" | "activas" | "inactivas">("todas");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
    } catch {
      // Evitar fallos si el almacenamiento no está disponible
    }
  }, [categorias]);

  const handleGuardar = (data: CategoriaFormData, id?: string) => {
    if (id) {
      setCategorias((prev) =>
        prev.map((item) => (item.id === id ? { ...data, id } : item))
      );
      setEditando(null);
      return;
    }

    const nuevoId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `cat-${Date.now()}`;

    setCategorias((prev) => [...prev, { ...data, id: nuevoId }]);
  };

  const handleToggleActiva = (id: string) => {
    setCategorias((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, activa: !item.activa } : item
      )
    );
  };

  const handleEliminar = (categoria: Categoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }
    setCategorias((prev) => prev.filter((item) => item.id !== categoria.id));
    if (editando?.id === categoria.id) {
      setEditando(null);
    }
  };

  const categoriasVisibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return [...categorias]
      .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre))
      .filter((cat) => {
        if (estadoFiltro === "activas" && !cat.activa) return false;
        if (estadoFiltro === "inactivas" && cat.activa) return false;
        if (!termino) return true;
        return (
          cat.nombre.toLowerCase().includes(termino) ||
          cat.slug.toLowerCase().includes(termino) ||
          cat.descripcion.toLowerCase().includes(termino)
        );
      });
  }, [categorias, busqueda, estadoFiltro]);

  return (
    <section className="admin-section categorias-admin">
      <div className="admin-header">
        <h2>Categorías</h2>
        <p>Administra las categorías del catálogo de DulceEncanto.</p>
      </div>

      <div className="admin-content">
        <div className="admin-form-container">
          <CategoriaForm
            categoriaInicial={editando}
            onGuardar={handleGuardar}
            onCancelar={editando ? () => setEditando(null) : undefined}
          />
        </div>

        <div className="admin-table-container">
          <div className="admin-filters">
            <input
              type="search"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select
              value={estadoFiltro}
              onChange={(e) =>
                setEstadoFiltro(e.target.value as "todas" | "activas" | "inactivas")
              }
            >
              <option value="todas">Todas ({categorias.length})</option>
              <option value="activas">
                Activas ({categorias.filter((c) => c.activa).length})
              </option>
              <option value="inactivas">
                Inactivas ({categorias.filter((c) => !c.activa).length})
              </option>
            </select>
          </div>

          {categoriasVisibles.length === 0 ? (
            <p className="empty-message">No hay categorías para mostrar.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Categoría</th>
                  <th>Slug</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoriasVisibles.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.orden}</td>
                    <td>
                      <strong>{cat.nombre}</strong>
                      {cat.descripcion && <small>{cat.descripcion}</small>}
                    </td>
                    <td>
                      <code>{cat.slug}</code>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleActiva(cat.id)}
                      >
                        {cat.activa ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td>
                      <button type="button" onClick={() => setEditando(cat)}>
                        Editar
                      </button>
                      <button type="button" onClick={() => handleEliminar(cat)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriasAdmin;