import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroStock, setFiltroStock] = useState('Todos');
  
  // Estado para el modal de CRUD
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    id: '', codigo: '', nombre: '', categoria: 'Tortas Tradicionales', precio: 0, porciones: '', stock: 0, stockCritico: 0, descripcion: '', imagen: '', destacado: false
  });

  useEffect(() => {
    // Aquí debes cargar los datos desde tu Contexto o LocalStorage
    // setProductos(ProductosService.obtenerProductos());
  }, []);

  const abrirModal = (producto = null) => {
    if (producto) {
      setFormData(producto);
    } else {
      setFormData({ id: '', codigo: '', nombre: '', categoria: 'Tortas Tradicionales', precio: 0, porciones: '', stock: 0, stockCritico: 0, descripcion: '', imagen: '', destacado: false });
    }
    setModalAbierto(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const guardarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí llamas a tu función de guardado/actualización (CRUD)
    console.log("Guardando:", formData);
    setModalAbierto(false);
  };

  const eliminarProducto = (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el postre "${nombre}"?`)) {
      // Llamada al servicio de eliminación
      console.log("Eliminar ID:", id);
    }
  };

  // Filtrado de la tabla en tiempo real
  const productosFiltrados = productos.filter(p => {
    const cumpleBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCat = filtroCategoria === 'Todos' || p.categoria === filtroCategoria;
    const cumpleStock = filtroStock === 'Todos' || (filtroStock === 'Critico' ? p.stock <= p.stockCritico : p.stock > p.stockCritico);
    return cumpleBusqueda && cumpleCat && cumpleStock;
  });

  return (
    <>
      <div className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', margin: 0, color: 'var(--color-texto-principal)' }}>Catálogo e Inventario</h1>
          </div>
          <button className="btn btn-primary" onClick={() => abrirModal()}>➕ Nuevo Postre</button>
        </div>

        {/* Filtros */}
        <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center' }}>
            <input type="text" placeholder="🔍 Buscar por nombre o código..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ padding: '0.6rem 1rem', border: '1px solid var(--borde-suave)', borderRadius: '6px' }} />
            
            <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} style={{ padding: '0.6rem 1rem', border: '1px solid var(--borde-suave)', borderRadius: '6px' }}>
              <option value="Todos">Todas las Categorías</option>
              <option value="Tortas Tradicionales">Tortas Tradicionales</option>
              <option value="Tortas en Fondant">Tortas en Fondant</option>
            </select>

            <select value={filtroStock} onChange={e => setFiltroStock(e.target.value)} style={{ padding: '0.6rem 1rem', border: '1px solid var(--borde-suave)', borderRadius: '6px' }}>
              <option value="Todos">Todo el Stock</option>
              <option value="Critico">⚠️ Solo Stock Crítico</option>
              <option value="Normal">✓ Stock Normal</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre del Postre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock / Mínimo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No hay productos.</td></tr>
              ) : (
                productosFiltrados.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.codigo}</strong></td>
                    <td>{p.nombre}</td>
                    <td><span className="tag-badge">{p.categoria}</span></td>
                    <td>${p.precio}</td>
                    <td>
                      <span className={`stock-badge ${p.stock <= p.stockCritico ? 'stock-critical' : 'stock-ok'}`}>
                        {p.stock} un. (Mín: {p.stockCritico})
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => abrirModal(p)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(p.id, p.nombre)}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD en React */}
      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '680px', borderRadius: 'var(--radio-md)', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setModalAbierto(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h2>{formData.id ? 'Editar Postre' : 'Agregar Nuevo Postre'}</h2>
            
            <form onSubmit={guardarProducto}>
              <div className="form-group">
                <label>Código:</label>
                <input type="text" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Productos;