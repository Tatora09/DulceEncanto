import { obtenerProductos } from "../services/productsService";

describe("productsService", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("resuelve la ruta de imagen que entrega el backend para el catálogo", async () => {
    spyOn(window, "fetch").and.resolveTo(new Response(JSON.stringify([
      {
        id: 1,
        nombre: "Torta",
        descripcion: "",
        precio: 10000,
        stock: 5,
        categoria: { id: 1, nombre: "Tortas" },
        imagenUrl: "/images/productos/torta.jpg",
      },
    ]), { status: 200 }));

    const [producto] = await obtenerProductos();

    expect(producto.imagen).toBe("/images/productos/torta.jpg");
  });

  it("conserva las URL absolutas de imágenes", async () => {
    spyOn(window, "fetch").and.resolveTo(new Response(JSON.stringify([
      {
        id: 1,
        nombre: "Torta",
        descripcion: "",
        precio: 10000,
        stock: 5,
        categoria: { id: 1, nombre: "Tortas" },
        imagenUrl: "https://cdn.ejemplo.cl/torta.jpg",
      },
    ]), { status: 200 }));

    const [producto] = await obtenerProductos();

    expect(producto.imagen).toBe("https://cdn.ejemplo.cl/torta.jpg");
  });

  it("adapta el precio promocional que entrega el backend", async () => {
    spyOn(window, "fetch").and.resolveTo(new Response(JSON.stringify([
      {
        id: 1,
        nombre: "Caja de bombones",
        descripcion: "",
        precio: 12900,
        precioOferta: 9900,
        stock: 5,
        categoria: { id: 1, nombre: "Chocolates" },
      },
    ]), { status: 200 }));

    const [producto] = await obtenerProductos();

    expect(producto.precioOferta).toBe(9900);
  });
});
