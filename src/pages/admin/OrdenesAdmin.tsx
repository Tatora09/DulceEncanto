import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Orden } from "../../types";
import { obtenerOrdenes } from "../../services/ordersService";
import { formatearPrecio } from "../../services/productsService";

const OrdenesAdmin: React.FC = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // await funciona hoy (localStorage) y mañana (axios) sin cambiar la página
        setOrdenes(await obtenerOrdenes());
      } catch {
        setError("No se pudieron cargar las órdenes.");
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const filtradas = ordenes.filter((o) => {
    const texto = busqueda.toLowerCase();
    return (
      o.numero.toLowerCase().includes(texto) ||
      `${o.cliente.nombre} ${o.cliente.apellidos}`.toLowerCase().includes(texto)
    );
  });

  if (cargando) return <p>Cargando órdenes…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section>
      <h1 className="h3 mb-3">Órdenes</h1>
      <input
        className="form-control mb-3"
        placeholder="Buscar por número o cliente"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {filtradas.length === 0 ? (
        <p className="text-muted">No hay órdenes para mostrar.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead>
              <tr>
                <th>N° orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtradas.map((o) => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{new Date(o.fecha).toLocaleDateString("es-CL")}</td>
                  <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                  <td>{formatearPrecio(o.totales.total)}</td>
                  <td>
                    <span className={`badge ${o.estado === "Pagada" ? "bg-success" : "bg-danger"}`}>
                      {o.estado}
                    </span>
                  </td>
                  <td className="text-end">
                    <Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">
                      Ver detalle
                    </Link>
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

export default OrdenesAdmin;