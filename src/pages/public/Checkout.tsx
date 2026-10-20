import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import ResumenTotales from "../../components/ResumenTotales";
import SelectorRegionComuna from "../../components/SelectorRegionComuna";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { crearOrden, obtenerOrdenPorId } from "../../services/ordersService";
import { formatearPrecio } from "../../services/productsService";
import type { Usuario } from "../../types";
import { validarDatosCheckout, type FormCheckout } from "../../utils/validaciones";

const VACIO: FormCheckout = {
  nombre: "", apellidos: "", correo: "", telefono: "",
  calle: "", departamento: "", region: "", comuna: "", indicaciones: "",
};

/** Si hay sesión iniciada, los datos se completan solos (último término = apellido). */
function desdeUsuario(u: Usuario): FormCheckout {
  const partes = u.nombre.trim().split(/\s+/);
  const apellidos = partes.length > 1 ? partes.pop()! : "";
  return { ...VACIO, nombre: partes.join(" "), apellidos, correo: u.email, telefono: u.telefono ?? "", region: u.region, comuna: u.comuna };
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { usuario } = useAuth();
  const { items, cupon, vaciar, ...totales } = useCart();

  const previa = params.get("reintentar") ? obtenerOrdenPorId(params.get("reintentar")!) : undefined;
  const [form, setForm] = useState<FormCheckout>(() =>
    previa ? { ...previa.cliente, ...previa.direccion } : usuario ? desdeUsuario(usuario) : VACIO
  );
  const [intentado, setIntentado] = useState(false);
  const [simularError, setSimularError] = useState(false);

  // Tras el primer intento de pago, los errores se actualizan mientras se escribe
  const errores = intentado ? validarDatosCheckout(form) : {};
  const cambiar = (campo: keyof FormCheckout) => (valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

  if (items.length === 0) {
    return (
      <section className="text-center py-5">
        <h1 className="h3">No hay productos para pagar</h1>
        <Link to="/productos" className="btn btn-success mt-3">Ver productos</Link>
      </section>
    );
  }

  const pagar = (e: React.FormEvent) => {
    e.preventDefault();
    setIntentado(true);
    if (Object.keys(validarDatosCheckout(form)).length > 0) return;

    const orden = crearOrden(
      {
        items,
        totales,
        cupon,
        usuarioId: usuario?.id,
        cliente: { nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), correo: form.correo.trim(), telefono: form.telefono.trim() },
        direccion: { calle: form.calle.trim(), departamento: form.departamento.trim(), region: form.region, comuna: form.comuna, indicaciones: form.indicaciones.trim() },
      },
      !simularError
    );

    if (orden.estado === "Pagada") {
      vaciar();
      navigate(`/pago-exitoso?orden=${orden.id}`);
    } else {
      navigate(`/pago-error?orden=${orden.id}`);
    }
  };

  return (
    <section>
      <h1 className="h3 mb-4">Checkout</h1>
      {usuario && <div className="alert alert-info py-2">Completamos tus datos con tu cuenta. Puedes modificarlos.</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form id="form-checkout" noValidate onSubmit={pagar}>
            <h2 className="h5">Información del cliente</h2>
            <div className="row">
              <div className="col-md-6"><CampoFormulario id="nombre" etiqueta="Nombre" requerido valor={form.nombre} onCambio={cambiar("nombre")} error={errores.nombre} /></div>
              <div className="col-md-6"><CampoFormulario id="apellidos" etiqueta="Apellidos" requerido valor={form.apellidos} onCambio={cambiar("apellidos")} error={errores.apellidos} /></div>
              <div className="col-md-6"><CampoFormulario id="correo" etiqueta="Correo" tipo="email" requerido valor={form.correo} onCambio={cambiar("correo")} error={errores.correo} /></div>
              <div className="col-md-6"><CampoFormulario id="telefono" etiqueta="Teléfono (opcional)" tipo="tel" valor={form.telefono} onCambio={cambiar("telefono")} error={errores.telefono} /></div>
            </div>

            <h2 className="h5 mt-2">Dirección de entrega</h2>
            <div className="row">
              <div className="col-md-8"><CampoFormulario id="calle" etiqueta="Calle y número" requerido valor={form.calle} onCambio={cambiar("calle")} error={errores.calle} /></div>
              <div className="col-md-4"><CampoFormulario id="departamento" etiqueta="Departamento (opcional)" placeholder="Ej: 603" valor={form.departamento} onCambio={cambiar("departamento")} /></div>
            </div>
            <SelectorRegionComuna
              region={form.region}
              comuna={form.comuna}
              onCambio={(region, comuna) => setForm((f) => ({ ...f, region, comuna }))}
              errorRegion={errores.region}
              errorComuna={errores.comuna}
            />
            <CampoFormulario id="indicaciones" etiqueta="Indicaciones para la entrega (opcional)" multilinea placeholder="Ej: Entre calles, color del edificio, no tiene timbre." valor={form.indicaciones} onCambio={cambiar("indicaciones")} />
          </form>
        </div>

        <aside className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">Tu pedido</h2>
              <ul className="list-unstyled small mb-3">
                {items.map((i) => (
                  <li key={`${i.id}-${i.opcionPorcion}`} className="d-flex justify-content-between">
                    <span>{i.cantidad} × {i.nombre}</span>
                    <span>{formatearPrecio(i.precio * i.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <ResumenTotales totales={totales} cupon={cupon} />

              <div className="form-check form-switch mt-3">
                <input className="form-check-input" type="checkbox" id="simular-error" checked={simularError} onChange={(e) => setSimularError(e.target.checked)} />
                <label className="form-check-label small" htmlFor="simular-error">Simular error de pago (demo)</label>
              </div>

              <button type="submit" form="form-checkout" className="btn btn-success w-100 mt-3">
                Pagar ahora {formatearPrecio(totales.total)}
              </button>
              <Link to="/carrito" className="btn btn-link w-100">Volver al carrito</Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
