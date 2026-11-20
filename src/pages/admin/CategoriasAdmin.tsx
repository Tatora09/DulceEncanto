import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contarProductos, eliminarCategoria, listarCategorias } from "../../services/categoriesService";

interface FilaCategoria {
  nombre: string;
  productos: number;
}

const CategoriasAdmin: React.FC = () => {
  const [filas, setFilas] = useState<FilaCategoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      const nombres = await listarCategorias();
      const datos: FilaCategoria[] = [];
      for (const nombre of nombres) datos.push({ nombre, productos: await contarProductos(nombre) });
      setFilas(datos);
      setError("");
    } catch {
      setError("No se pudieron cargar las categorías.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const eliminar = async (f: FilaCategoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${f.nombre}"?`)) return;
    try {
      await eliminarCategoria(f.nombre);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la categoría.");
    }
  };

  if (cargando) return <p>Cargando categorías…</p>;

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">+ Nueva categoría</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {filas.length === 0 ? (
        <p className="text-muted">Aún no hay categorías.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead>
              <tr><th>Nombre</th><th>Productos</th><th /></tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.nombre}>
                  <td>{f.nombre}</td>
                  <td><span className="badge bg-secondary">{f.productos}</span></td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/categorias/${encodeURIComponent(f.nombre)}/editar`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={f.productos > 0}
                      title={f.productos > 0 ? "Tiene productos asociados" : undefined}
                      onClick={() => eliminar(f)}
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

export default CategoriasAdmin;
