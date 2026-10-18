import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatearPrecio } from "../services/productsService";

const Navbar: React.FC = () => {
  const { cantidadTotal, total } = useCart();
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const cerrar = () => setAbierto(false);
  const claseLink = ({ isActive }: { isActive: boolean }) => "nav-link" + (isActive ? " active fw-bold" : "");

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(busqueda.trim() ? `/productos?q=${encodeURIComponent(busqueda.trim())}` : "/productos");
    cerrar();
  };

  return (
    <header className="bg-white shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg container">
        <Link to="/" className="navbar-brand fw-bold" onClick={cerrar}>
          🧁 Dulce Encanto
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={"collapse navbar-collapse" + (abierto ? " show" : "")}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink to="/" end className={claseLink} onClick={cerrar}>Home</NavLink></li>
            <li className="nav-item"><NavLink to="/productos" className={claseLink} onClick={cerrar}>Productos</NavLink></li>
            <li className="nav-item"><NavLink to="/categorias" className={claseLink} onClick={cerrar}>Categorías</NavLink></li>
            <li className="nav-item"><NavLink to="/ofertas" className={claseLink} onClick={cerrar}>Ofertas</NavLink></li>
            <li className="nav-item"><NavLink to="/nosotros" className={claseLink} onClick={cerrar}>Nosotros</NavLink></li>
            <li className="nav-item"><NavLink to="/blogs" className={claseLink} onClick={cerrar}>Blog</NavLink></li>
            <li className="nav-item"><NavLink to="/contacto" className={claseLink} onClick={cerrar}>Contacto</NavLink></li>
          </ul>

          <form className="d-flex me-lg-3 mb-2 mb-lg-0" role="search" onSubmit={buscar}>
            <input
              type="search"
              className="form-control me-2"
              placeholder="Buscar"
              aria-label="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
          </form>

          <div className="d-flex gap-2 align-items-center">
            <Link to="/carrito" className="btn btn-success position-relative" onClick={cerrar}>
              🛒 Carrito {formatearPrecio(total)}
              {cantidadTotal > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cantidadTotal}
                </span>
              )}
            </Link>
            <Link to="/login" className="btn btn-outline-primary" onClick={cerrar}>Iniciar Sesión</Link>
            <Link to="/registro" className="btn btn-primary" onClick={cerrar}>Crear Cuenta</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
