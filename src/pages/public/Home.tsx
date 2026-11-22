import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import ImagenConRespaldo from "../../components/ImagenConRespaldo";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { useCatalogo } from "../../hooks/useCatalogo";
import { formatearPrecio } from "../../services/productsService";

const PORTADA_POR_DEFECTO =
  "/images/postre-placeholder.svg";

const EMOJI_CATEGORIA: Record<string, string> = {
  Tortas: "🎂",
  Chocolates: "🍫",
  Kuchenes: "🥧",
  Cupcakes: "🧁",
  Galletas: "🍪",
  Panes: "🥖",
  Panadería: "🥖",
  Panaderia: "🥖",
};

const TONOS = ["", "tono-mantequilla", "", "tono-menta"];

const Home: React.FC = () => {
  const alCarrito = useAgregarAlCarrito();
  const { productos, cargando, error } = useCatalogo();
  const tortaTresLeches = productos.find(
    (producto) => producto.nombre.trim().toLocaleLowerCase("es") === "torta tres leches",
  );
  const destacadosCatalogo = productos.filter((p) => p.destacado);
  const productosParaMostrar = destacadosCatalogo.length ? destacadosCatalogo : productos;
  const destacados = tortaTresLeches
    ? [tortaTresLeches, ...productosParaMostrar.filter((producto) => producto.id !== tortaTresLeches.id)].slice(0, 3)
    : productosParaMostrar.slice(0, 3);
  const categorias = [...new Set(productos.map((producto) => producto.categoria))].sort((a, b) => a.localeCompare(b, "es"));
  const portada = tortaTresLeches?.imagen.trim() ? tortaTresLeches.imagen : PORTADA_POR_DEFECTO;
  const textoStock = !tortaTresLeches
    ? "Descubre nuestros productos artesanales"
    : tortaTresLeches.stock <= 0
      ? "Agotada temporalmente"
      : tortaTresLeches.stock <= tortaTresLeches.stockCritico
        ? `¡Quedan solo ${tortaTresLeches.stock}!`
        : `${tortaTresLeches.stock} disponibles`;

  return (
    <>
      {/* Hero */}
      <section className="de-hero">
        <div className="de-hero-grid">
          <div>
            <div className="de-hero-tag">🍰 Repostería 100% Artesanal y Tradicional</div>
            <h1 className="de-hero-title">
              Momentos dulces hechos con <span>amor y dedicación</span>
            </h1>
            <p className="de-hero-subtitle">
              Descubre nuestras tortas, chocolates, panes y galletas artesanales, preparados para compartir en tus momentos más especiales.
            </p>
            <div className="de-hero-buttons">
              <Link to="/contacto" className="de-btn de-btn-primary">🎂 Diseñar Postre a Medida</Link>
              <Link to="/productos" className="de-btn de-btn-secondary">Ver Catálogo Completo</Link>
            </div>
          </div>

          <div className="de-hero-visual">
            <div className="de-hero-img">
              <ImagenConRespaldo
                src={portada}
                alt={tortaTresLeches?.nombre ?? "Postre artesanal de Dulce Encanto"}
              />
            </div>
            <div className="de-hero-badge">
              <span className="icon">🎂</span>
              <div className="de-hero-badge-content">
                <span className="de-hero-badge-eyebrow">Especial de la casa</span>
                <strong>{tortaTresLeches?.nombre ?? "Repostería artesanal"}</strong>
                <span className="de-hero-badge-description">
                  {tortaTresLeches?.descripcion ?? "Preparada artesanalmente para compartir momentos dulces."}
                </span>
                <span className="sub">
                  {textoStock}{tortaTresLeches && ` · ${formatearPrecio(tortaTresLeches.precio)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="de-section container">
        <div className="de-section-header">
          <span className="de-section-tag">Nuestras especialidades</span>
          <h2>Explora lo que horneamos hoy para ti</h2>
          <p>Cada receta ha sido perfeccionada en nuestros hornos artesanales.</p>
        </div>
        <div className="de-cat-grid">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {cargando && <p className="text-muted">Cargando catálogo…</p>}
          {categorias.map((c, i) => (
            <Link
              key={c}
              to={`/categorias/${encodeURIComponent(c)}`}
              className={"de-cat-card " + TONOS[i % TONOS.length]}
            >
              <span className="emoji">{EMOJI_CATEGORIA[c] ?? "🍰"}</span>
              <h3>{c}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="de-section de-section-alt">
        <div className="container">
          <div className="de-section-header">
            <span className="de-section-tag">Delicias de nuestro catálogo</span>
            <h2>Productos disponibles</h2>
            <p>Encuentra tus favoritos entre nuestras preparaciones artesanales.</p>
          </div>
          <div className="row g-4">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {cargando && <p className="text-muted">Cargando productos…</p>}
            {destacados.map((p) => (
              <div className="col-12 col-md-6 col-lg-4" key={p.id}>
                <ProductCard producto={p} onAgregar={alCarrito} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/productos" className="de-btn de-btn-secondary">Ver todo el catálogo →</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
