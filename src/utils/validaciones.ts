/**
 * Validaciones en TypeScript para la app React.
 * Porta las mismas reglas de negocio de js/validaciones.js (Módulo 11,
 * correos restringidos) para no cambiar el comportamiento del producto.
 */
import { REGIONES_CHILE } from "../data/regiones";

const DOMINIOS_AUTORIZADOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

export interface ResultadoRut {
  valido: boolean;
  /** RUT limpio y en mayúsculas cuando valido = true */
  rutFormateado?: string;
  mensaje?: string;
}

export interface ResultadoEmail {
  valido: boolean;
  /** Email normalizado (trim + minúsculas) cuando valido = true */
  email?: string;
  mensaje?: string;
}

/**
 * Validador de RUN / RUT Chileno según Módulo 11.
 * Formato requerido: sin puntos ni guión (ej: 19011022K), 7 a 9 caracteres.
 */
export function validarRUTChileno(rutRaw: string): ResultadoRut {
  if (!rutRaw || typeof rutRaw !== "string") {
    return { valido: false, mensaje: "El RUT es obligatorio." };
  }

  const rutLimpio = rutRaw.trim().toUpperCase().replace(/[.\-]/g, "");

  if (!/^[0-9]{6,8}[0-9K]$/.test(rutLimpio)) {
    return {
      valido: false,
      mensaje: "Formato inválido. Ingrese el RUT sin puntos ni guión (ej: 19011022K).",
    };
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);

  // Algoritmo Módulo 11
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvEsperadoNum = 11 - resto;
  let dvEsperado: string;
  if (dvEsperadoNum === 11) dvEsperado = "0";
  else if (dvEsperadoNum === 10) dvEsperado = "K";
  else dvEsperado = dvEsperadoNum.toString();

  if (dvIngresado !== dvEsperado) {
    return { valido: false, mensaje: "RUT inválido. El dígito verificador no coincide con el cuerpo numérico." };
  }

  return { valido: true, rutFormateado: rutLimpio };
}

/**
 * Validador de correo con dominios restringidos:
 * @duoc.cl, @profesor.duoc.cl y @gmail.com.
 */
export function validarEmailRestringido(emailRaw: string): ResultadoEmail {
  if (!emailRaw || typeof emailRaw !== "string") {
    return { valido: false, mensaje: "El correo electrónico es obligatorio." };
  }

  const email = emailRaw.trim().toLowerCase();

  if (email.length > 100) {
    return { valido: false, mensaje: "El correo no puede exceder 100 caracteres." };
  }

  const match = email.match(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
  if (!match) {
    return { valido: false, mensaje: "Formato de correo electrónico inválido." };
  }

  if (!DOMINIOS_AUTORIZADOS.includes(match[1])) {
    return {
      valido: false,
      mensaje: "Dominio no permitido. Solo se aceptan: @duoc.cl, @profesor.duoc.cl y @gmail.com",
    };
  }

  return { valido: true, email };
}

/** Comunas de una región; vacío si la región no existe o no fue seleccionada. */
export function obtenerComunas(region: string): string[] {
  const encontrada = REGIONES_CHILE.find((r) => r.region === region);
  return encontrada ? encontrada.comunas : [];
}

/** Teléfono opcional: si el usuario lo escribe, debe ser de 7 a 9 dígitos. */
function validarTelefonoOpcional(telefono: string): string | undefined {
  const limpio = telefono.trim();
  if (limpio === "") return undefined;
  if (!/^[0-9]{7,9}$/.test(limpio)) {
    return "Ingrese un teléfono de 7 a 9 dígitos, sin letras ni espacios.";
  }
  return undefined;
}

// ---------- Registro de cliente ----------

export interface FormRegistro {
  rut: string;
  nombre: string;
  email: string;
  telefono: string;
  region: string;
  comuna: string;
}

/** Devuelve solo los campos inválidos: mapa campo → mensaje. */
export function validarDatosRegistro(form: FormRegistro): Partial<Record<keyof FormRegistro, string>> {
  const errores: Partial<Record<keyof FormRegistro, string>> = {};

  const rut = validarRUTChileno(form.rut);
  if (!rut.valido) errores.rut = rut.mensaje;

  if (form.nombre.trim().length < 2) errores.nombre = "Ingrese su nombre completo (mínimo 2 caracteres).";

  const email = validarEmailRestringido(form.email);
  if (!email.valido) errores.email = email.mensaje;

  const tel = validarTelefonoOpcional(form.telefono);
  if (tel) errores.telefono = tel;

  if (!form.region) errores.region = "Seleccione su región.";
  if (!form.comuna) errores.comuna = "Seleccione su comuna.";

  return errores;
}

// ---------- Checkout ----------

export interface FormCheckout {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  calle: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
}

/** Devuelve solo los campos inválidos: mapa campo → mensaje. */
export function validarDatosCheckout(form: FormCheckout): Partial<Record<keyof FormCheckout, string>> {
  const errores: Partial<Record<keyof FormCheckout, string>> = {};

  if (form.nombre.trim().length < 2) errores.nombre = "Ingrese su nombre.";
  if (form.apellidos.trim().length < 2) errores.apellidos = "Ingrese sus apellidos.";

  const correo = validarEmailRestringido(form.correo);
  if (!correo.valido) errores.correo = correo.mensaje;

  const tel = validarTelefonoOpcional(form.telefono);
  if (tel) errores.telefono = tel;

  if (form.calle.trim().length < 5) errores.calle = "Ingrese la calle y número de entrega.";
  if (!form.region) errores.region = "Seleccione su región.";
  if (!form.comuna) errores.comuna = "Seleccione su comuna.";

  return errores;
}
