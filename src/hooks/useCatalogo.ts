import { useCallback, useEffect, useState } from "react";
import type { Producto } from "../types";
import { obtenerProductos } from "../services/productsService";

export function useCatalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      setProductos(await obtenerProductos());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los productos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { productos, cargando, error, recargar };
}
