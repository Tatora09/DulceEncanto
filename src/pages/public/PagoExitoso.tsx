import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DetalleOrden from "../../components/DetalleOrden";
import { obtenerOrdenPorId } from "../../services/ordersService";

const PagoExitoso: React.FC = () => {
  const [params] = useSearchParams();
  const orden = obtenerOrdenPorId(params.get("orden") ?? "");
  const [enviada, setEnviada] = useState(false);

  if (!orden) {
    return (
      <section className="text-center py-5">
        <h1 className="h3">No encontramos la orden</h1>
        <Link to="/productos" className="btn btn-success mt-3">Ir a productos</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto" style={{ maxWidth: 820 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h3 text-success">✅ Se ha realizado la compra</h1>
          <p className="text-muted">
            Orden <strong>{orden.numero}</strong> · {new Date(orden.fecha).toLocaleDateString("es-CL")}
          </p>

          <DetalleOrden orden={orden} />

          {enviada && (
            <div className="alert alert-success mt-3 mb-0" role="status">
              Boleta enviada a {orden.cliente.correo}.
            </div>
          )}

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta</button>
            <button className="btn btn-success" onClick={() => setEnviada(true)}>Enviar boleta por email</button>
            <Link to="/productos" className="btn btn-outline-secondary ms-auto">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PagoExitoso;
