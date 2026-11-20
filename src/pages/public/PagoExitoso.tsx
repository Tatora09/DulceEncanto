import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DetalleOrden from "../../components/DetalleOrden";
import { obtenerOrdenPorId } from "../../services/ordersService";
import type { Orden } from "../../types";

const PagoExitoso: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get("orden") ?? "";
  const [orden, setOrden] = useState<Orden>();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerOrdenPorId(id)
      .then(setOrden)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "No se pudo cargar la boleta."))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p>Cargando boleta…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!orden) {
    return (
      <section className="text-center py-5">
        <h1 className="h3">No encontramos la boleta</h1>
        <Link to="/productos" className="btn btn-success mt-3">Ir a productos</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto" style={{ maxWidth: 820 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h3 text-success">Compra registrada</h1>
          <p className="text-muted">
            Boleta <strong>{orden.numero}</strong> · {new Date(orden.fecha).toLocaleDateString("es-CL")}
          </p>
          <DetalleOrden orden={orden} />
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta</button>
            <Link to="/productos" className="btn btn-outline-secondary ms-auto">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PagoExitoso;
