import React from "react";

interface CantidadControlProps {
  valor: number;
  onCambiar: (nuevo: number) => void;
  min?: number;
  max?: number;
}

/** Botones − / + con la cantidad en medio. No deja salir del rango [min, max]. */
const CantidadControl: React.FC<CantidadControlProps> = ({ valor, onCambiar, min = 1, max = 99 }) => (
  <div className="btn-group btn-group-sm" role="group" aria-label="Cantidad">
    <button type="button" className="btn btn-outline-secondary" aria-label="Disminuir cantidad" disabled={valor <= min} onClick={() => onCambiar(valor - 1)}>
      −
    </button>
    <span className="btn btn-light disabled px-3" data-testid="cantidad-valor" aria-live="polite">
      {valor}
    </span>
    <button type="button" className="btn btn-outline-secondary" aria-label="Aumentar cantidad" disabled={valor >= max} onClick={() => onCambiar(valor + 1)}>
      +
    </button>
  </div>
);

export default CantidadControl;
