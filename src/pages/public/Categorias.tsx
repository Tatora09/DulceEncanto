import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCategorias, obtenerProductosPorCategoria } from "../../services/productsService";

const EMOJI_CATEGORIA: Record<string, string> = {
  Tortas: "🎂", Kuchenes: "🥧", Cupcakes: "🧁", Galletas: "🍪", Panes: "🥖",
};
const TONOS = ["", "tono-mantequilla", "", "tono-menta"];

interface Fila { nombre: string; cantidad: number }

const Categorias: React.FC = () => {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const nombres = await obtenerCategorias();
      const datos: Fila[] = [];
      for (const nombre of nombres) datos.push({ nombre, cantidad: (await obtenerProductosPorCategoria(nombre)).length });
      setFilas(datos);
      setCargando(false);
    })();
  }, []);

  if (cargando) return <p>Cargando categorías…</p>;

  return (
    <section className="de-section">
      <div className="de-section-header">
        <span className="de-section-tag">Nuestra carta</span>
        <h1 className="h2">Categorías</h1>
        <p>Elige tu antojo favorito.</p>
      </div>
      {filas.length === 0 ? (
        <p className="text-muted text-center">Aún no hay categorías disponibles.</p>
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
    </section>
  );
};

export default Categorias;
