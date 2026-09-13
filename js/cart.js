/**
 * Gestión de Carrito de Compras en LocalStorage
 * Panadería y Repostería Dulce Encanto
 */

const STORAGE_KEY_CARRITO = "dulce_encanto_cart";
const STORAGE_KEY_CUPON = "dulce_encanto_cupon";

const CUPONES_VALIDOS = {
  DULCE10: { descuentoPct: 10, descripcion: "10% de Descuento de Bienvenida" },
  ENCANTO15: { descuentoPct: 15, descripcion: "15% de Descuento Dulce Encanto" },
  DUOCPASTEL: { descuentoPct: 20, descripcion: "20% de Descuento Comunidad Duoc" }
};

class CarritoService {
  static obtenerItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CARRITO);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error al leer el carrito:", e);
      return [];
    }
  }

  static guardarItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY_CARRITO, JSON.stringify(items));
      this.actualizarContadorNavbar();
      window.dispatchEvent(new CustomEvent("carritoActualizado", { detail: items }));
    } catch (e) {
      console.error("Error al guardar el carrito:", e);
    }
  }

  static agregarItem(producto, cantidad = 1) {
    const items = this.obtenerItems();
    const indiceExistente = items.findIndex(
      (item) => item.id === producto.id && (!producto.opcionPorcion || item.opcionPorcion === producto.opcionPorcion)
    );

    if (indiceExistente > -1 && !producto.esPersonalizado) {
      items[indiceExistente].cantidad += cantidad;
    } else {
      items.push({
        id: producto.id || "item-" + Date.now(),
        nombre: producto.nombre,
        precio: Number(producto.precio) || 0,
        imagen: producto.imagen || "assets/torta-default.jpg",
        categoria: producto.categoria || "Repostería",
        porciones: producto.porciones || "Porción estándar",
        opcionPorcion: producto.opcionPorcion || null,
        cantidad: cantidad,
        esPersonalizado: Boolean(producto.esPersonalizado),
        detallesPersonalizados: producto.detallesPersonalizados || null
      });
    }

    this.guardarItems(items);
    this.mostrarNotificacion(`"${producto.nombre}" añadido al carrito.`);
  }

  static actualizarCantidad(id, opcionPorcion, nuevaCantidad) {
    let items = this.obtenerItems();
    nuevaCantidad = parseInt(nuevaCantidad, 10);

    if (nuevaCantidad <= 0) {
      this.eliminarItem(id, opcionPorcion);
      return;
    }

    items = items.map((item) => {
      if (item.id === id && (!opcionPorcion || item.opcionPorcion === opcionPorcion)) {
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });

    this.guardarItems(items);
  }

  static eliminarItem(id, opcionPorcion) {
    let items = this.obtenerItems();
    items = items.filter(
      (item) => !(item.id === id && (!opcionPorcion || item.opcionPorcion === opcionPorcion))
    );
    this.guardarItems(items);
    this.mostrarNotificacion("Producto removido del carrito.");
  }

  static vaciarCarrito() {
    localStorage.removeItem(STORAGE_KEY_CARRITO);
    localStorage.removeItem(STORAGE_KEY_CUPON);
    this.actualizarContadorNavbar();
    window.dispatchEvent(new CustomEvent("carritoActualizado", { detail: [] }));
  }

  static aplicarCupon(codigo) {
    if (!codigo) {
      localStorage.removeItem(STORAGE_KEY_CUPON);
      return { valido: false, mensaje: "Cupón no ingresado." };
    }
    const codMayus = codigo.trim().toUpperCase();
    if (CUPONES_VALIDOS[codMayus]) {
      const cupon = { codigo: codMayus, ...CUPONES_VALIDOS[codMayus] };
      localStorage.setItem(STORAGE_KEY_CUPON, JSON.stringify(cupon));
      return { valido: true, cupon, mensaje: `¡Cupón ${codMayus} aplicado! ${cupon.descripcion}` };
    } else {
      return { valido: false, mensaje: "Cupón inválido o expirado. Pruebe: DULCE10 o DUOCPASTEL" };
    }
  }

  static obtenerCuponActual() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CUPON);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static eliminarCupon() {
    localStorage.removeItem(STORAGE_KEY_CUPON);
  }

  static calcularTotales() {
    const items = this.obtenerItems();
    const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const cupon = this.obtenerCuponActual();
    const descuentoPct = cupon ? cupon.descuentoPct : 0;
    const montoDescuento = Math.round((subtotal * descuentoPct) / 100);

    // Envío gratis si el subtotal supera $35.000, de lo contrario $3.500 (solo si hay items)
    let costoEnvio = 0;
    if (subtotal > 0) {
      costoEnvio = subtotal >= 35000 ? 0 : 3500;
    }

    const total = Math.max(0, subtotal - montoDescuento + costoEnvio);

    return {
      cantidadTotal: items.reduce((acc, item) => acc + item.cantidad, 0),
      subtotal,
      cupon,
      montoDescuento,
      costoEnvio,
      total
    };
  }

  static formatearPrecio(monto) {
    if (monto === 0) return "Muestra Gratuita / Degustación";
    return "$" + Number(monto).toLocaleString("es-CL");
  }

  static actualizarContadorNavbar() {
    const items = this.obtenerItems();
    const totalCantidad = items.reduce((acc, item) => acc + item.cantidad, 0);

    const contadores = document.querySelectorAll(".cart-count-badge, #cartCount, .cart-counter");
    contadores.forEach((el) => {
      el.textContent = totalCantidad;
      el.style.display = totalCantidad > 0 ? "inline-flex" : "none";
    });

    const linksCart = document.querySelectorAll(".nav-cart-link");
    linksCart.forEach((link) => {
      const spanCount = link.querySelector(".cart-count-badge");
      if (!spanCount) {
        const badge = document.createElement("span");
        badge.className = "cart-count-badge";
        badge.textContent = totalCantidad;
        badge.style.display = totalCantidad > 0 ? "inline-flex" : "none";
        link.appendChild(badge);
      }
    });
  }

  static mostrarNotificacion(mensaje, tipo = "exito") {
    let contenedor = document.getElementById("toast-container");
    if (!contenedor) {
      contenedor = document.createElement("div");
      contenedor.id = "toast-container";
      contenedor.className = "toast-container";
      document.body.appendChild(contenedor);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo} toast-anim`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">🍰</span>
        <span class="toast-message">${mensaje}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    contenedor.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fadeout");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Inicializar en carga
document.addEventListener("DOMContentLoaded", () => {
  CarritoService.actualizarContadorNavbar();
});

if (typeof window !== "undefined") {
  window.CarritoService = CarritoService;
}
