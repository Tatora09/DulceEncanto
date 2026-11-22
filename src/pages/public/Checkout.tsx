import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ResumenTotales from "../../components/ResumenTotales";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { calcularTotales } from "../../services/cartService";
import { crearOrden } from "../../services/ordersService";
import { formatearPrecio, precioVigente } from "../../services/productsService";
import { useCatalogo } from "../../hooks/useCatalogo";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, vaciar } = useCart();
  const { productos, cargando: cargandoCatalogo } = useCatalogo();
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
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);

  const pagar = async () => {
    if (!usuario) return;
    setProcesando(true);
    setError("");
    try {
      const orden = await crearOrden({ items: itemsActualizados, usuarioId: usuario.id });
      vaciar();
      navigate(`/pago-exitoso?orden=${orden.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo registrar la venta.");
    } finally {
      setProcesando(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="text-center py-5">
        <h1 className="h3">No hay productos para pagar</h1>
        <Link to="/productos" className="btn btn-success mt-3">Ver productos</Link>
      </section>
    );
  }

  if (!usuario) {
    return (
      <section className="mx-auto text-center py-5" style={{ maxWidth: 560 }}>
        <h1 className="h3">Inicia sesión para comprar</h1>
        <p className="text-muted">El servicio de ventas requiere asociar cada compra a una cuenta.</p>
        <Link to="/login" state={{ desde: "/checkout" }} className="btn btn-primary">Iniciar sesión</Link>
      </section>
    );
  }

  const hayProductosNoSoportados = itemsActualizados.some((item) => item.esPersonalizado || !/^\d+$/.test(item.id));

  return (
    <section>
      <h1 className="h3 mb-4">Confirmar compra</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Cuenta de compra</h2>
              <p className="mb-1">{usuario.nombre}</p>
              <p className="text-muted mb-0">{usuario.email}</p>
              <p className="small text-muted mt-3 mb-0">
                La API registra el usuario, los productos, el precio vigente y el stock. No administra direcciones de despacho ni cupones.
              </p>
            </div>
          </div>
        </div>

        <aside className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Tu pedido</h2>
              <ul className="list-unstyled small mb-3">
                {itemsActualizados.map((item) => (
                  <li key={`${item.id}-${item.opcionPorcion}`} className="d-flex justify-content-between">
                    <span>{item.cantidad} × {item.nombre}</span>
                    <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <ResumenTotales totales={totales} />
              <p className="small text-muted mt-2">El backend vuelve a calcular el total y verifica el stock antes de confirmar.</p>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {hayProductosNoSoportados && (
                <div className="alert alert-warning">El backend no permite vender postres personalizados desde el carrito.</div>
              )}
              <button
                type="button"
                className="btn btn-success w-100 mt-2"
                disabled={procesando || cargandoCatalogo || hayProductosNoSoportados}
                onClick={pagar}
              >
                {procesando ? "Registrando compra…" : `Confirmar compra · ${formatearPrecio(totales.total)}`}
              </button>
              <Link to="/carrito" className="btn btn-link w-100">Volver al carrito</Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
