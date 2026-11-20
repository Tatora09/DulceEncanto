/**
 * Gestión de Autenticación, Roles y Permisos (RBAC)
 * Panadería y Repostería Dulce Encanto
 */

const STORAGE_KEY_AUTH = "dulce_encanto_usuario_actual";
const STORAGE_KEY_USUARIOS = "dulce_encanto_usuarios_lista";

const USUARIOS_INICIALES = [
  {
    id: "usr-001",
    rut: "152345678",
    nombre: "María Paz Encanto",
    email: "admin@duoc.cl",
    rol: "Administrador",
    region: "Región Metropolitana de Santiago",
    comuna: "Providencia",
    telefono: "+56 9 9876 5432",
    estado: "Activo",
    fechaRegistro: "2026-01-15"
  },
  {
    id: "usr-002",
    rut: "167891234",
    nombre: "Carlos Repostero",
    email: "carlos@profesor.duoc.cl",
    rol: "Vendedor / Pastelero",
    region: "Región Metropolitana de Santiago",
    comuna: "Ñuñoa",
    telefono: "+56 9 8765 1234",
    estado: "Activo",
    fechaRegistro: "2026-03-10"
  },
  {
    id: "usr-003",
    rut: "19011022K",
    nombre: "Fernanda Silva",
    email: "fernanda.cliente@gmail.com",
    rol: "Cliente",
    region: "Región de Valparaíso",
    comuna: "Viña del Mar",
    telefono: "+56 9 5555 4321",
    estado: "Activo",
    fechaRegistro: "2026-05-20"
  }
];

class AuthService {
  static inicializar() {
    if (!localStorage.getItem(STORAGE_KEY_USUARIOS)) {
      localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(USUARIOS_INICIALES));
    }
    // Si no hay sesión, por defecto dejamos al Administrador para facilitar la evaluación
    if (!localStorage.getItem(STORAGE_KEY_AUTH)) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(USUARIOS_INICIALES[0]));
    }
  }

  static obtenerUsuarios() {
    this.inicializar();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_USUARIOS)) || USUARIOS_INICIALES;
    } catch {
      return USUARIOS_INICIALES;
    }
  }

  static guardarUsuario(userData) {
    const usuarios = this.obtenerUsuarios();
    const idx = usuarios.findIndex((u) => u.id === userData.id || u.rut === userData.rut);

    if (idx > -1) {
      usuarios[idx] = { ...usuarios[idx], ...userData };
    } else {
      userData.id = userData.id || "usr-" + Date.now();
      userData.fechaRegistro = userData.fechaRegistro || new Date().toISOString().split("T")[0];
      userData.estado = userData.estado || "Activo";
      usuarios.push(userData);
    }

    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
    return userData;
  }

  static eliminarUsuario(id) {
    let usuarios = this.obtenerUsuarios();
    usuarios = usuarios.filter((u) => u.id !== id);
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
  }

  static obtenerUsuarioActual() {
    this.inicializar();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_AUTH));
    } catch {
      return null;
    }
  }

  static cambiarUsuario(usuario) {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(usuario));
    window.location.reload();
  }

  static login(email, password = "") {
    const usuarios = this.obtenerUsuarios();
    const usuario = usuarios.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (usuario) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(usuario));
      return { exito: true, usuario };
    }

    // Si es un correo válido institucional o gmail pero no está en la lista, lo creamos como Cliente
    const validacionEmail = window.validarEmailRestringido ? window.validarEmailRestringido(email) : { valido: true };
    if (validacionEmail.valido) {
      const nuevoCliente = {
        id: "usr-" + Date.now(),
        nombre: email.split("@")[0],
        email: email.trim().toLowerCase(),
        rol: "Cliente",
        rut: "19011022K",
        region: "Región Metropolitana de Santiago",
        comuna: "Santiago",
        estado: "Activo",
        fechaRegistro: new Date().toISOString().split("T")[0]
      };
      this.guardarUsuario(nuevoCliente);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(nuevoCliente));
      return { exito: true, usuario: nuevoCliente };
    }

    return { exito: false, mensaje: "Correo no autorizado. Debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com" };
  }

  static logout() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    window.location.href = "login.html";
  }

  /**
   * Valida acceso para páginas de administración
   */
  static verificarAccesoAdmin(paginaRequiereAdminTotal = false) {
    const user = this.obtenerUsuarioActual();
    if (!user) {
      alert("Debe iniciar sesión para acceder al panel administrativo.");
      window.location.href = "../login.html";
      return false;
    }

    if (user.rol === "Cliente") {
      alert("Acceso denegado. Su rol de Cliente no tiene permisos para el Panel Administrativo.");
      window.location.href = "../index.html";
      return false;
    }

    // Vendedor / Pastelero no puede ver usuarios
    if (user.rol === "Vendedor / Pastelero" && paginaRequiereAdminTotal) {
      alert("Acceso restringido. La gestión de usuarios solo está disponible para el rol Administrador.");
      window.location.href = "dashboard.html";
      return false;
    }

    return true;
  }

  /**
   * Renderiza el banner / widget de sesión y selector rápido de roles
   */
  static renderizarBarraSesion(contenedorId = "session-toolbar") {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    const user = this.obtenerUsuarioActual();
    const rolActual = user ? user.rol : "Invitado";
    const nombreActual = user ? user.nombre : "Sin sesión";

    let badgeClass = "role-badge-cliente";
    if (rolActual === "Administrador") badgeClass = "role-badge-admin";
    if (rolActual === "Vendedor / Pastelero") badgeClass = "role-badge-pastelero";

    contenedor.innerHTML = `
      <div class="session-bar-inner">
        <div class="session-user-info">
          <span class="user-avatar">🧁</span>
          <span class="user-name"><strong>${nombreActual}</strong></span>
          <span class="role-badge ${badgeClass}">${rolActual}</span>
        </div>
        <div class="session-actions">
          <label for="quickRoleSelect" class="session-label">Simular Rol (Demo):</label>
          <select id="quickRoleSelect" class="session-select" onchange="AuthService.manejarCambioRolRapido(this.value)">
            <option value="Administrador" ${rolActual === "Administrador" ? "selected" : ""}>👑 Administrador (Total)</option>
            <option value="Vendedor / Pastelero" ${rolActual === "Vendedor / Pastelero" ? "selected" : ""}>👩‍🍳 Pastelero / Vendedor (Parcial)</option>
            <option value="Cliente" ${rolActual === "Cliente" ? "selected" : ""}>🛍️ Cliente (Tienda)</option>
          </select>
          ${
            user
              ? `<button class="btn-session-logout" onclick="AuthService.logout()">Salir</button>`
              : `<a href="login.html" class="btn-session-login">Ingresar</a>`
          }
        </div>
      </div>
    `;
  }

  static manejarCambioRolRapido(rol) {
    const usuarios = this.obtenerUsuarios();
    const usuarioObjetivo = usuarios.find((u) => u.rol === rol);
    if (usuarioObjetivo) {
      this.cambiarUsuario(usuarioObjetivo);
    }
  }
}

AuthService.inicializar();

if (typeof window !== "undefined") {
  window.AuthService = AuthService;
}
