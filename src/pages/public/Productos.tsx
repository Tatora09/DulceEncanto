import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { useCatalogo } from "../../hooks/useCatalogo";

const Productos: React.FC = () => {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const alCarrito = useAgregarAlCarrito();
  const { productos: catalogo, cargando, error } = useCatalogo();
  const productos = useMemo(() => {
    const texto = q.trim().toLowerCase();
    if (!texto) return catalogo;
    return catalogo.filter((producto) =>
      [producto.nombre, producto.categoria, producto.descripcion].some((campo) => campo.toLowerCase().includes(texto)),
    );
  }, [catalogo, q]);

  return (
    <section>
      <h1 className="h3 mb-3">{q ? `Resultados para “${q}”` : "Nuestros productos"}</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {cargando && <p>Cargando productos…</p>}
      {productos.length === 0 ? (
        !cargando && <p className="text-muted">No encontramos productos con ese criterio.</p>
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
