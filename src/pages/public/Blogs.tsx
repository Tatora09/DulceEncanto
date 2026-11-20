import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Blog } from "../../types";
import { obtenerBlogs } from "../../services/productsService";

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      setBlogs(await obtenerBlogs());
      setCargando(false);
    })();
  }, []);

  if (cargando) return <p>Cargando artículos…</p>;

  return (
    <section>
      <h1 className="h3 mb-1">Blog</h1>
      <p className="text-muted mb-4">Consejos, recetas y novedades de nuestra pastelería.</p>
      <div className="row g-4">
        {blogs.map((b) => (
          <div className="col-12 col-md-6 col-lg-4" key={b.id}>
            <article className="card h-100 shadow-sm">
              <img src={b.imagen} alt={b.titulo} className="card-img-top" style={{ objectFit: "cover", height: 190 }} />
              <div className="card-body d-flex flex-column">
                <span className="badge text-bg-light align-self-start mb-2">{b.categoria}</span>
                <h2 className="h5">{b.titulo}</h2>
                <p className="text-muted small flex-grow-1">{b.resumen}</p>
                <small className="text-muted d-block mb-2">{b.autor} · {b.fecha} · {b.tiempoLectura}</small>
                <Link to={`/blogs/${b.slug}`} className="btn btn-outline-primary btn-sm align-self-start">Leer artículo</Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
