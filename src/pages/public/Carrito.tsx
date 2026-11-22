import React from "react";
import { Link } from "react-router-dom";
import CantidadControl from "../../components/CantidadControl";
import ImagenConRespaldo from "../../components/ImagenConRespaldo";
import ResumenTotales from "../../components/ResumenTotales";
import { useCart } from "../../context/CartContext";
import { calcularTotales } from "../../services/cartService";
import { formatearPrecio, precioVigente } from "../../services/productsService";
import { useCatalogo } from "../../hooks/useCatalogo";

const Carrito: React.FC = () => {
  const { items, cambiarCantidad, quitar, vaciar } = useCart();
  const { productos, error: errorCatalogo } = useCatalogo();
  const itemsActualizados = items.map((item) => {
    const producto = productos.find((actual) => actual.id === item.id);
    return producto
      ? {
          ...item,
          nombre: producto.nombre,
          precio: precioVigente(producto),
          imagen: producto.imagen,
          categoria: producto.categoria,
          porciones: "Unidad",
          opcionPorcion: null,
        }
      : item;
  });
  const totales = calcularTotales(itemsActualizados, null);

  if (items.length === 0) {
    return (
      <section className="text-center py-5">
        <h1 className="h3">Tu carrito está vacío</h1>
        <p className="text-muted">Agrega algo rico para comenzar.</p>
        <Link to="/productos" className="btn btn-success">Ver productos</Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="h3 mb-4">Carrito de compra</h1>
      {errorCatalogo && <div className="alert alert-danger" role="alert">{errorCatalogo}</div>}
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
                {itemsActualizados.map((i) => {
                  const stock = productos.find((producto) => producto.id === i.id)?.stock;
                  return (
                    <tr key={`${i.id}-${i.opcionPorcion}`} data-testid="fila-carrito">
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <ImagenConRespaldo src={i.imagen} alt="" width={56} height={56} className="rounded object-fit-cover" />
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

              <ResumenTotales totales={totales} />
              <p className="small text-muted mt-2 mb-0">El precio final se valida nuevamente en el servidor al confirmar la compra.</p>

              <Link to="/checkout" className="btn btn-success w-100 mt-3">Ir a pagar</Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Carrito;
