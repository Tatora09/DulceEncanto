import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <section className="text-center py-5">
    <div style={{ fontSize: "4rem" }}>🍪</div>
    <h1 className="h2">Página no encontrada</h1>
    <p className="text-muted">La página que buscas no existe o fue movida.</p>
    <Link to="/" className="de-btn de-btn-primary">Volver al inicio</Link>
  </section>
);

export default NotFound;
