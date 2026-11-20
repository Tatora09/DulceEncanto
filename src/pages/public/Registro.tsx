import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { useAuth } from "../../context/AuthContext";
import { registrarUsuario } from "../../services/authService";
import { validarDatosRegistro, type FormRegistro } from "../../utils/validaciones";

const VACIO: FormRegistro = { nombre: "", email: "", password: "" };

const Registro: React.FC = () => {
  const [form, setForm] = useState<FormRegistro>(VACIO);
  const [intentado, setIntentado] = useState(false);
  const [errorServidor, setErrorServidor] = useState<{ campo: "email"; mensaje: string } | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const errores = intentado ? validarDatosRegistro(form) : {};
  const cambiar = (campo: keyof FormRegistro) => (valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrorServidor(null);
  };

  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntentado(true);
    if (Object.keys(validarDatosRegistro(form)).length > 0) return;

    setEnviando(true);
    try {
      const r = await registrarUsuario(form);
      if (!r.exito) {
        setErrorServidor({ campo: r.campo, mensaje: r.mensaje });
        return;
      }
      const sesion = await login(form.email, form.password);
      if (!sesion.exito) {
        setErrorServidor({ campo: "email", mensaje: "La cuenta se creó, pero no se pudo iniciar sesión. Ingresa con tus credenciales." });
        return;
      }
      navigate("/", { replace: true });
    } catch (error) {
      setErrorServidor({ campo: "email", mensaje: error instanceof Error ? error.message : "No se pudo crear la cuenta." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="mx-auto" style={{ maxWidth: 620 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="h4 mb-3">Crear cuenta</h1>
          <p className="text-muted small">El backend solicita nombre, correo y contraseña. Podrás completar otros datos cuando estén disponibles en tu perfil.</p>
          <form noValidate onSubmit={enviar}>
            <CampoFormulario id="nombre" etiqueta="Nombre completo" requerido valor={form.nombre} onCambio={cambiar("nombre")} error={errores.nombre} />
            <CampoFormulario id="email" etiqueta="Correo" tipo="email" requerido placeholder="usuario@duoc.cl" valor={form.email} onCambio={cambiar("email")} error={errores.email ?? (errorServidor?.campo === "email" ? errorServidor.mensaje : undefined)} />
            <CampoFormulario id="password" etiqueta="Contraseña (mínimo 8 caracteres)" tipo="password" requerido valor={form.password} onCambio={cambiar("password")} error={errores.password} />
            <button type="submit" className="btn btn-primary w-100" disabled={enviando}>{enviando ? "Creando cuenta…" : "Crear cuenta"}</button>
          </form>
          <p className="small text-muted mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Registro;
