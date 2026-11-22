import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImagenConRespaldo from "../../components/ImagenConRespaldo";
import type { Blog } from "../../types";
import { obtenerBlogPorSlug } from "../../services/productsService";

const DetalleBlog: React.FC = () => {
  const { id } = useParams(); // el id es el slug del artículo
  const [blog, setBlog] = useState<Blog | undefined>();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      if (id) setBlog(await obtenerBlogPorSlug(id));
      setCargando(false);
    })();
  }, [id]);

  if (cargando) return <p>Cargando artículo…</p>;
  if (!blog) {
    return (
      <div>
        <div className="alert alert-warning">El artículo no existe.</div>
        <Link to="/blogs">Volver al blog</Link>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: 780 }} className="mx-auto">
      <Link to="/blogs" className="btn btn-link px-0">← Volver al blog</Link>
      <span className="badge text-bg-light d-block align-self-start mb-2" style={{ width: "fit-content" }}>{blog.categoria}</span>
      <h1 className="h2">{blog.titulo}</h1>
      <p className="text-muted">{blog.autor} · {blog.fecha} · {blog.tiempoLectura}</p>
      <ImagenConRespaldo src={blog.imagen} alt={blog.titulo} className="img-fluid rounded mb-4" />
      {/* El contenido viene de los datos propios de la app (HTML ya preparado), no de usuarios. */}
      <div dangerouslySetInnerHTML={{ __html: blog.contenido }} />
    </article>
  );
};

export default DetalleBlog;
