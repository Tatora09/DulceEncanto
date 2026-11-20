import React from "react";
import type { Orden } from "../types";
import { formatearPrecio } from "../services/productsService";
import ResumenTotales from "./ResumenTotales";

/** Productos, montos y usuario devueltos por el servicio de ventas. */
const DetalleOrden: React.FC<{ orden: Orden }> = ({ orden }) => {
  return (
    <>
      <p className="small text-muted">Compra asociada al usuario #{orden.usuarioId}.</p>

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio</th>
              <th scope="col">Cant.</th>
              <th scope="col" className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orden.items.map((i) => (
              <tr key={`${i.id}-${i.opcionPorcion}`}>
                <td>
                  {i.nombre}
                  {i.opcionPorcion && <small className="text-muted d-block">{i.opcionPorcion}</small>}
                </td>
                <td>{formatearPrecio(i.precio)}</td>
                <td>{i.cantidad}</td>
                <td className="text-end">{formatearPrecio(i.precio * i.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ResumenTotales totales={orden.totales} cupon={orden.cupon} />
    </>
  );
};

export default DetalleOrden;
