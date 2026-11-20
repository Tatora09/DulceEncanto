import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../../types";
import { obtenerUsuarios } from "../../services/authService";
import { useCatalogo } from "../../hooks/useCatalogo";
import "./Admin.css";

const Dashboard: React.FC = () => {
  const { productos, cargando, error: errorCatalogo } = useCatalogo();
  const [totalUsuarios, setTotalUsuarios] = useState<number>();
  const [errorUsuarios, setErrorUsuarios] = useState("");

  useEffect(() => {
    obtenerUsuarios()
      .then((usuarios) => setTotalUsuarios(usuarios.length))
      .catch((error: unknown) =>
        setErrorUsuarios(error instanceof Error ? error.message : "No se pudieron cargar los usuarios."),
      );
  }, []);

  const productosCriticos: Producto[] = productos.filter((producto) => producto.stock <= producto.stockCritico);

  return (
    <div className="admin-main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", margin: 0, color: "var(--color-texto-principal)" }}>Panel de administración</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "var(--color-texto-secundario)", fontSize: "0.95rem" }}>Productos, inventario y usuarios conectados al backend.</p>
        </div>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>
      </div>

      {(errorCatalogo || errorUsuarios) && (
        <div className="alert alert-danger" role="alert">{errorCatalogo || errorUsuarios}</div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Productos del catálogo</div>
          <div className="stat-value">{cargando ? "…" : productos.length}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--color-alerta-critico-texto)" }}>
          <div className="stat-label">Productos con stock bajo (≤ 5)</div>
          <div className="stat-value" style={{ color: "var(--color-alerta-critico-texto)" }}>{cargando ? "…" : productosCriticos.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Usuarios registrados</div>
          <div className="stat-value">{totalUsuarios ?? "…"}</div>
        </div>
      </div>

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-texto-principal)" }}>Alertas de inventario</h2>
        {cargando ? <p>Cargando productos…</p> : productosCriticos.length === 0 ? (
          <div className="alert alert-success">No hay productos con cinco o menos unidades.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {productosCriticos.map((producto) => (
              <div key={producto.id} className="stock-alert-item">
                {producto.imagen && <img src={producto.imagen} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover" }} />}
                <div style={{ flexGrow: 1 }}>
                  <strong style={{ display: "block" }}>{producto.nombre}</strong>
                  <span className="small text-muted">ID: {producto.id}</span>
                </div>
                <span className="badge bg-danger">{producto.stock} en stock</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="small text-muted mt-4">
        El backend todavía no incluye solicitudes de postres personalizados ni precios promocionales; esas métricas no se muestran aquí.
      </p>
    </div>
  );
};

export default Dashboard;
