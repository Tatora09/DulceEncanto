import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useAgregarAlCarrito } from "../../hooks/useAgregarAlCarrito";
import { obtenerCategorias, obtenerProductos } from "../../services/productsService";

const PORTADA_POR_DEFECTO =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";

const EMOJI_CATEGORIA: Record<string, string> = {
  Tortas: "🎂",
  Kuchenes: "🥧",
  Cupcakes: "🧁",
  Galletas: "🍪",
  Panes: "🥖",
};

const TONOS = ["", "tono-mantequilla", "", "tono-menta"];

const Home: React.FC = () => {
  const alCarrito = useAgregarAlCarrito();
  const productos = obtenerProductos();
  const destacados = productos.filter((p) => p.destacado).slice(0, 3);
  const categorias = obtenerCategorias();
  const portada = destacados[0]?.imagen ?? PORTADA_POR_DEFECTO;

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
              Descubre nuestras tortas de hojarasca, kuchenes sureños, galletas horneadas hoy y nuestro exclusivo servicio de <strong>Postres Personalizados</strong> para tus celebraciones más especiales.
            </p>
            <div className="de-hero-buttons">
              <Link to="/contacto" className="de-btn de-btn-primary">🎂 Diseñar Postre a Medida</Link>
              <Link to="/productos" className="de-btn de-btn-secondary">Ver Catálogo Completo</Link>
            </div>
          </div>

          <div className="de-hero-visual">
            <div className="de-hero-img">
              <img src={portada} alt="Postre destacado de Dulce Encanto" />
            </div>
            <div className="de-hero-badge">
              <span className="icon">🍓</span>
              <div>
                <strong>Ingredientes Frescos</strong>
                <span className="sub">Fruta natural &amp; Manjar de campo</span>
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
            <span className="de-section-tag">Favoritos de la casa</span>
            <h2>Productos más solicitados</h2>
            <p>Disfruta de nuestros clásicos recién horneados.</p>
          </div>
          <div className="row g-4">
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
