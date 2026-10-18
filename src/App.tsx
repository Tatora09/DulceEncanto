import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

// Públicas
import Home from './pages/public/Home';
import Productos from './pages/public/Productos';
import DetalleProducto from './pages/public/DetalleProducto';
import Categorias from './pages/public/Categorias';
import CategoriaDetalle from './pages/public/CategoriaDetalle';
import Ofertas from './pages/public/Ofertas';
import Carrito from './pages/public/Carrito';
import Checkout from './pages/public/Checkout';
import PagoExitoso from './pages/public/PagoExitoso';
import PagoError from './pages/public/PagoError';
import Blogs from './pages/public/Blogs';
import DetalleBlog from './pages/public/DetalleBlog';
import Contacto from './pages/public/Contacto';
import Nosotros from './pages/public/Nosotros';
import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import NotFound from './pages/public/NotFound';

// Admin
import Dashboard from './pages/admin/Dashboard';
import OrdenesAdmin from './pages/admin/OrdenesAdmin';
import BoletaAdmin from './pages/admin/BoletaAdmin';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import ProductoForm from './pages/admin/ProductoForm';
import ProductosCriticos from './pages/admin/ProductosCriticos';
import ReportesProductos from './pages/admin/ReportesProductos';
import CategoriasAdmin from './pages/admin/CategoriasAdmin';
import CategoriaForm from './pages/admin/CategoriaForm';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import UsuarioForm from './pages/admin/UsuarioForm';
import HistorialCompras from './pages/admin/HistorialCompras';
import Reportes from './pages/admin/Reportes';
import Perfil from './pages/admin/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* Tienda (pública) */}
        <Route element={<PublicLayout />}>
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
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="ordenes" element={<OrdenesAdmin />} />
          <Route path="ordenes/:id" element={<BoletaAdmin />} />

          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="productos/nuevo" element={<ProductoForm />} />
          <Route path="productos/:id/editar" element={<ProductoForm />} />
          <Route path="productos/criticos" element={<ProductosCriticos />} />
          <Route path="productos/reportes" element={<ReportesProductos />} />

          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="categorias/nueva" element={<CategoriaForm />} />
          <Route path="categorias/:id/editar" element={<CategoriaForm />} />

          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="usuarios/nuevo" element={<UsuarioForm />} />
          <Route path="usuarios/:id/editar" element={<UsuarioForm />} />
          <Route path="usuarios/:id/historial" element={<HistorialCompras />} />

          <Route path="reportes" element={<Reportes />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;