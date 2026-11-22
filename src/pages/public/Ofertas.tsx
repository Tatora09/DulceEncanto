import React from "react";
import ProductCard from "../../components/ProductCard";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { useCatalogo } from "../../hooks/useCatalogo";

const Ofertas: React.FC = () => {
  const alCarrito = useAgregarAlCarrito();
  const { productos: catalogo, cargando, error } = useCatalogo();
  const productos = catalogo.filter((producto) => producto.precioOferta !== undefined);

  if (cargando) return <p>Cargando ofertas…</p>;

  return (
    <section>
      <h1 className="h3 mb-1">Ofertas</h1>
      <p className="text-muted mb-3">Aprovecha estos precios especiales por tiempo limitado.</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {productos.length === 0 ? (
        <p className="text-muted">No hay ofertas disponibles en este momento.</p>
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

export default Ofertas;
