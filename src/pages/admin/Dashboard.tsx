import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Dashboard: React.FC = () => {
  // Estados para métricas
  const [metricas, setMetricas] = useState({
    totalProductos: 0,
    stockCritico: 0,
    solicitudesPendientes: 0,
    totalUsuarios: 0
  });

  const [productosCriticos, setProductosCriticos] = useState<any[]>([]);
  const [solicitudesRecientes, setSolicitudesRecientes] = useState<any[]>([]);
  const [vitrina, setVitrina] = useState<any[]>([]);

  useEffect(() => {
    // Simulación de carga de datos (Reemplazar con tus Servicios reales)
    // const productos = ProductosService.obtenerProductos();
    // const solicitudes = ProductosService.obtenerSolicitudes();
    // const usuarios = AuthService.obtenerUsuarios();
    
    const mockProductos = [
      { id: 1, codigo: 'TOR-001', nombre: 'Torta Chocolate', stock: 2, stockCritico: 5, precio: 15000, imagen: '' },
      { id: 2, codigo: 'POS-002', nombre: 'Pie de Limón', stock: 10, stockCritico: 3, precio: 12000, imagen: '' }
    ];
    const mockSolicitudes = [
      { codigo: 'SOL-01', clienteNombre: 'Juan Pérez', clienteEmail: 'juan@test.com', tipoPostre: 'Torta 3 Leches', porciones: 15, fechaEntrega: '2023-11-01', estado: 'Pendiente' }
    ];

    const criticos = mockProductos.filter(p => p.stock <= p.stockCritico);
    const pendientes = mockSolicitudes.filter(s => s.estado === 'Pendiente');

    setMetricas({
      totalProductos: mockProductos.length,
      stockCritico: criticos.length,
      solicitudesPendientes: pendientes.length,
      totalUsuarios: 5 // mockUsuarios.length
    });

    setProductosCriticos(criticos);
    setSolicitudesRecientes(mockSolicitudes.slice(0, 5));
    setVitrina(mockProductos.slice(0, 4));
  }, []);

  return (
      <div className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', margin: 0, color: 'var(--color-texto-principal)' }}>Panel de Operaciones Reposteras</h1>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-texto-secundario)', fontSize: '0.95rem' }}>Resumen diario de pedidos, niveles de stock en vitrina y solicitudes.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin/productos?action=nuevo" className="btn btn-primary">➕ Nuevo Producto</Link>
            <Link to="/admin/solicitudes" className="btn btn-secondary">📋 Revisar Solicitudes</Link>
          </div>
        </div>

        {/* Tarjetas de Métricas KPI */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Productos en Catálogo</div>
            <div className="stat-value">{metricas.totalProductos}</div>
            <span style={{ fontSize: '0.8rem', color: '#2D6A4F', fontWeight: 500 }}>✓ Activos en vitrina</span>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-alerta-critico-texto)' }}>
            <div className="stat-label">Alertas de Stock Crítico</div>
            <div className="stat-value" style={{ color: 'var(--color-alerta-critico-texto)' }}>{metricas.stockCritico}</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-alerta-critico-texto)', fontWeight: 500 }}>⚠️ Requieren horneado urgente</span>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-rosado-fuerte)' }}>
            <div className="stat-label">Solicitudes de Postres</div>
            <div className="stat-value" style={{ color: 'var(--color-rosado-fuerte)' }}>{metricas.solicitudesPendientes}</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-texto-mutado)', fontWeight: 500 }}>Con 72 hrs de anticipación</span>
          </div>
          <div className="stat-card">
            <div className="stat-label">Usuarios Registrados</div>
            <div className="stat-value">{metricas.totalUsuarios}</div>
            <span style={{ fontSize: '0.8rem', color: '#2D6A4F', fontWeight: 500 }}>Clientes y colaboradores</span>
          </div>
        </div>

        {/* Alertas de Stock Crítico */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-texto-principal)' }}>
              <span>⚠️</span> Alertas de Inventario: Stock Crítico
            </h2>
          </div>
          <div>
            {productosCriticos.length === 0 ? (
              <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', padding: '1rem 1.25rem', borderRadius: 'var(--radio-md)', fontSize: '0.95rem', fontWeight: 500 }}>
                ✓ ¡Todo en orden! Todos los postres cuentan con stock por sobre el nivel crítico.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {productosCriticos.map(p => (
                  <div key={p.id} className="stock-alert-item">
                    <img src={p.imagen} alt={p.nombre} style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ color: 'var(--color-texto-principal)', display: 'block', fontSize: '0.95rem' }}>{p.nombre}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-texto-mutado)' }}>Cód: {p.codigo} | Mín: {p.stockCritico} unid.</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#FFF0F3', color: '#C9184A', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', border: '1px solid #FFCCD5' }}>{p.stock} en vitrina</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tablas Inferiores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-texto-principal)' }}>🎂 Solicitudes Recientes</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Código</th><th>Cliente</th><th>Tipo</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {solicitudesRecientes.map((s, idx) => (
                  <tr key={idx}>
                    <td><strong style={{ color: 'var(--color-rosado-fuerte)' }}>{s.codigo}</strong></td>
                    <td><div style={{ fontWeight: 500 }}>{s.clienteNombre}</div></td>
                    <td>{s.tipoPostre}</td>
                    <td><span className={`status-badge badge-pending`}>{s.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;