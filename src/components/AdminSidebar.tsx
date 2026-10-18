import React from "react";
import { NavLink } from "react-router-dom";

const enlaces = [
  { to: "/admin/dashboard", texto: "Dashboard" },
  { to: "/admin/ordenes", texto: "Órdenes" },
  { to: "/admin/productos", texto: "Productos" },
  { to: "/admin/categorias", texto: "Categorías" },
  { to: "/admin/usuarios", texto: "Usuarios" },
  { to: "/admin/reportes", texto: "Reportes" },
  { to: "/admin/perfil", texto: "Perfil" },
];

const AdminSidebar: React.FC = () => (
  <aside className="bg-dark text-white p-3" style={{ width: 220 }}>
    <h5 className="mb-4">Panel Admin</h5>
    <ul className="nav flex-column">
      {enlaces.map((e) => (
        <li className="nav-item" key={e.to}>
          <NavLink
            to={e.to}
            className={({ isActive }) =>
              "nav-link text-white" + (isActive ? " fw-bold bg-primary rounded" : "")
            }
          >
            {e.texto}
          </NavLink>
        </li>
      ))}
    </ul>
    <hr />
    <NavLink to="/" className="btn btn-outline-light w-100">
      Ir a la tienda
    </NavLink>
  </aside>
);

export default AdminSidebar;