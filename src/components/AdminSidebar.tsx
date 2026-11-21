import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { puede } from "../auth/permisos";
import type { Modulo } from "../auth/permisos";

const enlaces: { to: string; texto: string; modulo: Modulo }[] = [
  { to: "/admin/dashboard", texto: "Dashboard", modulo: "dashboard" },
  { to: "/admin/ordenes", texto: "Órdenes", modulo: "ordenes" },
  { to: "/admin/productos", texto: "Productos", modulo: "productos" },
  { to: "/admin/categorias", texto: "Categorías", modulo: "categorias" },
  { to: "/admin/usuarios", texto: "Usuarios", modulo: "usuarios" },
  { to: "/admin/reportes", texto: "Reportes", modulo: "reportes" },
  { to: "/admin/perfil", texto: "Perfil", modulo: "perfil" },
];

const AdminSidebar: React.FC = () => {
  const { usuario } = useAuth();
  const visibles = enlaces.filter((e) => puede(usuario?.rol, e.modulo, "ver"));
  return (
  <aside className="bg-dark text-white p-3" style={{ width: 220 }}>
    <h5 className="mb-4">{usuario?.rol === "Administrador" ? "Panel Admin" : "Panel de trabajo"}</h5>
    <ul className="nav flex-column">
      {visibles.map((e) => (
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
};

export default AdminSidebar;