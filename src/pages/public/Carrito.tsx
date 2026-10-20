import React, { useState } from "react";
import { Link } from "react-router-dom";
import CantidadControl from "../../components/CantidadControl";
import ResumenTotales from "../../components/ResumenTotales";
import { useCart } from "../../context/CartContext";
import { formatearPrecio, obtenerProductoPorId } from "../../services/productsService";

const Carrito: React.FC = () => {
  const { items, cupon, cambiarCantidad, quitar, vaciar, aplicarCupon, quitarCupon, ...totales } = useCart();
  const [codigo, setCodigo] = useState("");
  const [mensajeCupon, setMensajeCupon] = useState<{ valido: boolean; texto: string } | null>(null);

  if (items.length === 0) {
    return (
      <section className="text-center py-5">
        <h1 className="h3">Tu carrito está vacío</h1>
        <p className="text-muted">Agrega algo rico para comenzar.</p>
        <Link to="/productos" className="btn btn-success">Ver productos</Link>
      </section>
    );
  }

  const aplicar = (e: React.FormEvent) => {
    e.preventDefault();
    const r = aplicarCupon(codigo);
    setMensajeCupon({ valido: r.valido, texto: r.mensaje });
    if (r.valido) setCodigo("");
  };

  return (
    <section>
      <h1 className="h3 mb-4">Carrito de compra</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col" className="text-end">Subtotal</th>
                  <th scope="col"><span className="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => {
                  const stock = obtenerProductoPorId(i.id)?.stock;
                  return (
                    <tr key={`${i.id}-${i.opcionPorcion}`} data-testid="fila-carrito">
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={i.imagen} alt="" width={56} height={56} className="rounded object-fit-cover" />
                          <div>
                            <div className="fw-semibold">{i.nombre}</div>
                            <small className="text-muted">{i.opcionPorcion ?? i.porciones}</small>
                          </div>
                        </div>
                      </td>
                      <td>{formatearPrecio(i.precio)}</td>
                      <td>
                        <CantidadControl valor={i.cantidad} max={stock && stock > 0 ? stock : 99} onCambiar={(n) => cambiarCantidad(i.id, i.opcionPorcion, n)} />
                      </td>
                      <td className="text-end">{formatearPrecio(i.precio * i.cantidad)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${i.nombre}`} onClick={() => quitar(i.id, i.opcionPorcion)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button className="btn btn-outline-secondary" onClick={vaciar}>Vaciar carrito</button>
        </div>

        <aside className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Resumen</h2>

              <form className="mb-3" onSubmit={aplicar}>
                <label htmlFor="cupon" className="form-label">Cupón de descuento</label>
                <div className="input-group">
                  <input id="cupon" className="form-control" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: DULCE10" />
                  <button className="btn btn-outline-success" type="submit">Aplicar</button>
                </div>
                {mensajeCupon && (
                  <div className={"small mt-1 " + (mensajeCupon.valido ? "text-success" : "text-danger")} role="status">
                    {mensajeCupon.texto}
                  </div>
                )}
                {cupon && (
                  <button type="button" className="btn btn-link btn-sm p-0 mt-1" onClick={() => { quitarCupon(); setMensajeCupon(null); }}>
                    Quitar cupón {cupon.codigo}
                  </button>
                )}
              </form>

              <ResumenTotales totales={totales} cupon={cupon} />

              <Link to="/checkout" className="btn btn-success w-100 mt-3">Ir a pagar</Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Carrito;
