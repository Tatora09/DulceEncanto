import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { buscarProductos } from "../../services/productsService";

const Productos: React.FC = () => {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const alCarrito = useAgregarAlCarrito();
  const productos = buscarProductos(q);

  return (
    <section>
      <h1 className="h3 mb-3">{q ? `Resultados para “${q}”` : "Nuestros productos"}</h1>
      {productos.length === 0 ? (
        <p className="text-muted">No encontramos productos con ese criterio.</p>
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

export default Productos;
