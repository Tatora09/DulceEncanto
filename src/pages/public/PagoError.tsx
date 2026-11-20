import React from "react";
import { Link } from "react-router-dom";

const PagoError: React.FC = () => {
  return (
    <section className="mx-auto" style={{ maxWidth: 820 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h3 text-danger">❌ No se pudo realizar el pago</h1>
          <p className="text-muted">No se registró la compra. Tu carrito sigue intacto para que puedas intentarlo nuevamente.</p>
          <Link to="/checkout" className="btn btn-success mt-2">Volver a intentar</Link>
        </div>
      </div>
    </section>
  );
};

export default PagoError;
