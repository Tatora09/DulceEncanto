import React from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../types";
import { formatearPrecio, precioVigente } from "../services/productsService";

interface ProductCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

/** Tarjeta de producto: solo muestra datos y avisa con onAgregar (no conoce el carrito). */
const ProductCard: React.FC<ProductCardProps> = ({ producto, onAgregar }) => {
  const enOferta = precioVigente(producto) < producto.precio;
  const agotado = producto.stock <= 0;

  return (
    <div className="card h-100 shadow-sm" data-testid="product-card">
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} style={{ objectFit: "cover", height: 200 }} />
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light align-self-start mb-2">{producto.categoria}</span>
        <h5 className="card-title">
          <Link to={`/producto/${producto.id}`} className="text-decoration-none text-dark">
            {producto.nombre}
          </Link>
        </h5>
        <p className="card-text text-muted small flex-grow-1">{producto.porciones}</p>

        <div className="mb-2">
          {enOferta && <small className="text-muted text-decoration-line-through me-2">{formatearPrecio(producto.precio)}</small>}
          <strong className="fs-5">{formatearPrecio(precioVigente(producto))}</strong>
        </div>

        {producto.stock > 0 && producto.stock <= producto.stockCritico && (
          <small className="text-danger mb-2">¡Quedan solo {producto.stock}!</small>
        )}

        <button className="btn btn-success mt-auto" disabled={agotado} onClick={() => onAgregar(producto)}>
          {agotado ? "Agotado" : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
