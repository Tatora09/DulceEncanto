import type { Producto } from "../types";

export const PRODUCTOS_INICIALES: Producto[] = [
  {
    "id": "prod-001",
    "codigo": "TOR-001",
    "nombre": "Torta Amor de Hojarasca & Frambuesa",
    "categoria": "Tortas",
    "precio": 26900,
    "stock": 4,
    "stockCritico": 5,
    "porciones": "16 a 20 porciones",
    "descripcion": "Finas capas de hojarasca artesanal crujiente, intercaladas con manjar de campo casero, crema chantilly fresca y mermelada natural de frambuesas de la zona sur.",
    "ingredientes": [
      "Harina de trigo seleccionada",
      "Mantequilla fresca",
      "Manjar artesanal",
      "Frambuesas naturales",
      "Crema de leche",
      "Azúcar rubia"
    ],
    "alergenos": [
      "Gluten",
      "Lácteos",
      "Huevo"
    ],
    "imagen": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "10-12 porciones",
        "precio": 21900
      },
      {
        "etiqueta": "16-20 porciones (Estándar)",
        "precio": 26900
      },
      {
        "etiqueta": "25-30 porciones",
        "precio": 34900
      }
    ],
    "destacado": true
  },
  {
    "id": "prod-002",
    "codigo": "TOR-002",
    "nombre": "Torta Selva Negra con Cerezas al Marrasquino",
    "categoria": "Tortas",
    "precio": 28500,
    "stock": 12,
    "stockCritico": 4,
    "porciones": "18 a 22 porciones",
    "descripcion": "Bizcocho esponjoso de chocolate cacao 70%, humedecido en almíbar de licor suave, relleno de crema chantilly, compota de cerezas negras y virutas de chocolate amargo.",
    "ingredientes": [
      "Cacao puro 70%",
      "Cerezas negras",
      "Crema chantilly",
      "Huevos de campo",
      "Harina",
      "Licor de cerezas"
    ],
    "alergenos": [
      "Gluten",
      "Lácteos",
      "Huevo"
    ],
    "imagen": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "12-14 porciones",
        "precio": 22900
      },
      {
        "etiqueta": "18-22 porciones",
        "precio": 28500
      },
      {
        "etiqueta": "30 porciones",
        "precio": 36900
      }
    ],
    "destacado": true
  },
  {
    "id": "prod-003",
    "codigo": "KUC-001",
    "nombre": "Kuchen Sureño de Frambuesas & Miga Almendrada",
    "categoria": "Kuchenes",
    "precio": 18900,
    "stock": 3,
    "stockCritico": 4,
    "porciones": "10 a 12 porciones",
    "descripcion": "Masa quebrada con suave toque de vainilla, abundante relleno de frambuesas frescas del sur y cubierta con streusel crujiente de mantequilla y almendras fileteadas.",
    "ingredientes": [
      "Frambuesas naturales",
      "Mantequilla",
      "Almendras laminadas",
      "Harina de trigo",
      "Azúcar flor"
    ],
    "alergenos": [
      "Gluten",
      "Lácteos",
      "Frutos secos (Almendras)"
    ],
    "imagen": "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "Molde Mediano (8 porciones)",
        "precio": 15900
      },
      {
        "etiqueta": "Molde Grande (10-12 porciones)",
        "precio": 18900
      }
    ],
    "destacado": true
  },
  {
    "id": "prod-004",
    "codigo": "TAR-001",
    "nombre": "Pie de Limón Merengado Clásico",
    "categoria": "Kuchenes",
    "precio": 16500,
    "stock": 8,
    "stockCritico": 5,
    "porciones": "10 a 12 porciones",
    "descripcion": "Base crocante de galleta con crema suave y ácida de limones sutiles recién exprimidos, coronada con generoso merengue italiano flameado a la perfección.",
    "ingredientes": [
      "Jugo de limón sutil natural",
      "Leche condensada",
      "Huevos frescos",
      "Mantequilla pura",
      "Merengue italiano"
    ],
    "alergenos": [
      "Gluten",
      "Lácteos",
      "Huevo"
    ],
    "imagen": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "10-12 porciones",
        "precio": 16500
      }
    ],
    "destacado": false
  },
  {
    "id": "prod-005",
    "codigo": "CUP-001",
    "nombre": "Pack 6 Cupcakes Velvet Encanto",
    "categoria": "Cupcakes",
    "precio": 12900,
    "stock": 15,
    "stockCritico": 6,
    "porciones": "6 unidades (6 porciones)",
    "descripcion": "Seis esponjosos cupcakes de masa Red Velvet con suave sabor a cacao, decorados con frosting sedoso de queso crema philadelphia y perlas perladas comestibles.",
    "ingredientes": [
      "Cacao rojo holandés",
      "Queso crema",
      "Mantequilla",
      "Harina",
      "Extracto de vainilla natural"
    ],
    "alergenos": [
      "Gluten",
      "Lácteos",
      "Huevo"
    ],
    "imagen": "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "Pack 6 unidades",
        "precio": 12900
      },
      {
        "etiqueta": "Pack 12 unidades",
        "precio": 23900
      }
    ],
    "destacado": true
  },
  {
    "id": "prod-006",
    "codigo": "CUP-002",
    "nombre": "Cupcakes Vainilla & Manjar Caramelizado",
    "categoria": "Cupcakes",
    "precio": 11900,
    "stock": 2,
    "stockCritico": 5,
    "porciones": "6 unidades",
    "descripcion": "Cupcakes horneados con vainas de vainilla de Madagascar, rellenos de corazón de manjar artesanal y cubiertos de crema chantilly con drizzle de caramelo salado.",
    "ingredientes": [
      "Vainilla natural",
      "Manjar de campo",
      "Crema dulce",
      "Harina",
      "Mantequilla"
    ],
    "alergenos": [
      "Gluten",
      "Lácteos",
      "Huevo"
    ],
    "imagen": "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "Pack 6 unidades",
        "precio": 11900
      },
      {
        "etiqueta": "Pack 12 unidades",
        "precio": 21900
      }
    ],
    "destacado": false
  },
  {
    "id": "prod-007",
    "codigo": "GAL-001",
    "nombre": "Caja de Galletas Artesanales Variadas (500g)",
    "categoria": "Galletas",
    "precio": 9500,
    "stock": 20,
    "stockCritico": 8,
    "porciones": "Aprox. 24 galletas",
    "descripcion": "Surtido fino de galletas horneadas diariamente: alfajorcitos de maicena con manjar y coco, galletitas de chocolate chip belga y mantequilla de naranja.",
    "ingredientes": [
      "Mantequilla de campo",
      "Maicena",
      "Manjar",
      "Chocolate Belga 55%",
      "Coco rallado"
    ],
    "alergenos": [
      "Gluten",
      "Lácteos",
      "Huevo",
      "Sulfitos"
    ],
    "imagen": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "Caja 250g",
        "precio": 5500
      },
      {
        "etiqueta": "Caja 500g (Estándar)",
        "precio": 9500
      }
    ],
    "destacado": false
  },
  {
    "id": "prod-008",
    "codigo": "PAN-001",
    "nombre": "Pan de Campo de Masa Madre Rústica",
    "categoria": "Panes",
    "precio": 4500,
    "stock": 10,
    "stockCritico": 5,
    "porciones": "Hogaza de 850g",
    "descripcion": "Hogaza artesanal fermentada lentamente durante 36 horas con masa madre centenaria. Corteza dorada y crocante con miga alveolar tierna y aromática.",
    "ingredientes": [
      "Harina de fuerza",
      "Agua purificada",
      "Sal marina de Cáhuil",
      "Masa madre viva"
    ],
    "alergenos": [
      "Gluten"
    ],
    "imagen": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "Hogaza 850g",
        "precio": 4500
      }
    ],
    "destacado": false
  },
  {
    "id": "prod-009",
    "codigo": "DEG-000",
    "nombre": "Muestra Gratuita de Mini Macarons Pastel",
    "categoria": "Galletas",
    "precio": 0,
    "stock": 25,
    "stockCritico": 10,
    "porciones": "2 piezas por degustación",
    "descripcion": "Delicada degustación para nuestros clientes nuevos. Dos mini macarons artesanales en tonos rosa pastel y vainilla con relleno de ganache de frambuesa.",
    "ingredientes": [
      "Harina de almendra fina",
      "Claras de huevo",
      "Azúcar flor",
      "Frambuesas"
    ],
    "alergenos": [
      "Huevo",
      "Frutos secos (Almendra)",
      "Lácteos"
    ],
    "imagen": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80",
    "opcionesPorciones": [
      {
        "etiqueta": "Muestra de Degustación (2 unid)",
        "precio": 0
      }
    ],
    "destacado": false
  }
];
