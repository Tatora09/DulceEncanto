import React, { useEffect, useState } from "react";

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  activa: boolean;
  orden: number;
  imagenUrl?: string;
}

export type CategoriaFormData = Omit<Categoria, "id">;

interface CategoriaFormProps {
  categoriaInicial?: Categoria | null;
  onGuardar: (data: CategoriaFormData, id?: string) => void;
  onCancelar?: () => void;
}

function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ESTADO_INICIAL: CategoriaFormData = {
  nombre: "",
  slug: "",
  descripcion: "",
  activa: true,
  orden: 1,
  imagenUrl: "",
};

export const CategoriaForm: React.FC<CategoriaFormProps> = ({
  categoriaInicial,
  onGuardar,
  onCancelar,
}) => {
  const [formData, setFormData] = useState<CategoriaFormData>(ESTADO_INICIAL);
  const [slugManual, setSlugManual] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoriaInicial) {
      const { id: _id, ...resto } = categoriaInicial;
      setFormData({
        ...ESTADO_INICIAL,
        ...resto,
        imagenUrl: resto.imagenUrl ?? "",
      });
      setSlugManual(true);
    } else {
      setFormData(ESTADO_INICIAL);
      setSlugManual(false);
    }
    setError(null);
  }, [categoriaInicial]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nombre = e.target.value;
    setFormData((prev) => ({
      ...prev,
      nombre,
      slug: slugManual ? prev.slug : generarSlug(nombre),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManual(true);
    setFormData((prev) => ({
      ...prev,
      slug: generarSlug(e.target.value),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
      return;
    }

    if (target instanceof HTMLInputElement && target.type === "number") {
      const valor = Number(target.value);
      setFormData((prev) => ({
        ...prev,
        [name]: Number.isNaN(valor) ? 0 : valor,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nombreLimpio = formData.nombre.trim();
    const slugLimpio = (formData.slug || generarSlug(nombreLimpio)).trim();

    if (!nombreLimpio) {
      setError("Debes ingresar un nombre para la categoría.");
      return;
    }

    if (!slugLimpio) {
      setError("El slug no es válido.");
      return;
    }

    setError(null);
    onGuardar(
      {
        ...formData,
        nombre: nombreLimpio,
        slug: slugLimpio,
        descripcion: formData.descripcion.trim(),
        imagenUrl: formData.imagenUrl?.trim() || undefined,
      },
      categoriaInicial?.id
    );

    if (!categoriaInicial) {
      setFormData(ESTADO_INICIAL);
      setSlugManual(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form categoria-form" noValidate>
      <h3>{categoriaInicial ? "Editar categoría" : "Nueva categoría"}</h3>

      {error && (
        <div role="alert" className="alert-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="categoria-nombre">Nombre *</label>
        <input
          id="categoria-nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleNombreChange}
          placeholder="Ej. Tortas clásicas"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoria-slug">Slug</label>
        <input
          id="categoria-slug"
          name="slug"
          type="text"
          value={formData.slug}
          onChange={handleSlugChange}
          placeholder="tortas-clasicas"
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoria-descripcion">Descripción</label>
        <textarea
          id="categoria-descripcion"
          name="descripcion"
          rows={3}
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Breve descripción de la categoría..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoria-orden">Orden</label>
        <input
          id="categoria-orden"
          name="orden"
          type="number"
          min={0}
          value={formData.orden}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoria-imagen">URL de imagen</label>
        <input
          id="categoria-imagen"
          name="imagenUrl"
          type="url"
          value={formData.imagenUrl ?? ""}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <div className="form-group form-check">
        <label>
          <input
            name="activa"
            type="checkbox"
            checked={formData.activa}
            onChange={handleChange}
          />{" "}
          Activa
        </label>
      </div>

      <div className="form-actions">
        <button type="submit">
          {categoriaInicial ? "Actualizar" : "Guardar categoría"}
        </button>
        {onCancelar && (
          <button type="button" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoriaForm;