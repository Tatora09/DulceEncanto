import React from "react";
import { Link } from "react-router-dom";
import { useCatalogo } from "../../hooks/useCatalogo";

const ProductosCriticos: React.FC = () => {
  const { productos: catalogo, cargando, error } = useCatalogo();
  const productos = catalogo.filter((producto) => producto.stock <= producto.stockCritico);

  if (cargando) return <p>Cargando…</p>;

  return (
    <section>
      <Link to="/admin/productos" className="btn btn-link px-0">← Volver a productos</Link>
      <h1 className="h3 mb-3">Productos con stock crítico</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {productos.length === 0 ? (
        <div className="alert alert-success">Todo en orden: ningún producto está bajo su stock crítico.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead>
              <tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Stock</th><th>Crítico (≤ 5)</th><th /></tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td><span className="badge bg-danger">{p.stock}</span></td>
                  <td>{p.stockCritico}</td>
                  <td className="text-end">
                    <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary">Reponer stock</Link>
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

export default ProductosCriticos;
