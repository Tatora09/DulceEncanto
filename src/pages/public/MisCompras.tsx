import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { Orden } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { obtenerMisOrdenes } from "../../services/ordersService";
import { formatearPrecio } from "../../services/productsService";
import DetalleOrden from "../../components/DetalleOrden";

/** Historial de compras del cliente con sesión iniciada. */
const MisCompras: React.FC = () => {
  const { usuario } = useAuth();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usuario) return;
    (async () => {
      try {
        setOrdenes(await obtenerMisOrdenes(usuario.id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudieron cargar tus compras.");
      } finally {
        setCargando(false);
      }
    })();
  }, [usuario]);

  if (!usuario) return <Navigate to="/login" replace state={{ desde: "/mis-compras" }} />;
  if (cargando) return <p>Cargando tus compras…</p>;

  return (
    <section>
      <h1 className="h3 mb-3">Mis compras</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!error && ordenes.length === 0 ? (
        <div className="alert alert-info">
          Aún no tienes compras. <Link to="/productos">Ver productos</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {ordenes.map((o) => (
            <details key={o.id} className="card shadow-sm">
              <summary className="card-body d-flex flex-wrap justify-content-between align-items-center gap-2" style={{ cursor: "pointer" }}>
                <span className="fw-bold">{o.numero}</span>
                <span>{new Date(o.fecha).toLocaleDateString("es-CL")}</span>
                <span>{formatearPrecio(o.totales.total)}</span>
                <span className={`badge ${o.estado === "Pagada" ? "bg-success" : "bg-danger"}`}>{o.estado}</span>
              </summary>
              <div className="card-body border-top">
                <DetalleOrden orden={o} />
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
};

export default MisCompras;
