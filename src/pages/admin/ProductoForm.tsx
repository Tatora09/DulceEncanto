import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Producto } from "../../types";
import CampoFormulario from "../../components/CampoFormulario";
import {
  guardarProducto,
  obtenerCategorias,
  obtenerProductoPorId,
  obtenerProductos,
} from "../../services/productsService";

interface Formulario {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: string;
  precioOferta: string;
  stock: string;
  stockCritico: string;
  porciones: string;
  descripcion: string;
  ingredientes: string;
  alergenos: string;
  imagen: string;
  destacado: boolean;
}

const VACIO: Formulario = {
  codigo: "", nombre: "", categoria: "", precio: "", precioOferta: "", stock: "0", stockCritico: "5",
  porciones: "", descripcion: "", ingredientes: "", alergenos: "", imagen: "", destacado: false,
};

const aLista = (texto: string) => texto.split(",").map((t) => t.trim()).filter(Boolean);

const ProductoForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState<Formulario>(VACIO);
  const [original, setOriginal] = useState<Producto | undefined>();
  const [categorias, setCategorias] = useState<string[]>([]);
  const [errores, setErrores] = useState<Partial<Record<keyof Formulario, string>>>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    (async () => {
      setCategorias(await obtenerCategorias());
      if (id) {
        const p = await obtenerProductoPorId(id);
        if (p) {
          setOriginal(p);
          setForm({
            codigo: p.codigo, nombre: p.nombre, categoria: p.categoria,
            precio: String(p.precio), precioOferta: p.precioOferta !== undefined ? String(p.precioOferta) : "",
            stock: String(p.stock), stockCritico: String(p.stockCritico),
            porciones: p.porciones, descripcion: p.descripcion,
            ingredientes: p.ingredientes.join(", "), alergenos: p.alergenos.join(", "),
            imagen: p.imagen, destacado: Boolean(p.destacado),
          });
        }
      }
      setCargando(false);
    })();
  }, [id]);

  const cambiar = (campo: keyof Formulario) => (valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

  const validar = async (): Promise<boolean> => {
    const e: Partial<Record<keyof Formulario, string>> = {};
    const precio = Number(form.precio);
    const stock = Number(form.stock);
    const critico = Number(form.stockCritico);

    if (!form.codigo.trim()) e.codigo = "El código es obligatorio.";
    else {
      const existentes = await obtenerProductos();
      if (existentes.some((p) => p.codigo.toLowerCase() === form.codigo.trim().toLowerCase() && p.id !== original?.id))
        e.codigo = "Ya existe un producto con ese código.";
    }
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.categoria.trim()) e.categoria = "La categoría es obligatoria.";
    if (!form.precio || !Number.isFinite(precio) || precio <= 0) e.precio = "Ingresa un precio mayor a 0.";
    if (form.precioOferta !== "") {
      const oferta = Number(form.precioOferta);
      if (!Number.isFinite(oferta) || oferta <= 0 || oferta >= precio) e.precioOferta = "La oferta debe ser menor al precio normal.";
    }
    if (!Number.isInteger(stock) || stock < 0) e.stock = "El stock debe ser un entero de 0 o más.";
    if (!Number.isInteger(critico) || critico < 0) e.stockCritico = "El stock crítico debe ser un entero de 0 o más.";
    if (!form.descripcion.trim()) e.descripcion = "La descripción es obligatoria.";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErrorGeneral("");
    if (!(await validar())) return;
    setGuardando(true);
    try {
      await guardarProducto({
        ...(original ?? { opcionesPorciones: [] }),
        id: original?.id,
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
        categoria: form.categoria.trim(),
        precio: Number(form.precio),
        precioOferta: form.precioOferta === "" ? undefined : Number(form.precioOferta),
        stock: Number(form.stock),
        stockCritico: Number(form.stockCritico),
        porciones: form.porciones.trim(),
        descripcion: form.descripcion.trim(),
        ingredientes: aLista(form.ingredientes),
        alergenos: aLista(form.alergenos),
        imagen: form.imagen.trim(),
        destacado: form.destacado,
      });
      navigate("/admin/productos");
    } catch {
      setErrorGeneral("No se pudo guardar el producto. Intenta nuevamente.");
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando…</p>;
  if (editando && !original) {
    return (
      <div>
        <div className="alert alert-warning">El producto no existe.</div>
        <Link to="/admin/productos">Volver a productos</Link>
      </div>
    );
  }

  return (
    <section>
      <Link to="/admin/productos" className="btn btn-link px-0">← Volver a productos</Link>
      <h1 className="h3 mb-3">{editando ? "Editar producto" : "Nuevo producto"}</h1>
      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate className="bg-white p-4 rounded border">
        <div className="row">
          <div className="col-md-4">
            <CampoFormulario id="codigo" etiqueta="Código" valor={form.codigo} onCambio={cambiar("codigo")} error={errores.codigo} requerido />
          </div>
          <div className="col-md-8">
            <CampoFormulario id="nombre" etiqueta="Nombre" valor={form.nombre} onCambio={cambiar("nombre")} error={errores.nombre} requerido />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría <span className="text-danger">*</span></label>
          <input
            id="categoria"
            list="lista-categorias"
            className={"form-control" + (errores.categoria ? " is-invalid" : "")}
            value={form.categoria}
            onChange={(e) => cambiar("categoria")(e.target.value)}
          />
          <datalist id="lista-categorias">
            {categorias.map((c) => <option key={c} value={c} />)}
          </datalist>
          {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
        </div>

        <div className="row">
          {([
            ["precio", "Precio normal ($)", true],
            ["precioOferta", "Precio oferta ($, opcional)", false],
            ["stock", "Stock", true],
            ["stockCritico", "Stock crítico", true],
          ] as const).map(([campo, etiqueta, requerido]) => (
            <div className="col-6 col-md-3 mb-3" key={campo}>
              <label htmlFor={campo} className="form-label">
                {etiqueta}{requerido && <span className="text-danger"> *</span>}
              </label>
              <input
                id={campo}
                type="number"
                min={0}
                className={"form-control" + (errores[campo] ? " is-invalid" : "")}
                value={form[campo]}
                onChange={(e) => cambiar(campo)(e.target.value)}
              />
              {errores[campo] && <div className="invalid-feedback">{errores[campo]}</div>}
            </div>
          ))}
        </div>

        <CampoFormulario id="porciones" etiqueta="Porciones" valor={form.porciones} onCambio={cambiar("porciones")} placeholder="Ej: 16 a 20 porciones" />
        <CampoFormulario id="descripcion" etiqueta="Descripción" valor={form.descripcion} onCambio={cambiar("descripcion")} error={errores.descripcion} requerido multilinea />
        <CampoFormulario id="ingredientes" etiqueta="Ingredientes (separados por coma)" valor={form.ingredientes} onCambio={cambiar("ingredientes")} />
        <CampoFormulario id="alergenos" etiqueta="Alérgenos (separados por coma)" valor={form.alergenos} onCambio={cambiar("alergenos")} />
        <CampoFormulario id="imagen" etiqueta="URL de la imagen" valor={form.imagen} onCambio={cambiar("imagen")} />

        <div className="form-check mb-4">
          <input
            id="destacado"
            type="checkbox"
            className="form-check-input"
            checked={form.destacado}
            onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))}
          />
          <label htmlFor="destacado" className="form-check-label">Mostrar como destacado en el Home</label>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear producto"}
          </button>
          <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </section>
  );
};

export default ProductoForm;
