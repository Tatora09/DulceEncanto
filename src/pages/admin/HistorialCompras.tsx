import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Orden, Usuario } from "../../types";
import { obtenerUsuarioPorId } from "../../services/authService";
import { obtenerOrdenes } from "../../services/ordersService";
import { formatearPrecio } from "../../services/productsService";

const HistorialCompras: React.FC = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<Usuario | undefined>();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const u = id ? await obtenerUsuarioPorId(id) : undefined;
      setUsuario(u);
      if (u) {
        const todas = await obtenerOrdenes();
        setOrdenes(
          todas.filter((o) => o.usuarioId === u.id || o.cliente.correo.toLowerCase() === u.email.toLowerCase())
        );
      }
      setCargando(false);
    })();
  }, [id]);

  if (cargando) return <p>Cargando…</p>;
  if (!usuario) {
    return (
      <div>
        <div className="alert alert-warning">El usuario no existe.</div>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </div>
    );
  }

  const gastado = ordenes.filter((o) => o.estado === "Pagada").reduce((acc, o) => acc + o.totales.total, 0);

  return (
    <section>
      <Link to="/admin/usuarios" className="btn btn-link px-0">← Volver a usuarios</Link>
      <h1 className="h3 mb-1">Historial de compras</h1>
      <p className="text-muted">{usuario.nombre} · {usuario.email}</p>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><div className="card p-3"><small className="text-muted">Órdenes</small><strong className="fs-4">{ordenes.length}</strong></div></div>
        <div className="col-6 col-md-3"><div className="card p-3"><small className="text-muted">Total pagado</small><strong className="fs-4">{formatearPrecio(gastado)}</strong></div></div>
      </div>

      {ordenes.length === 0 ? (
        <p className="text-muted">Este usuario aún no tiene compras.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead>
              <tr><th>N° orden</th><th>Fecha</th><th>Total</th><th>Estado</th><th /></tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{new Date(o.fecha).toLocaleDateString("es-CL")}</td>
                  <td>{formatearPrecio(o.totales.total)}</td>
                  <td><span className={`badge ${o.estado === "Pagada" ? "bg-success" : "bg-danger"}`}>{o.estado}</span></td>
                  <td className="text-end"><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">Ver detalle</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default HistorialCompras;
