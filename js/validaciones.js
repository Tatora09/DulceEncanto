/**
 * Lógica de Validaciones en Tiempo Real (Módulo 11, Correos permitidos, Formulario Postre Personalizado)
 * Panadería y Repostería Dulce Encanto - ERS v2.0
 */

const DOMINIOS_AUTORIZADOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

/**
 * Validador de RUN / RUT Chileno según Módulo 11
 * Formato requerido: Sin puntos ni guión (ej: 19011022K), longitud 7 a 9 caracteres.
 */
function validarRUTChileno(rutRaw) {
  if (!rutRaw || typeof rutRaw !== "string") {
    return { valido: false, mensaje: "El RUT es obligatorio." };
  }

  const rutLimpio = rutRaw.trim().toUpperCase().replace(/[\.\-]/g, "");

  if (!/^[0-9]{6,8}[0-9K]$/.test(rutLimpio)) {
    return {
      valido: false,
      mensaje: "Formato inválido. Ingrese el RUT sin puntos ni guión (ej: 19011022K)."
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
  let dvEsperado = "";

  if (dvEsperadoNum === 11) {
    dvEsperado = "0";
  } else if (dvEsperadoNum === 10) {
    dvEsperado = "K";
  } else {
    dvEsperado = dvEsperadoNum.toString();
  }

  if (dvIngresado !== dvEsperado) {
    return {
      valido: false,
      mensaje: `RUT inválido. El dígito verificador no coincide con el cuerpo numérico.`
    };
  }

  return { valido: true, rutFormateado: rutLimpio };
}

/**
 * Validador de Correo Electrónico con dominios restringidos
 * Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com
 */
function validarEmailRestringido(emailRaw) {
  if (!emailRaw || typeof emailRaw !== "string") {
    return { valido: false, mensaje: "El correo electrónico es obligatorio." };
  }

  const email = emailRaw.trim().toLowerCase();

  if (email.length > 100) {
    return { valido: false, mensaje: "El correo no puede exceder 100 caracteres." };
  }

  // Regex estándar de formato email
  const regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  const match = email.match(regexEmail);

  if (!match) {
    return { valido: false, mensaje: "Formato de correo electrónico inválido." };
  }

  const dominio = match[1];
  const esAutorizado = DOMINIOS_AUTORIZADOS.includes(dominio);

  if (!esAutorizado) {
    return {
      valido: false,
      mensaje: `Dominio no permitido. Solo se aceptan: @duoc.cl, @profesor.duoc.cl y @gmail.com`
    };
  }

  return { valido: true, email };
}

/**
 * Validador de Fecha de Entrega / Retiro para Postre Personalizado
 * Regla de negocio: Mínimo 3 días (72 horas) de anticipación respecto al momento actual.
 */
function validarFechaEntregaPostre(fechaStr) {
  if (!fechaStr) {
    return { valido: false, mensaje: "Debe seleccionar una fecha de entrega o retiro." };
  }

  const fechaSeleccionada = new Date(fechaStr);
  if (isNaN(fechaSeleccionada.getTime())) {
    return { valido: false, mensaje: "Fecha seleccionada inválida." };
  }

  const ahora = new Date();
  const milisegundosEn72Horas = 72 * 60 * 60 * 1000;
  const fechaMinimaPermitida = new Date(ahora.getTime() + milisegundosEn72Horas);

  // Normalizar a fecha (cero horas si es input type=date)
  const fechaSeleccionadaCero = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());
  const fechaMinimaCero = new Date(fechaMinimaPermitida.getFullYear(), fechaMinimaPermitida.getMonth(), fechaMinimaPermitida.getDate());

  if (fechaSeleccionadaCero < fechaMinimaCero) {
    const minStr = fechaMinimaPermitida.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    return {
      valido: false,
      mensaje: `La fecha debe tener al menos 3 días (72 hrs) de anticipación. Fecha mínima: ${minStr}.`
    };
  }

  return { valido: true };
}

/**
 * Validador de Porciones de Postre Personalizado
 * Rango permitido: Entero >= 6 y <= 150
 */
function validarPorciones(porciones) {
  const num = parseInt(porciones, 10);
  if (isNaN(num) || !Number.isInteger(num)) {
    return { valido: false, mensaje: "Ingrese un número entero de porciones." };
  }
  if (num < 6 || num > 150) {
    return { valido: false, mensaje: "El número de porciones debe estar entre 6 y 150." };
  }
  return { valido: true, porciones: num };
}

/**
 * Validador de Temática / Decoración
 * Mínimo 10 y máximo 300 caracteres
 */
function validarTematica(texto) {
  if (!texto || typeof texto !== "string") {
    return { valido: false, mensaje: "La descripción de la temática es obligatoria." };
  }
  const limpio = texto.trim();
  if (limpio.length < 10) {
    return { valido: false, mensaje: `Mínimo 10 caracteres. Faltan ${10 - limpio.length}.` };
  }
  if (limpio.length > 300) {
    return { valido: false, mensaje: `Máximo 300 caracteres permitidos. Ha escrito ${limpio.length}.` };
  }
  return { valido: true };
}

/**
 * Validador de Dedicatoria / Mensaje opcional
 * Máximo 60 caracteres
 */
function validarDedicatoria(texto) {
  if (!texto) return { valido: true };
  if (texto.length > 60) {
    return { valido: false, mensaje: `Máximo 60 caracteres para el mensaje en la torta.` };
  }
  return { valido: true };
}

/**
 * Renderizador de feedback visual de error o éxito bajo un input
 */
function mostrarError(inputElement, mensaje) {
  if (!inputElement) return;
  inputElement.classList.add("input-error");
  inputElement.classList.remove("input-success");

  let feedback = inputElement.parentNode.querySelector(".feedback-error");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "feedback-error";
    inputElement.parentNode.appendChild(feedback);
  }
  feedback.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>${mensaje}</span>
  `;
}

function limpiarError(inputElement) {
  if (!inputElement) return;
  inputElement.classList.remove("input-error");
  inputElement.classList.add("input-success");

  const feedback = inputElement.parentNode.querySelector(".feedback-error");
  if (feedback) {
    feedback.remove();
  }
}

/**
 * Inicializador de cascada Región -> Comuna
 */
function inicializarCascadaRegionComuna(selectRegionId, selectComunaId, comunaSeleccionadaInicial = "") {
  const selectRegion = document.getElementById(selectRegionId);
  const selectComuna = document.getElementById(selectComunaId);

  if (!selectRegion || !selectComuna || !window.REGIONES_CHILE) return;

  // Llenar regiones
  selectRegion.innerHTML = '<option value="">-- Seleccione Región --</option>';
  window.REGIONES_CHILE.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.region;
    opt.textContent = item.region;
    selectRegion.appendChild(opt);
  });

  function actualizarComunas(regionNombre, valorPorDefecto = "") {
    selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
    if (!regionNombre) {
      selectComuna.disabled = true;
      return;
    }
    const regionObj = window.REGIONES_CHILE.find((r) => r.region === regionNombre);
    if (regionObj && regionObj.comunas) {
      regionObj.comunas.forEach((comuna) => {
        const opt = document.createElement("option");
        opt.value = comuna;
        opt.textContent = comuna;
        if (valorPorDefecto && valorPorDefecto === comuna) {
          opt.selected = true;
        }
        selectComuna.appendChild(opt);
      });
      selectComuna.disabled = false;
    } else {
      selectComuna.disabled = true;
    }
  }

  selectRegion.addEventListener("change", (e) => {
    actualizarComunas(e.target.value);
  });

  return { actualizarComunas };
}

// Exponer en window para fácil acceso
if (typeof window !== "undefined") {
  window.validarRUTChileno = validarRUTChileno;
  window.validarEmailRestringido = validarEmailRestringido;
  window.validarFechaEntregaPostre = validarFechaEntregaPostre;
  window.validarPorciones = validarPorciones;
  window.validarTematica = validarTematica;
  window.validarDedicatoria = validarDedicatoria;
  window.mostrarError = mostrarError;
  window.limpiarError = limpiarError;
  window.inicializarCascadaRegionComuna = inicializarCascadaRegionComuna;
}
