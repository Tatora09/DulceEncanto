import React, { useEffect, useState } from "react";
import type { Orden } from "../../types";
import { obtenerOrdenes } from "../../services/ordersService";
import { formatearPrecio } from "../../services/productsService";

const Reportes: React.FC = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      setOrdenes(await obtenerOrdenes());
      setCargando(false);
    })();
  }, []);

  if (cargando) return <p>Cargando reportes…</p>;

  const pagadas = ordenes.filter((o) => o.estado === "Pagada");
  const rechazadas = ordenes.length - pagadas.length;
  const ventas = pagadas.reduce((acc, o) => acc + o.totales.total, 0);
  const ticket = pagadas.length ? Math.round(ventas / pagadas.length) : 0;

  const porCategoria = new Map<string, number>();
  const porProducto = new Map<string, number>();
  for (const o of pagadas) {
    for (const i of o.items) {
      porCategoria.set(i.categoria, (porCategoria.get(i.categoria) ?? 0) + i.precio * i.cantidad);
      porProducto.set(i.nombre, (porProducto.get(i.nombre) ?? 0) + i.cantidad);
    }
  }
  const categorias = [...porCategoria.entries()].sort((a, b) => b[1] - a[1]);
  const maxCategoria = categorias[0]?.[1] ?? 1;
  const masVendidos = [...porProducto.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const tarjetas: [string, string][] = [
    ["Órdenes pagadas", String(pagadas.length)],
    ["Pagos rechazados", String(rechazadas)],
    ["Ventas totales", formatearPrecio(ventas)],
    ["Ticket promedio", formatearPrecio(ticket)],
  ];

  return (
    <section>
      <h1 className="h3 mb-3">Reportes de ventas</h1>

      <div className="row g-3 mb-4">
        {tarjetas.map(([etiqueta, valor]) => (
          <div className="col-6 col-lg-3" key={etiqueta}>
            <div className="card p-3 h-100"><small className="text-muted">{etiqueta}</small><strong className="fs-4">{valor}</strong></div>
          </div>
        ))}
      </div>

      {pagadas.length === 0 ? (
        <p className="text-muted">Todavía no hay ventas pagadas para reportar.</p>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card p-3">
              <h2 className="h5">Ventas por categoría</h2>
              {categorias.map(([nombre, monto]) => (
                <div className="mb-3" key={nombre}>
                  <div className="d-flex justify-content-between small"><span>{nombre}</span><strong>{formatearPrecio(monto)}</strong></div>
                  <div className="progress" style={{ height: 10 }}>
                    <div className="progress-bar" style={{ width: `${Math.round((monto / maxCategoria) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card p-3">
              <h2 className="h5">Más vendidos</h2>
              <ol className="mb-0">
                {masVendidos.map(([nombre, cantidad]) => (
                  <li key={nombre} className="d-flex justify-content-between"><span>{nombre}</span><strong>{cantidad} u.</strong></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reportes;
