import React from "react";
import { REGIONES_CHILE } from "../data/regiones";
import { obtenerComunas } from "../utils/validaciones";

interface SelectorRegionComunaProps {
  region: string;
  comuna: string;
  onCambio: (region: string, comuna: string) => void;
  errorRegion?: string;
  errorComuna?: string;
  prefijoId?: string;
}

/** Selects en cascada: al cambiar la región se vacía la comuna y se listan solo las de esa región. */
const SelectorRegionComuna: React.FC<SelectorRegionComunaProps> = ({
  region,
  comuna,
  onCambio,
  errorRegion,
  errorComuna,
  prefijoId = "",
}) => {
  const comunas = obtenerComunas(region);

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor={`${prefijoId}region`} className="form-label">
          Región<span className="text-danger"> *</span>
        </label>
        <select
          id={`${prefijoId}region`}
          className={"form-select" + (errorRegion ? " is-invalid" : "")}
          value={region}
          onChange={(e) => onCambio(e.target.value, "")}
        >
          <option value="">-- Seleccione Región --</option>
          {REGIONES_CHILE.map((r) => (
            <option key={r.codigo} value={r.region}>
              {r.region}
            </option>
          ))}
        </select>
        {errorRegion && <div className="invalid-feedback">{errorRegion}</div>}
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor={`${prefijoId}comuna`} className="form-label">
          Comuna<span className="text-danger"> *</span>
        </label>
        <select
          id={`${prefijoId}comuna`}
          className={"form-select" + (errorComuna ? " is-invalid" : "")}
          value={comuna}
          disabled={!region}
          onChange={(e) => onCambio(region, e.target.value)}
        >
          <option value="">-- Seleccione Comuna --</option>
          {comunas.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errorComuna && <div className="invalid-feedback">{errorComuna}</div>}
      </div>
    </div>
  );
};

export default SelectorRegionComuna;
