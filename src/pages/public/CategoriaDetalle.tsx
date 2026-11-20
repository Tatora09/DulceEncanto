import React from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { useCatalogo } from "../../hooks/useCatalogo";

const CategoriaDetalle: React.FC = () => {
  const { id } = useParams(); // el id es el nombre de la categoría
  const alCarrito = useAgregarAlCarrito();
  const { productos: catalogo, cargando, error } = useCatalogo();
  const productos = catalogo.filter((producto) => producto.categoria === id);

  if (cargando) return <p>Cargando productos…</p>;

  return (
    <section>
      <Link to="/categorias" className="btn btn-link px-0">← Todas las categorías</Link>
      <h1 className="h3 mb-3">{id}</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {productos.length === 0 ? (
        !cargando && <p className="text-muted">Por ahora no hay productos en esta categoría.</p>
      ) : (
        <div className="row g-4">
          {productos.map((p) => (
            <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
              <ProductCard producto={p} onAgregar={alCarrito} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriaDetalle;
