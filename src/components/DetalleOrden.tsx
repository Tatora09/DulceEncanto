import React from "react";
import type { Orden } from "../types";
import { formatearPrecio } from "../services/productsService";
import ResumenTotales from "./ResumenTotales";

/** Datos del cliente, dirección, productos y totales de una orden (solo lectura). */
const DetalleOrden: React.FC<{ orden: Orden }> = ({ orden }) => {
  const { cliente, direccion } = orden;
  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <h2 className="h6">Cliente</h2>
          <p className="mb-0">{cliente.nombre} {cliente.apellidos}</p>
          <p className="mb-0 text-muted">{cliente.correo}</p>
          {cliente.telefono && <p className="mb-0 text-muted">{cliente.telefono}</p>}
        </div>
        <div className="col-md-6">
          <h2 className="h6">Dirección de entrega</h2>
          <p className="mb-0">
            {direccion.calle}
            {direccion.departamento && `, ${direccion.departamento}`}
          </p>
          <p className="mb-0 text-muted">{direccion.comuna}, {direccion.region}</p>
          {direccion.indicaciones && <p className="mb-0 small fst-italic">“{direccion.indicaciones}”</p>}
        </div>
      </div>

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
