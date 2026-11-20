import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Orden } from "../../types";
import { obtenerOrdenPorId } from "../../services/ordersService";
import DetalleOrden from "../../components/DetalleOrden";

const BoletaAdmin: React.FC = () => {
  const { id } = useParams();
  const [orden, setOrden] = useState<Orden | undefined>();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      if (id) setOrden(await obtenerOrdenPorId(id));
      setCargando(false);
    })();
  }, [id]);

  if (cargando) return <p>Cargando orden…</p>;
  if (!orden) {
    return (
      <div>
        <div className="alert alert-warning">La orden no existe.</div>
        <Link to="/admin/ordenes">Volver a órdenes</Link>
      </div>
    );
  }

  return (
    <section>
      <Link to="/admin/ordenes" className="btn btn-link px-0">← Volver a órdenes</Link>
      <h1 className="h3 mb-3">Orden {orden.numero}</h1>
      <DetalleOrden orden={orden} />
    </section>
  );
};

export default BoletaAdmin;
