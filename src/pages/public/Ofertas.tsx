import React, { useEffect, useState } from "react";
import type { Producto } from "../../types";
import ProductCard from "../../components/ProductCard";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { obtenerOfertas } from "../../services/productsService";

const Ofertas: React.FC = () => {
  const alCarrito = useAgregarAlCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      setProductos(await obtenerOfertas());
      setCargando(false);
    })();
  }, []);

  if (cargando) return <p>Cargando ofertas…</p>;

  return (
    <section>
      <h1 className="h3 mb-1">Ofertas</h1>
      <p className="text-muted mb-3">Precios especiales por tiempo limitado.</p>
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
