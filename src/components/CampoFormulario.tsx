import React from "react";

interface CampoFormularioProps {
  id: string;
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  error?: string;
  tipo?: "text" | "email" | "tel" | "date" | "password";
  requerido?: boolean;
  placeholder?: string;
  multilinea?: boolean;
}

/** Input o textarea de Bootstrap con su etiqueta y mensaje de error (solo si hay error). */
const CampoFormulario: React.FC<CampoFormularioProps> = ({
  id,
  etiqueta,
  valor,
  onCambio,
  error,
  tipo = "text",
  requerido = false,
  placeholder,
  multilinea = false,
}) => {
  const comunes = {
    id,
    className: "form-control" + (error ? " is-invalid" : ""),
    value: valor,
    placeholder,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
        {requerido && <span className="text-danger"> *</span>}
      </label>
      {multilinea ? (
        <textarea rows={3} {...comunes} onChange={(e) => onCambio(e.target.value)} />
      ) : (
        <input type={tipo} {...comunes} onChange={(e) => onCambio(e.target.value)} />
      )}
      {error && (
        <div id={`${id}-error`} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};

export default CampoFormulario;
