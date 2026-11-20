/**
 * Catálogo de Productos de Repostería, Solicitudes Personalizadas y Blogs
 * Panadería y Repostería Dulce Encanto
 */

const STORAGE_KEY_PRODUCTOS = "dulce_encanto_productos";
const STORAGE_KEY_SOLICITUDES = "dulce_encanto_solicitudes";
const STORAGE_KEY_BLOGS = "dulce_encanto_blogs";

const PRODUCTOS_INICIALES = [
  {
    id: "prod-001",
    codigo: "TOR-001",
    nombre: "Torta Amor de Hojarasca & Frambuesa",
    categoria: "Tortas",
    precio: 26900,
    stock: 4,
    stockCritico: 5, // Stock <= Crítico -> ALERTA
    porciones: "16 a 20 porciones",
    descripcion: "Finas capas de hojarasca artesanal crujiente, intercaladas con manjar de campo casero, crema chantilly fresca y mermelada natural de frambuesas de la zona sur.",
    ingredientes: ["Harina de trigo seleccionada", "Mantequilla fresca", "Manjar artesanal", "Frambuesas naturales", "Crema de leche", "Azúcar rubia"],
    alergenos: ["Gluten", "Lácteos", "Huevo"],
    imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "10-12 porciones", precio: 21900 },
      { etiqueta: "16-20 porciones (Estándar)", precio: 26900 },
      { etiqueta: "25-30 porciones", precio: 34900 }
    ],
    destacado: true
  },
  {
    id: "prod-002",
    codigo: "TOR-002",
    nombre: "Torta Selva Negra con Cerezas al Marrasquino",
    categoria: "Tortas",
    precio: 28500,
    stock: 12,
    stockCritico: 4,
    porciones: "18 a 22 porciones",
    descripcion: "Bizcocho esponjoso de chocolate cacao 70%, humedecido en almíbar de licor suave, relleno de crema chantilly, compota de cerezas negras y virutas de chocolate amargo.",
    ingredientes: ["Cacao puro 70%", "Cerezas negras", "Crema chantilly", "Huevos de campo", "Harina", "Licor de cerezas"],
    alergenos: ["Gluten", "Lácteos", "Huevo"],
    imagen: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "12-14 porciones", precio: 22900 },
      { etiqueta: "18-22 porciones", precio: 28500 },
      { etiqueta: "30 porciones", precio: 36900 }
    ],
    destacado: true
  },
  {
    id: "prod-003",
    codigo: "KUC-001",
    nombre: "Kuchen Sureño de Frambuesas & Miga Almendrada",
    categoria: "Kuchenes",
    precio: 18900,
    stock: 3,
    stockCritico: 4, // Stock crítico
    porciones: "10 a 12 porciones",
    descripcion: "Masa quebrada con suave toque de vainilla, abundante relleno de frambuesas frescas del sur y cubierta con streusel crujiente de mantequilla y almendras fileteadas.",
    ingredientes: ["Frambuesas naturales", "Mantequilla", "Almendras laminadas", "Harina de trigo", "Azúcar flor"],
    alergenos: ["Gluten", "Lácteos", "Frutos secos (Almendras)"],
    imagen: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "Molde Mediano (8 porciones)", precio: 15900 },
      { etiqueta: "Molde Grande (10-12 porciones)", precio: 18900 }
    ],
    destacado: true
  },
  {
    id: "prod-004",
    codigo: "TAR-001",
    nombre: "Pie de Limón Merengado Clásico",
    categoria: "Kuchenes",
    precio: 16500,
    stock: 8,
    stockCritico: 5,
    porciones: "10 a 12 porciones",
    descripcion: "Base crocante de galleta con crema suave y ácida de limones sutiles recién exprimidos, coronada con generoso merengue italiano flameado a la perfección.",
    ingredientes: ["Jugo de limón sutil natural", "Leche condensada", "Huevos frescos", "Mantequilla pura", "Merengue italiano"],
    alergenos: ["Gluten", "Lácteos", "Huevo"],
    imagen: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "10-12 porciones", precio: 16500 }
    ],
    destacado: false
  },
  {
    id: "prod-005",
    codigo: "CUP-001",
    nombre: "Pack 6 Cupcakes Velvet Encanto",
    categoria: "Cupcakes",
    precio: 12900,
    stock: 15,
    stockCritico: 6,
    porciones: "6 unidades (6 porciones)",
    descripcion: "Seis esponjosos cupcakes de masa Red Velvet con suave sabor a cacao, decorados con frosting sedoso de queso crema philadelphia y perlas perladas comestibles.",
    ingredientes: ["Cacao rojo holandés", "Queso crema", "Mantequilla", "Harina", "Extracto de vainilla natural"],
    alergenos: ["Gluten", "Lácteos", "Huevo"],
    imagen: "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "Pack 6 unidades", precio: 12900 },
      { etiqueta: "Pack 12 unidades", precio: 23900 }
    ],
    destacado: true
  },
  {
    id: "prod-006",
    codigo: "CUP-002",
    nombre: "Cupcakes Vainilla & Manjar Caramelizado",
    categoria: "Cupcakes",
    precio: 11900,
    stock: 2,
    stockCritico: 5, // Stock crítico
    porciones: "6 unidades",
    descripcion: "Cupcakes horneados con vainas de vainilla de Madagascar, rellenos de corazón de manjar artesanal y cubiertos de crema chantilly con drizzle de caramelo salado.",
    ingredientes: ["Vainilla natural", "Manjar de campo", "Crema dulce", "Harina", "Mantequilla"],
    alergenos: ["Gluten", "Lácteos", "Huevo"],
    imagen: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "Pack 6 unidades", precio: 11900 },
      { etiqueta: "Pack 12 unidades", precio: 21900 }
    ],
    destacado: false
  },
  {
    id: "prod-007",
    codigo: "GAL-001",
    nombre: "Caja de Galletas Artesanales Variadas (500g)",
    categoria: "Galletas",
    precio: 9500,
    stock: 20,
    stockCritico: 8,
    porciones: "Aprox. 24 galletas",
    descripcion: "Surtido fino de galletas horneadas diariamente: alfajorcitos de maicena con manjar y coco, galletitas de chocolate chip belga y mantequilla de naranja.",
    ingredientes: ["Mantequilla de campo", "Maicena", "Manjar", "Chocolate Belga 55%", "Coco rallado"],
    alergenos: ["Gluten", "Lácteos", "Huevo", "Sulfitos"],
    imagen: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "Caja 250g", precio: 5500 },
      { etiqueta: "Caja 500g (Estándar)", precio: 9500 }
    ],
    destacado: false
  },
  {
    id: "prod-008",
    codigo: "PAN-001",
    nombre: "Pan de Campo de Masa Madre Rústica",
    categoria: "Panes",
    precio: 4500,
    stock: 10,
    stockCritico: 5,
    porciones: "Hogaza de 850g",
    descripcion: "Hogaza artesanal fermentada lentamente durante 36 horas con masa madre centenaria. Corteza dorada y crocante con miga alveolar tierna y aromática.",
    ingredientes: ["Harina de fuerza", "Agua purificada", "Sal marina de Cáhuil", "Masa madre viva"],
    alergenos: ["Gluten"],
    imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "Hogaza 850g", precio: 4500 }
    ],
    destacado: false
  },
  {
    id: "prod-009",
    codigo: "DEG-000",
    nombre: "Muestra Gratuita de Mini Macarons Pastel",
    categoria: "Galletas",
    precio: 0, // Precio $0 -> Se muestra como "Muestra Gratuita / Degustación"
    stock: 25,
    stockCritico: 10,
    porciones: "2 piezas por degustación",
    descripcion: "Delicada degustación para nuestros clientes nuevos. Dos mini macarons artesanales en tonos rosa pastel y vainilla con relleno de ganache de frambuesa.",
    ingredientes: ["Harina de almendra fina", "Claras de huevo", "Azúcar flor", "Frambuesas"],
    alergenos: ["Huevo", "Frutos secos (Almendra)", "Lácteos"],
    imagen: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80",
    opcionesPorciones: [
      { etiqueta: "Muestra de Degustación (2 unid)", precio: 0 }
    ],
    destacado: false
  }
];

const SOLICITUDES_INICIALES = [
  {
    id: "sol-101",
    codigo: "SOL-2026-001",
    clienteNombre: "Camila Valenzuela",
    clienteEmail: "camilav@gmail.com",
    clienteTelefono: "+56 9 8765 4321",
    tipoPostre: "Torta en Fondant",
    porciones: 45,
    saborBizcocho: "Chocolate Cacao 70%",
    rellenoPrincipal: "Ganache de Chocolate Menta",
    fechaEntrega: "2026-09-20",
    dedicatoria: "¡Felices 30 Años Nicole!",
    tematica: "Temática primaveral floral en tonos rosa pastel y blanco marfil, con flores de azúcar modeladas a mano.",
    urlImagen: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80",
    precioEstimado: 68500,
    estado: "En Preparación",
    fechaSolicitud: "2026-09-12"
  },
  {
    id: "sol-102",
    codigo: "SOL-2026-002",
    clienteNombre: "Ignacio Henríquez",
    clienteEmail: "i.henriquez@duoc.cl",
    clienteTelefono: "+56 9 7654 3210",
    tipoPostre: "Cupcakes Temáticos",
    porciones: 36,
    saborBizcocho: "Red Velvet",
    rellenoPrincipal: "Manjar Artesanal",
    fechaEntrega: "2026-09-25",
    dedicatoria: "Graduación Duoc 2026",
    tematica: "Toppers dorados y rosados con birretes de graduación y corazones de azúcar.",
    urlImagen: "",
    precioEstimado: 46800,
    estado: "Pendiente",
    fechaSolicitud: "2026-09-13"
  },
  {
    id: "sol-103",
    codigo: "SOL-2026-003",
    clienteNombre: "Patricia Morales",
    clienteEmail: "patricia.m@profesor.duoc.cl",
    clienteTelefono: "+56 9 9123 4567",
    tipoPostre: "Torta Tradicional",
    porciones: 25,
    saborBizcocho: "Zanahoria & Nuez",
    rellenoPrincipal: "Crema Pastelera & Lucuma",
    fechaEntrega: "2026-09-18",
    dedicatoria: "Bodas de Plata Luis y Paty",
    tematica: "Diseño semi-naked con toques de lavanda fresca y perlas comestibles de azúcar.",
    urlImagen: "",
    precioEstimado: 42000,
    estado: "Listo",
    fechaSolicitud: "2026-09-10"
  }
];

const BLOGS_INICIALES = [
  {
    id: "blog-001",
    slug: "conservar-tortas-frescas",
    titulo: "El Secreto Profesional para Conservar tus Tortas y Kuchenes Frescos",
    resumen: "¿Sabías que no todas las tortas deben guardarse en el refrigerador? Descubre qué postres toleran temperatura ambiente y cómo mantener la textura esponjosa de los bizcochos.",
    autor: "Chef Pastelera Lucía Morales",
    fecha: "10 de Septiembre, 2026",
    categoria: "Consejos Reposteros",
    imagen: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
    tiempoLectura: "4 min de lectura",
    contenido: `
      <h3>La importancia de la temperatura adecuada</h3>
      <p>En el corazón de la repostería artesanal de <strong>Dulce Encanto</strong>, cada postre se hornea sin conservantes químicos artificiales. Por ello, la manera en que almacenas tu torta o kuchen una vez en casa determinará su frescura y suavidad.</p>
      
      <h4>1. Tortas con cobertura de Fondant</h4>
      <p><strong>¡Nunca refrigeres una torta de fondant!</strong> La humedad del refrigerador condensa el azúcar exterior, provocando que el fondant sude y pierda su acabado satinado. Guárdala en una habitación fresca y ventilada, lejos de la luz solar directa.</p>
      
      <h4>2. Tortas con Crema Chantilly, Lúcuma y Frutas Frescas</h4>
      <p>Debido al contenido de lácteos y pulpas frescas, estas tortas siempre requieren refrigeración continua entre 4°C y 6°C. Para disfrutarlas al máximo, retíralas del refrigerador 15 a 20 minutos antes de servirlas para que el bizcocho recupere su temperatura óptima.</p>
      
      <h4>3. Kuchenes Sureños y Tartas</h4>
      <p>Nuestros kuchenes de frambuesa y pie de limón se conservan deliciosos hasta 4 días cubiertos con una campana de vidrio o film transparente.</p>
    `
  },
  {
    id: "blog-002",
    slug: "merengue-italiano-perfecto",
    titulo: "Guía Paso a Paso: El Arte del Merengue Italiano Firme y Brillante",
    resumen: "Conoce el método del almíbar a punto de bola blanda (118°C) que utilizamos para coronar nuestros famosos Pie de Limón y tortas artesanales.",
    autor: "Maestro Pastelero Carlos Vera",
    fecha: "05 de Septiembre, 2026",
    categoria: "Técnicas de Pastelería",
    imagen: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
    tiempoLectura: "6 min de lectura",
    contenido: `
      <h3>Por qué el Merengue Italiano es el rey de la repostería</h3>
      <p>A diferencia del merengue francés (claras con azúcar en crudo) o del merengue suizo (a baño maría), el <strong>merengue italiano</strong> se cocina vertiendo un almíbar caliente a 118°C directamente sobre las claras montadas.</p>
      
      <h4>Ventajas principales:</h4>
      <ul>
        <li><strong>Inocuidad garantizada:</strong> El calor pasteuriza las claras, haciéndolo 100% seguro para niños y adultos.</li>
        <li><strong>Estructura ultra estable:</strong> No se baja ni llora líquido con las horas.</li>
        <li><strong>Brillo nacarado:</strong> Ideal para decoraciones con manga pastelera y flameado al soplete.</li>
      </ul>
      
      <h4>El truco del chef:</h4>
      <p>Agrega unas gotas de jugo de limón recién exprimido a las claras justo al comenzar a batir. La acidez ayuda a fijar las proteínas de la albúmina, resultando en un volumen increíblemente sedoso.</p>
    `
  },
  {
    id: "blog-003",
    slug: "reposteria-artesanal-historia",
    titulo: "Del Horno Familiar a Dulce Encanto: Nuestra Pasión por las Recetas Tradicionales",
    resumen: "La historia de tres generaciones de reposteras y cómo preservamos el sabor de antaño con ingredientes 100% naturales y masa madre.",
    autor: "Fundadora Elena Rosales",
    fecha: "28 de Agosto, 2026",
    categoria: "Nuestra Historia",
    imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    tiempoLectura: "5 min de lectura",
    contenido: `
      <h3>El valor de lo hecho con amor y paciencia</h3>
      <p>Hace más de 20 años, en una pequeña cocina sureña, nació la chispa de <strong>Dulce Encanto</strong>. Comenzamos preparando kuchenes de frambuesa para los vecinos con la receta que la abuela heredó de los colonos alemanes en Frutillar.</p>
      <p>Hoy seguimos batiendo nuestros bizcochos a mano, cociendo el manjar de leche en ollas de cobre y seleccionando cada fruta en su punto óptimo de madurez.</p>
    `
  }
];

class ProductosService {
  static inicializarDatos() {
    if (!localStorage.getItem(STORAGE_KEY_PRODUCTOS)) {
      localStorage.setItem(STORAGE_KEY_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    }
    if (!localStorage.getItem(STORAGE_KEY_SOLICITUDES)) {
      localStorage.setItem(STORAGE_KEY_SOLICITUDES, JSON.stringify(SOLICITUDES_INICIALES));
    }
    if (!localStorage.getItem(STORAGE_KEY_BLOGS)) {
      localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(BLOGS_INICIALES));
    }
  }

  static obtenerProductos() {
    this.inicializarDatos();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_PRODUCTOS)) || PRODUCTOS_INICIALES;
    } catch {
      return PRODUCTOS_INICIALES;
    }
  }

  static obtenerProductoPorId(id) {
    const prods = this.obtenerProductos();
    return prods.find((p) => p.id === id || p.codigo === id);
  }

  static guardarProducto(productoData) {
    const productos = this.obtenerProductos();
    const indice = productos.findIndex((p) => p.id === productoData.id);

    if (indice > -1) {
      productos[indice] = { ...productos[indice], ...productoData };
    } else {
      productoData.id = productoData.id || "prod-" + Date.now();
      productos.unshift(productoData);
    }

    localStorage.setItem(STORAGE_KEY_PRODUCTOS, JSON.stringify(productos));
    return productoData;
  }

  static eliminarProducto(id) {
    let productos = this.obtenerProductos();
    productos = productos.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRODUCTOS, JSON.stringify(productos));
  }

  static obtenerSolicitudes() {
    this.inicializarDatos();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_SOLICITUDES)) || SOLICITUDES_INICIALES;
    } catch {
      return SOLICITUDES_INICIALES;
    }
  }

  static guardarSolicitud(solicitud) {
    const solicitudes = this.obtenerSolicitudes();
    solicitud.id = solicitud.id || "sol-" + Date.now();
    solicitud.codigo = solicitud.codigo || `SOL-2026-${String(solicitudes.length + 1).padStart(3, "0")}`;
    solicitud.fechaSolicitud = solicitud.fechaSolicitud || new Date().toISOString().split("T")[0];
    solicitud.estado = solicitud.estado || "Pendiente";
    solicitudes.unshift(solicitud);
    localStorage.setItem(STORAGE_KEY_SOLICITUDES, JSON.stringify(solicitudes));
    return solicitud;
  }

  static actualizarEstadoSolicitud(id, nuevoEstado) {
    const solicitudes = this.obtenerSolicitudes();
    const item = solicitudes.find((s) => s.id === id);
    if (item) {
      item.estado = nuevoEstado;
      localStorage.setItem(STORAGE_KEY_SOLICITUDES, JSON.stringify(solicitudes));
    }
  }

  static obtenerBlogs() {
    this.inicializarDatos();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_BLOGS)) || BLOGS_INICIALES;
    } catch {
      return BLOGS_INICIALES;
    }
  }

  static obtenerBlogPorSlug(slug) {
    const blogs = this.obtenerBlogs();
    return blogs.find((b) => b.slug === slug || b.id === slug);
  }
}

// Inicializar en carga
ProductosService.inicializarDatos();

if (typeof window !== "undefined") {
  window.ProductosService = ProductosService;
}
