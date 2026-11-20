import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import {
  guardarProducto,
  obtenerCategorias,
  obtenerProductoPorId,
} from "../../services/productsService";

interface Formulario {
  nombre: string;
  categoria: string;
  precio: string;
  stock: string;
  descripcion: string;
  imagen: string;
}

const VACIO: Formulario = {
  nombre: "",
  categoria: "",
  precio: "",
  stock: "0",
  descripcion: "",
  imagen: "",
};

const ProductoForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);
  const [form, setForm] = useState<Formulario>(VACIO);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [errores, setErrores] = useState<Partial<Record<keyof Formulario, string>>>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [nombres, producto] = await Promise.all([
          obtenerCategorias(),
          id ? obtenerProductoPorId(id) : Promise.resolve(undefined),
        ]);
        setCategorias(nombres);
        if (id && !producto) {
          setNoEncontrado(true);
          return;
        }
        if (producto) {
          setForm({
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: String(producto.precio),
            stock: String(producto.stock),
            descripcion: producto.descripcion,
            imagen: producto.imagen,
          });
        }
      } catch (e) {
        setErrorGeneral(e instanceof Error ? e.message : "No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    })();
  }, [id]);

  const cambiar = (campo: keyof Formulario) => (valor: string) => setForm((actual) => ({ ...actual, [campo]: valor }));

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setErrorGeneral("");
    const erroresValidacion: Partial<Record<keyof Formulario, string>> = {};
    const precio = Number(form.precio);
    const stock = Number(form.stock);
    if (!form.nombre.trim()) erroresValidacion.nombre = "El nombre es obligatorio.";
    if (!form.categoria) erroresValidacion.categoria = "Selecciona una categoría.";
    if (!Number.isInteger(precio) || precio < 0) erroresValidacion.precio = "Ingresa un precio entero igual o mayor a 0.";
    if (!Number.isInteger(stock) || stock < 0) erroresValidacion.stock = "El stock debe ser un entero igual o mayor a 0.";
    if (!form.descripcion.trim()) erroresValidacion.descripcion = "La descripción es obligatoria.";
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    setGuardando(true);
    try {
      await guardarProducto({
        id,
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        precio,
        stock,
        descripcion: form.descripcion.trim(),
        imagen: form.imagen.trim(),
      });
      navigate("/admin/productos");
    } catch (e) {
      setErrorGeneral(e instanceof Error ? e.message : "No se pudo guardar el producto.");
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando…</p>;
  if (noEncontrado) {
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
      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate className="bg-white p-4 rounded border">
        <CampoFormulario id="nombre" etiqueta="Nombre" valor={form.nombre} onCambio={cambiar("nombre")} error={errores.nombre} requerido />
        <div className="mb-3">
          <label htmlFor="categoria" className="form-label">Categoría <span className="text-danger">*</span></label>
          <select
            id="categoria"
            className={"form-select" + (errores.categoria ? " is-invalid" : "")}
            value={form.categoria}
            onChange={(evento) => cambiar("categoria")(evento.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
          </select>
          {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
          {categorias.length === 0 && <div className="form-text">Primero crea una categoría.</div>}
        </div>

        <div className="row">
          <div className="col-md-6">
            <CampoFormulario id="precio" etiqueta="Precio ($)" tipo="number" valor={form.precio} onCambio={cambiar("precio")} error={errores.precio} requerido />
          </div>
          <div className="col-md-6">
            <CampoFormulario id="stock" etiqueta="Stock" tipo="number" valor={form.stock} onCambio={cambiar("stock")} error={errores.stock} requerido />
          </div>
        </div>
        <CampoFormulario id="descripcion" etiqueta="Descripción" valor={form.descripcion} onCambio={cambiar("descripcion")} error={errores.descripcion} requerido multilinea />
        <CampoFormulario id="imagen" etiqueta="URL de la imagen" valor={form.imagen} onCambio={cambiar("imagen")} />
        <p className="small text-muted">El backend almacena estos campos; códigos, ofertas y tamaños de porción no forman parte de su API.</p>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando || categorias.length === 0}>
            {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Crear producto"}
          </button>
          <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </section>
  );
};

export default ProductoForm;
