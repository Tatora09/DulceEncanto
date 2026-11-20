import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../../types";
import { obtenerProductosCriticos } from "../../services/productsService";

const ProductosCriticos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      setProductos(await obtenerProductosCriticos());
      setCargando(false);
    })();
  }, []);

  if (cargando) return <p>Cargando…</p>;

  return (
    <section>
      <Link to="/admin/productos" className="btn btn-link px-0">← Volver a productos</Link>
      <h1 className="h3 mb-3">Productos con stock crítico</h1>

      {productos.length === 0 ? (
        <div className="alert alert-success">Todo en orden: ningún producto está bajo su stock crítico.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead>
              <tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Stock</th><th>Crítico</th><th /></tr>
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
