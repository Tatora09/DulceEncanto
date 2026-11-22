import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImagenConRespaldo from "../../components/ImagenConRespaldo";
import type { Producto } from "../../types";
import {
  eliminarProducto,
  formatearPrecio,
  precioVigente,
} from "../../services/productsService";
import { useCatalogo } from "../../hooks/useCatalogo";
import { useAuth } from "../../context/AuthContext";
import { puede } from "../../auth/permisos";

const ProductosAdmin: React.FC = () => {
  const catalogo = useCatalogo();
  const { usuario } = useAuth();
  const puedeCrear = puede(usuario?.rol, "productos", "crear");
  const puedeEditar = puede(usuario?.rol, "productos", "editar");
  const puedeEliminar = puede(usuario?.rol, "productos", "eliminar");
  const { productos, cargando, error } = catalogo;
  const [errorAccion, setErrorAccion] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroStock, setFiltroStock] = useState("Todos");

  const eliminar = async (p: Producto) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      setErrorAccion("");
      await eliminarProducto(p.id);
      await catalogo.recargar();
    } catch (e) {
      setErrorAccion(e instanceof Error ? e.message : "No se pudo eliminar el producto.");
    }
  };

  const categorias = [...new Set(productos.map((p) => p.categoria))].sort();

  const filtrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();
    const cumpleTexto = p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto);
    const cumpleCategoria = filtroCategoria === "Todas" || p.categoria === filtroCategoria;
    const critico = p.stock <= p.stockCritico;
    const cumpleStock =
      filtroStock === "Todos" || (filtroStock === "Critico" ? critico : !critico);
    return cumpleTexto && cumpleCategoria && cumpleStock;
  });

  if (cargando) return <p>Cargando productos…</p>;

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <div className="d-flex gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-danger">Stock crítico</Link>
          {puedeCrear && <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {errorAccion && <div className="alert alert-danger" role="alert">{errorAccion}</div>}

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            className="form-control"
            placeholder="Buscar por nombre o código"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todas">Todas las categorías</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={filtroStock} onChange={(e) => setFiltroStock(e.target.value)}>
            <option value="Todos">Todo el stock</option>
            <option value="Critico">Stock crítico</option>
            <option value="Normal">Stock normal</option>
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="text-muted">No hay productos que coincidan.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead>
              <tr>
                <th />
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const critico = p.stock <= p.stockCritico;
                const enOferta = precioVigente(p) < p.precio;
                return (
                  <tr key={p.id}>
                    <td>
                      <ImagenConRespaldo src={p.imagen} alt="" width={48} height={48} style={{ objectFit: "cover", borderRadius: 8 }} />
                    </td>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>
                      {enOferta ? <strong>{formatearPrecio(precioVigente(p))}</strong> : formatearPrecio(p.precio)}
                    </td>
                    <td>
                      <span className={`badge ${critico ? "bg-danger" : "bg-success"}`}>{p.stock}</span>
                    </td>
                    <td className="text-end text-nowrap">
                      {puedeEditar && <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>}
                      {puedeEliminar && <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p)}>Eliminar</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProductosAdmin;
