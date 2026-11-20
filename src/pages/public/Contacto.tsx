import React, { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario";

const MOTIVOS = [
  "Consulta General",
  "Cotización de Evento / Bodas",
  "Consulta sobre Despachos",
  "Información sobre Alérgenos",
];

const PREGUNTAS: [string, string][] = [
  ["¿Con cuánta anticipación debo pedir una torta personalizada?", "Por regla de calidad artesanal, exigimos al menos 72 horas (3 días). Para matrimonios o eventos sobre 50 personas recomendamos 1 a 2 semanas."],
  ["¿Tienen opciones sin azúcar o keto?", "Sí. En el formulario de postre personalizado puedes elegir bizcocho sin azúcar (keto), endulzado con alulosa y harina de almendras."],
  ["¿Cómo funciona el despacho en Santiago?", "Usamos furgones refrigerados. El valor es de $3.500 dentro de la provincia de Santiago y es gratis en compras sobre $35.000."],
];

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contacto: React.FC = () => {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", motivo: MOTIVOS[0], mensaje: "" });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (campo: string) => (valor: string) => setForm((f) => ({ ...f, [campo]: valor }));

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!REGEX_EMAIL.test(form.email.trim())) e.email = "Ingresa un correo válido.";
    if (form.mensaje.trim().length < 10) e.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    setErrores(e);
    if (Object.keys(e).length === 0) {
      const asunto = encodeURIComponent(`Consulta: ${form.motivo}`);
      const cuerpo = encodeURIComponent(
        `Nombre: ${form.nombre.trim()}\nCorreo: ${form.email.trim()}\nTeléfono: ${form.telefono.trim() || "No indicado"}\n\n${form.mensaje.trim()}`,
      );
      window.location.href = `mailto:contacto@dulceencanto.cl?subject=${asunto}&body=${cuerpo}`;
      setEnviado(true);
      setForm({ nombre: "", email: "", telefono: "", motivo: MOTIVOS[0], mensaje: "" });
    }
  };

  return (
    <section>
      <h1 className="h3 mb-1">Contáctanos</h1>
      <p className="text-muted mb-4">¿Dudas sobre un postre especial, banquetería o despacho? Déjanos un mensaje.</p>

      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={enviar} noValidate className="bg-white p-4 rounded border">
            {enviado && <div className="alert alert-info">Se abrió tu aplicación de correo. Envía el mensaje desde allí para que podamos recibirlo.</div>}
            <CampoFormulario id="nombre" etiqueta="Nombre completo" valor={form.nombre} onCambio={cambiar("nombre")} error={errores.nombre} requerido />
            <CampoFormulario id="email" etiqueta="Correo electrónico" tipo="email" valor={form.email} onCambio={cambiar("email")} error={errores.email} requerido />
            <CampoFormulario id="telefono" etiqueta="Teléfono" tipo="tel" valor={form.telefono} onCambio={cambiar("telefono")} />
            <div className="mb-3">
              <label htmlFor="motivo" className="form-label">Motivo del mensaje</label>
              <select id="motivo" className="form-select" value={form.motivo} onChange={(e) => cambiar("motivo")(e.target.value)}>
                {MOTIVOS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <CampoFormulario id="mensaje" etiqueta="Mensaje" valor={form.mensaje} onCambio={cambiar("mensaje")} error={errores.mensaje} requerido multilinea />
            <button type="submit" className="btn btn-primary">Enviar mensaje</button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card p-4 mb-4">
            <h2 className="h5">🍰 Salón de Té &amp; Tienda Matriz</h2>
            <p className="mb-2">📍 Av. Providencia 1420, Providencia (a pasos de Metro Manuel Montt), Santiago.</p>
            <p className="mb-1">🕒 <strong>Horario de atención</strong></p>
            <ul className="mb-2">
              <li>Lunes a Viernes: 08:30 a 20:00 hrs.</li>
              <li>Sábados: 09:00 a 19:00 hrs.</li>
              <li>Domingos y festivos: 09:30 a 15:00 hrs (solo retiro de pedidos).</li>
            </ul>
            <p className="mb-1">📞 +56 2 2345 6789</p>
            <p className="mb-0">✉️ contacto@dulceencanto.cl</p>
          </div>

          <h2 className="h5">Preguntas frecuentes</h2>
          {PREGUNTAS.map(([pregunta, respuesta]) => (
            <details key={pregunta} className="mb-2">
              <summary className="fw-semibold">{pregunta}</summary>
              <p className="text-muted mt-2 mb-0">{respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contacto;
