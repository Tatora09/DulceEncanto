import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer className="bg-dark text-light mt-5 py-4">
    <div className="container">
      <div className="row gy-3">
        <div className="col-md-4">
          <h5>🧁 Dulce Encanto</h5>
          <p className="small mb-0">Panadería y repostería artesanal con ingredientes naturales.</p>
        </div>
        <div className="col-md-4">
          <h6>Enlaces</h6>
          <ul className="list-unstyled small mb-0">
            <li><Link to="/productos" className="link-light">Productos</Link></li>
            <li><Link to="/nosotros" className="link-light">Nosotros</Link></li>
            <li><Link to="/blogs" className="link-light">Blog</Link></li>
            <li><Link to="/contacto" className="link-light">Contacto</Link></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6>Contacto</h6>
          <p className="small mb-0">contacto@dulceencanto.cl<br />Santiago, Chile</p>
        </div>
      </div>
      <hr className="border-secondary" />
      <p className="small text-center mb-0">© {new Date().getFullYear()} Dulce Encanto. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
