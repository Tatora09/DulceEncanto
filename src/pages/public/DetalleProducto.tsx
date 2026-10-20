import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CantidadControl from "../../components/CantidadControl";
import { useCart } from "../../context/CartContext";
import { formatearPrecio, obtenerProductoPorId, precioOpcion, precioVigente } from "../../services/productsService";

const DetalleProducto: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { agregar } = useCart();
  const producto = obtenerProductoPorId(id);

  const [indiceOpcion, setIndiceOpcion] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <section className="text-center py-5">
        <h1 className="h3">Producto no encontrado</h1>
        <Link to="/productos" className="btn btn-success mt-3">Volver a productos</Link>
      </section>
    );
  }

  const opcion = producto.opcionesPorciones[indiceOpcion];
  const precio = opcion ? precioOpcion(producto, opcion) : precioVigente(producto);
  const agotado = producto.stock <= 0;

  const añadir = (irAlCarrito: boolean) => {
    agregar(
      {
        id: producto.id,
        nombre: producto.nombre,
        precio,
        imagen: producto.imagen,
        categoria: producto.categoria,
        porciones: opcion ? opcion.etiqueta : producto.porciones,
        opcionPorcion: opcion ? opcion.etiqueta : null,
      },
      cantidad
    );
    if (irAlCarrito) navigate("/carrito");
  };

  return (
    <section>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded-4 shadow-sm w-100" style={{ maxHeight: 480, objectFit: "cover" }} />
        </div>

        <div className="col-12 col-md-6">
          <span className="badge text-bg-light mb-2">{producto.categoria}</span>
          <h1 className="h2">{producto.nombre}</h1>
          <p className="text-muted">{producto.descripcion}</p>

          <p className="fs-3 fw-bold mb-3" data-testid="precio-detalle">{formatearPrecio(precio)}</p>

          {producto.opcionesPorciones.length > 0 && (
            <div className="mb-3">
              <label htmlFor="opcion-porcion" className="form-label">Tamaño</label>
              <select id="opcion-porcion" className="form-select" value={indiceOpcion} onChange={(e) => setIndiceOpcion(Number(e.target.value))}>
                {producto.opcionesPorciones.map((o, i) => (
                  <option key={o.etiqueta} value={i}>{o.etiqueta}</option>
                ))}
              </select>
            </div>
          )}

          <div className="d-flex align-items-center gap-3 mb-3">
            <CantidadControl valor={cantidad} onCambiar={setCantidad} max={Math.max(1, producto.stock)} />
            <small className={producto.stock <= producto.stockCritico ? "text-danger" : "text-muted"}>
              {agotado ? "Sin stock" : `Stock disponible: ${producto.stock}`}
            </small>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            <button className="btn btn-success" disabled={agotado} onClick={() => añadir(false)}>Añadir al carrito</button>
            <button className="btn btn-outline-success" disabled={agotado} onClick={() => añadir(true)}>Comprar ahora</button>
          </div>

          <h2 className="h6">Ingredientes</h2>
          <p className="text-muted">{producto.ingredientes.join(", ")}</p>
          <h2 className="h6">Alérgenos</h2>
          <p>
            {producto.alergenos.map((a) => (
              <span key={a} className="badge text-bg-warning me-1">{a}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DetalleProducto;
