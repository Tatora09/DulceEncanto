import React from "react";
import { Link } from "react-router-dom";
import { formatearPrecio } from "../../services/productsService";
import { useCatalogo } from "../../hooks/useCatalogo";

const ReportesProductos: React.FC = () => {
  const { productos, cargando, error } = useCatalogo();

  if (cargando) return <p>Cargando reporte…</p>;

  const unidades = productos.reduce((acc, p) => acc + p.stock, 0);
  const valor = productos.reduce((acc, p) => acc + p.stock * p.precio, 0);
  const criticos = productos.filter((p) => p.stock <= p.stockCritico).length;
  const agotados = productos.filter((p) => p.stock === 0).length;

  const porCategoria = new Map<string, { productos: number; unidades: number; valor: number }>();
  for (const p of productos) {
    const f = porCategoria.get(p.categoria) ?? { productos: 0, unidades: 0, valor: 0 };
    f.productos += 1;
    f.unidades += p.stock;
    f.valor += p.stock * p.precio;
    porCategoria.set(p.categoria, f);
  }
  const menorStock = [...productos].sort((a, b) => a.stock - b.stock).slice(0, 5);

  const tarjetas: [string, string][] = [
    ["Productos", String(productos.length)],
    ["Unidades en stock", String(unidades)],
    ["Valor del inventario", formatearPrecio(valor)],
    ["Stock crítico", `${criticos} (${agotados} agotados)`],
  ];

  return (
    <section>
      <Link to="/admin/productos" className="btn btn-link px-0">← Volver a productos</Link>
      <h1 className="h3 mb-3">Reporte de inventario</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4">
        {tarjetas.map(([etiqueta, v]) => (
          <div className="col-6 col-lg-3" key={etiqueta}>
            <div className="card p-3 h-100"><small className="text-muted">{etiqueta}</small><strong className="fs-5">{v}</strong></div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <h2 className="h5">Por categoría</h2>
          <div className="table-responsive">
            <table className="table align-middle bg-white">
              <thead><tr><th>Categoría</th><th>Productos</th><th>Unidades</th><th>Valor</th></tr></thead>
              <tbody>
                {[...porCategoria.entries()].map(([nombre, f]) => (
                  <tr key={nombre}><td>{nombre}</td><td>{f.productos}</td><td>{f.unidades}</td><td>{formatearPrecio(f.valor)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-5">
          <h2 className="h5">Con menos stock</h2>
          <ul className="list-group">
            {menorStock.map((p) => (
              <li key={p.id} className="list-group-item d-flex justify-content-between">
                <span>{p.nombre}</span>
                <span className={`badge ${p.stock <= p.stockCritico ? "bg-danger" : "bg-secondary"}`}>{p.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ReportesProductos;
