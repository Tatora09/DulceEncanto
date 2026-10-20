import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import SelectorRegionComuna from "../../components/SelectorRegionComuna";
import { useAuth } from "../../context/AuthContext";
import { registrarUsuario } from "../../services/authService";
import { validarDatosRegistro, type FormRegistro } from "../../utils/validaciones";

const VACIO: FormRegistro = { rut: "", nombre: "", email: "", telefono: "", region: "", comuna: "" };

const Registro: React.FC = () => {
  const [form, setForm] = useState<FormRegistro>(VACIO);
  const [intentado, setIntentado] = useState(false);
  const [errorServidor, setErrorServidor] = useState<{ campo: "rut" | "email"; mensaje: string } | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const errores = intentado ? validarDatosRegistro(form) : {};
  const cambiar = (campo: keyof FormRegistro) => (valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrorServidor(null);
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    setIntentado(true);
    if (Object.keys(validarDatosRegistro(form)).length > 0) return;

    const r = registrarUsuario(form);
    if (!r.exito) {
      setErrorServidor({ campo: r.campo, mensaje: r.mensaje });
      return;
    }
    login(r.usuario.email);
    navigate("/", { replace: true });
  };

  return (
    <section className="mx-auto" style={{ maxWidth: 620 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h4 mb-3">Crear cuenta</h1>
          <form noValidate onSubmit={enviar}>
            <div className="row">
              <div className="col-md-6">
                <CampoFormulario id="rut" etiqueta="RUT (sin puntos ni guión)" requerido placeholder="19011022K" valor={form.rut} onCambio={cambiar("rut")} error={errores.rut ?? (errorServidor?.campo === "rut" ? errorServidor.mensaje : undefined)} />
              </div>
              <div className="col-md-6">
                <CampoFormulario id="nombre" etiqueta="Nombre completo" requerido valor={form.nombre} onCambio={cambiar("nombre")} error={errores.nombre} />
              </div>
              <div className="col-md-6">
                <CampoFormulario id="email" etiqueta="Correo" tipo="email" requerido placeholder="usuario@duoc.cl" valor={form.email} onCambio={cambiar("email")} error={errores.email ?? (errorServidor?.campo === "email" ? errorServidor.mensaje : undefined)} />
              </div>
              <div className="col-md-6">
                <CampoFormulario id="telefono" etiqueta="Teléfono (opcional)" tipo="tel" valor={form.telefono} onCambio={cambiar("telefono")} error={errores.telefono} />
              </div>
            </div>
            <SelectorRegionComuna
              region={form.region}
              comuna={form.comuna}
              onCambio={(region, comuna) => setForm((f) => ({ ...f, region, comuna }))}
              errorRegion={errores.region}
              errorComuna={errores.comuna}
            />
            <button type="submit" className="btn btn-primary w-100">Crear cuenta</button>
          </form>
          <p className="small text-muted mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Registro;
