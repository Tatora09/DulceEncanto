import React from "react";
import { useAuth } from "../../context/AuthContext";

const Perfil: React.FC = () => {
  const { usuario } = useAuth();

  if (!usuario) return <div className="alert alert-warning">No hay una sesión activa.</div>;

  const datos: [string, string][] = [
    ["Nombre", usuario.nombre],
    ["Correo", usuario.email],
    ["Rol", usuario.rol],
  ];

  return (
    <section style={{ maxWidth: 640 }}>
      <h1 className="h3 mb-3">Mi perfil</h1>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">{usuario.nombre}</h2>
            <span className="badge bg-dark">{usuario.rol}</span>
          </div>
          <dl className="row mb-0">
            {datos.map(([etiqueta, valor]) => (
              <React.Fragment key={etiqueta}>
                <dt className="col-sm-4">{etiqueta}</dt>
                <dd className="col-sm-8">{valor}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      </div>
      <p className="small text-muted mt-3">El backend todavía no incluye un endpoint para editar el perfil.</p>
    </section>
  );
};

export default Perfil;
