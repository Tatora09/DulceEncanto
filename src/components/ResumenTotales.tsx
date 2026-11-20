import React from "react";
import type { Cupon, TotalesCarrito } from "../types";
import { formatearPrecio } from "../services/productsService";

interface ResumenTotalesProps {
  totales: TotalesCarrito;
  cupon?: Cupon | null;
}

const ResumenTotales: React.FC<ResumenTotalesProps> = ({ totales, cupon }) => (
  <dl className="row mb-0">
    <dt className="col-7 fw-normal">Subtotal</dt>
    <dd className="col-5 text-end">{formatearPrecio(totales.subtotal)}</dd>

    {cupon && totales.montoDescuento > 0 && (
      <>
        <dt className="col-7 fw-normal text-success">
          Cupón {cupon.codigo} (−{cupon.descuentoPct}%)
        </dt>
        <dd className="col-5 text-end text-success">−{formatearPrecio(totales.montoDescuento)}</dd>
      </>
    )}

    <dt className="col-7 fs-5 border-top pt-2">Total</dt>
    <dd className="col-5 fs-5 fw-bold text-end border-top pt-2" data-testid="total-final">
      {formatearPrecio(totales.total)}
    </dd>
  </dl>
);

export default ResumenTotales;