import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Orden } from "../../types";
import { anularOrden, obtenerOrdenPorId } from "../../services/ordersService";
import { useAuth } from "../../context/AuthContext";
import { puede } from "../../auth/permisos";
import DetalleOrden from "../../components/DetalleOrden";

const BoletaAdmin: React.FC = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [orden, setOrden] = useState<Orden | undefined>();
  const [cargando, setCargando] = useState(true);
  const [anulando, setAnulando] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (id) setOrden(await obtenerOrdenPorId(id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo cargar la orden.");
      } finally {
        setCargando(false);
      }
    })();
  }, [id]);

  const anular = async () => {
    if (!orden) return;
    if (!window.confirm(`¿Anular la boleta ${orden.numero}? Se repondrá el stock de sus productos y no se puede deshacer.`)) return;
    try {
      setAnulando(true);
      setError("");
      setOrden(await anularOrden(orden.id));
      setAviso("Boleta anulada. El stock de sus productos fue repuesto.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo anular la boleta.");
    } finally {
      setAnulando(false);
    }
  };

  if (cargando) return <p>Cargando orden…</p>;
  if (!orden) {
    return (
      <div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="alert alert-warning">La orden no existe.</div>
        <Link to="/admin/ordenes">Volver a órdenes</Link>
      </div>
    );
  }

  const puedeAnular = puede(usuario?.rol, "ordenes", "anular") && orden.estado === "Pagada";

  return (
    <section>
      <Link to="/admin/ordenes" className="btn btn-link px-0">← Volver a órdenes</Link>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">
          Orden {orden.numero}{" "}
          <span className={`badge ${orden.estado === "Pagada" ? "bg-success" : "bg-danger"} fs-6`}>{orden.estado}</span>
        </h1>
        {puedeAnular && (
          <button type="button" className="btn btn-outline-danger" onClick={anular} disabled={anulando}>
            {anulando ? "Anulando…" : "Anular boleta"}
          </button>
        )}
      </div>
      {aviso && <div className="alert alert-success" role="status">{aviso}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <DetalleOrden orden={orden} />
    </section>
  );
};

export default BoletaAdmin;
