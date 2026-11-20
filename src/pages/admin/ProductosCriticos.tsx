import React, { useEffect, useMemo, useState } from "react";
import "./Admin.css";

export interface ProductoCriticoItem {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  stockCritico?: number;
  activo?: boolean;
}

const STORAGE_KEYS_CANDIDATOS = [
  "dulce_encanto_productos",
  "productos",
  "products",
];

const PRODUCTOS_EJEMPLO: ProductoCriticoItem[] = [
  {
    id: "prod-1",
    nombre: "Torta Tres Leches Artesanal",
    categoria: "Tortas y Pasteles",
    precio: 24990,
    stock: 2,
    stockCritico: 5,
    activo: true,
  },
  {
    id: "prod-2",
    nombre: "Cheesecake Frutos Rojos",
    categoria: "Tortas y Pasteles",
    precio: 22990,
    stock: 0,
    stockCritico: 4,
    activo: true,
  },
  {
    id: "prod-3",
    nombre: "Brownie con Nueces",
    categoria: "Postres Individuales",
    precio: 3490,
    stock: 3,
    stockCritico: 8,
    activo: true,
  },
];

function leerProductosDesdeStorage(): {
  items: ProductoCriticoItem[];
  storageKey: string;
} {
  for (const key of STORAGE_KEYS_CANDIDATOS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalizados: ProductoCriticoItem[] = parsed.map((p, idx) => ({
          id: String(p.id ?? `prod-${idx + 1}`),
          nombre: String(p.nombre ?? p.name ?? "Producto sin nombre"),
          categoria: String(p.categoria ?? p.category ?? "General"),
          precio: Number(p.precio ?? p.price ?? 0),
          stock: Number(p.stock ?? 0),
          stockCritico:
            p.stockCritico !== undefined ? Number(p.stockCritico) : 5,
          activo: p.activo !== undefined ? Boolean(p.activo) : true,
        }));
        return { items: normalizados, storageKey: key };
      }
    } catch {
      // Continuar con la siguiente clave candidata
    }
  }
  return {
    items: PRODUCTOS_EJEMPLO,
    storageKey: STORAGE_KEYS_CANDIDATOS[0],
  };
}

function formatCLP(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(monto);
}

export const ProductosCriticos: React.FC = () => {
  const [{ items: productosIniciales, storageKey }] = useState(
    leerProductosDesdeStorage
  );
  const [productos, setProductos] =
    useState<ProductoCriticoItem[]>(productosIniciales);
  const [filtro, setFiltro] = useState<"todos_criticos" | "agotados" | "bajos">(
    "todos_criticos"
  );
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(productos));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [productos, storageKey]);

  const ajustarStock = (id: string, delta: number) => {
    setProductos((prev) =>
      prev.map((prod) => {
        if (prod.id !== id) return prod;
        const nuevoStock = Math.max(0, prod.stock + delta);
        return { ...prod, stock: nuevoStock };
      })
    );
  };

  const establecerStock = (id: string, valor: number) => {
    const limpio = Number.isNaN(valor) ? 0 : Math.max(0, Math.floor(valor));
    setProductos((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, stock: limpio } : prod))
    );
  };

  const listaCritica = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return productos
      .filter((p) => {
        const umbral = p.stockCritico ?? 5;
        const esAgotado = p.stock === 0;
        const esCritico = p.stock <= umbral;

        if (!esCritico) return false;
        if (filtro === "agotados" && !esAgotado) return false;
        if (filtro === "bajos" && (esAgotado || !esCritico)) return false;

        if (!q) return true;
        return (
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.stock - b.stock || a.nombre.localeCompare(b.nombre));
  }, [productos, filtro, busqueda]);

  const totalAgotados = productos.filter((p) => p.stock === 0).length;
  const totalBajos = productos.filter(
    (p) => p.stock > 0 && p.stock <= (p.stockCritico ?? 5)
  ).length;

  return (
    <section className="admin-section productos-criticos">
      <div className="admin-header">
        <h2>Productos en Stock Crítico</h2>
        <p>
          Revisa unidades agotadas o por debajo del umbral mínimo y repón
          stock rápido.
        </p>
      </div>

      <div className="admin-filters">
        <input
          type="search"
          placeholder="Buscar producto o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtro}
          onChange={(e) =>
            setFiltro(
              e.target.value as "todos_criticos" | "agotados" | "bajos"
            )
          }
        >
          <option value="todos_criticos">
            Todos críticos ({totalAgotados + totalBajos})
          </option>
          <option value="agotados">Agotados ({totalAgotados})</option>
          <option value="bajos">Stock bajo ({totalBajos})</option>
        </select>
      </div>

      {listaCritica.length === 0 ? (
        <p className="empty-message">
          No hay productos críticos bajo el filtro seleccionado.
        </p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Umbral</th>
                <th>Stock actual</th>
                <th>Estado</th>
                <th>Reposición rápida</th>
              </tr>
            </thead>
            <tbody>
              {listaCritica.map((prod) => {
                const umbral = prod.stockCritico ?? 5;
                const agotado = prod.stock === 0;
                return (
                  <tr key={prod.id}>
                    <td>
                      <strong>{prod.nombre}</strong>
                    </td>
                    <td>{prod.categoria}</td>
                    <td>{formatCLP(prod.precio)}</td>
                    <td>{umbral}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        value={prod.stock}
                        onChange={(e) =>
                          establecerStock(prod.id, Number(e.target.value))
                        }
                        style={{ width: "72px" }}
                      />
                    </td>
                    <td>
                      <span>{agotado ? "Agotado" : "Stock bajo"}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => ajustarStock(prod.id, -1)}
                        disabled={prod.stock <= 0}
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => ajustarStock(prod.id, 1)}
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => ajustarStock(prod.id, 5)}
                      >
                        +5
                      </button>
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

export default ProductosCriticos;