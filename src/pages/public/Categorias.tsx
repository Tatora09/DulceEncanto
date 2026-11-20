import React from "react";
import { Link } from "react-router-dom";
import { useCatalogo } from "../../hooks/useCatalogo";

const EMOJI_CATEGORIA: Record<string, string> = {
  Tortas: "🎂", Kuchenes: "🥧", Cupcakes: "🧁", Galletas: "🍪", Panes: "🥖",
};
const TONOS = ["", "tono-mantequilla", "", "tono-menta"];

const Categorias: React.FC = () => {
  const { productos, cargando, error } = useCatalogo();
  const conteo = new Map<string, number>();
  for (const producto of productos) conteo.set(producto.categoria, (conteo.get(producto.categoria) ?? 0) + 1);
  const filas = [...conteo.entries()].map(([nombre, cantidad]) => ({ nombre, cantidad }));

  if (cargando) return <p>Cargando categorías…</p>;

  return (
    <section className="de-section">
      <div className="de-section-header">
        <span className="de-section-tag">Nuestra carta</span>
        <h1 className="h2">Categorías</h1>
        <p>Elige tu antojo favorito.</p>
      </div>
      {filas.length === 0 ? (
        !cargando && <p className="text-muted text-center">Aún no hay categorías disponibles.</p>
      ) : (
        <div className="de-cat-grid container">
          {filas.map((f, i) => (
            <Link key={f.nombre} to={`/categorias/${encodeURIComponent(f.nombre)}`} className={"de-cat-card " + TONOS[i % TONOS.length]}>
              <span className="emoji">{EMOJI_CATEGORIA[f.nombre] ?? "🍰"}</span>
              <h3>{f.nombre}</h3>
              <small className="text-muted">{f.cantidad} {f.cantidad === 1 ? "producto" : "productos"}</small>
            </Link>
          ))}
        </div>
      )}
      {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
    </section>
  );
};

export default Categorias;
