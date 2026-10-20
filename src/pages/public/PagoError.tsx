import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import DetalleOrden from "../../components/DetalleOrden";
import { obtenerOrdenPorId } from "../../services/ordersService";

const PagoError: React.FC = () => {
  const [params] = useSearchParams();
  const orden = obtenerOrdenPorId(params.get("orden") ?? "");

  return (
    <section className="mx-auto" style={{ maxWidth: 820 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h3 text-danger">❌ No se pudo realizar el pago</h1>
          {orden ? (
            <>
              <p className="text-muted">Orden <strong>{orden.numero}</strong>. Tu carrito sigue intacto, puedes reintentar.</p>
              <Link to={`/checkout?reintentar=${orden.id}`} className="btn btn-success mb-3">Volver a realizar el pago</Link>
              <DetalleOrden orden={orden} />
            </>
          ) : (
            <Link to="/carrito" className="btn btn-success mt-2">Volver al carrito</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default PagoError;
