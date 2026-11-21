import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminSidebar from "./components/AdminSidebar";
import RutaProtegida from "./components/RutaProtegida";
import { useAuth } from "./context/AuthContext";
import { rutaInicioAdmin } from "./auth/permisos";
import type { Accion, Modulo } from "./auth/permisos";

// Públicas
import Home from "./pages/public/Home";
import Productos from "./pages/public/Productos";
import DetalleProducto from "./pages/public/DetalleProducto";
import Categorias from "./pages/public/Categorias";
import CategoriaDetalle from "./pages/public/CategoriaDetalle";
import Ofertas from "./pages/public/Ofertas";
import Carrito from "./pages/public/Carrito";
import Checkout from "./pages/public/Checkout";
import PagoExitoso from "./pages/public/PagoExitoso";
import PagoError from "./pages/public/PagoError";
import Blogs from "./pages/public/Blogs";
import DetalleBlog from "./pages/public/DetalleBlog";
import Contacto from "./pages/public/Contacto";
import Nosotros from "./pages/public/Nosotros";
import Login from "./pages/public/Login";
import Registro from "./pages/public/Registro";
import MisCompras from "./pages/public/MisCompras";
import NotFound from "./pages/public/NotFound";

// Administración
import Dashboard from "./pages/admin/Dashboard";
import OrdenesAdmin from "./pages/admin/OrdenesAdmin";
import BoletaAdmin from "./pages/admin/BoletaAdmin";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import ProductoForm from "./pages/admin/ProductoForm";
import ProductosCriticos from "./pages/admin/ProductosCriticos";
import ReportesProductos from "./pages/admin/ReportesProductos";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin";
import CategoriaForm from "./pages/admin/CategoriaForm";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";
import UsuarioForm from "./pages/admin/UsuarioForm";
import HistorialCompras from "./pages/admin/HistorialCompras";
import Reportes from "./pages/admin/Reportes";
import Perfil from "./pages/admin/Perfil";

// Marco de la tienda: barra de anuncio + Navbar arriba y Footer abajo; <Outlet /> muestra la página activa
// El Home usa el ancho completo (su hero llega a los bordes); las demás páginas van en un contenedor.
const MarcoTienda: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <>
      <div className="de-announcement">🌸 Repostería artesanal hecha con ingredientes frescos.</div>
      <Navbar />
      <main className={pathname === "/" ? "" : "container py-4"}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// Marco del panel de administración: barra lateral + página activa
const MarcoAdmin: React.FC = () => (
  <div className="d-flex min-vh-100">
    <AdminSidebar />
    <main className="flex-grow-1 p-4 bg-light">
      <Outlet />
    </main>
  </div>
);

/** Cada pantalla del panel exige el permiso de su módulo (ver src/auth/permisos.ts). */
const protegida = (modulo: Modulo, elemento: React.ReactElement, accion: Accion = "ver") => (
  <RutaProtegida modulo={modulo} accion={accion}>{elemento}</RutaProtegida>
);

/** /admin lleva a la primera pantalla permitida: el vendedor no ve el dashboard. */
const AdminInicio: React.FC = () => {
  const { usuario } = useAuth();
  return <Navigate to={rutaInicioAdmin(usuario?.rol)} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Tienda (pública) */}
        <Route element={<MarcoTienda />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:id" element={<CategoriaDetalle />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-error" element={<PagoError />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-compras" element={<MisCompras />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Administración */}
        <Route path="/admin" element={<RutaProtegida><MarcoAdmin /></RutaProtegida>}>
          <Route index element={<AdminInicio />} />
          <Route path="dashboard" element={protegida("dashboard", <Dashboard />)} />

          <Route path="ordenes" element={protegida("ordenes", <OrdenesAdmin />)} />
          <Route path="ordenes/:id" element={protegida("ordenes", <BoletaAdmin />)} />

          <Route path="productos" element={protegida("productos", <ProductosAdmin />)} />
          <Route path="productos/nuevo" element={protegida("productos", <ProductoForm />, "crear")} />
          <Route path="productos/:id/editar" element={protegida("productos", <ProductoForm />, "editar")} />
          <Route path="productos/criticos" element={protegida("productos", <ProductosCriticos />)} />
          <Route path="productos/reportes" element={protegida("reportes", <ReportesProductos />)} />

          <Route path="categorias" element={protegida("categorias", <CategoriasAdmin />)} />
          <Route path="categorias/nueva" element={protegida("categorias", <CategoriaForm />, "crear")} />
          <Route path="categorias/:id/editar" element={protegida("categorias", <CategoriaForm />, "editar")} />

          <Route path="usuarios" element={protegida("usuarios", <UsuariosAdmin />)} />
          <Route path="usuarios/nuevo" element={protegida("usuarios", <UsuarioForm />, "crear")} />
          <Route path="usuarios/:id/historial" element={protegida("usuarios", <HistorialCompras />)} />

          <Route path="reportes" element={protegida("reportes", <Reportes />)} />
          <Route path="perfil" element={protegida("perfil", <Perfil />)} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;