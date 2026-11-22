import { BLOGS_INICIALES } from "../data/blogs";
import { KEY_BLOGS, obtenerBlogs } from "../services/productsService";

const IMAGEN_ANTERIOR =
  "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80";

describe("productsService blogs", () => {
  afterEach(() => localStorage.removeItem(KEY_BLOGS));

  it("actualiza la imagen anterior del blog principal guardada en localStorage", () => {
    const blogsGuardados = BLOGS_INICIALES.map((blog) => ({ ...blog }));
    blogsGuardados[0] = { ...blogsGuardados[0], imagen: IMAGEN_ANTERIOR };
    localStorage.setItem(KEY_BLOGS, JSON.stringify(blogsGuardados));

    expect(obtenerBlogs()[0].imagen).toBe(BLOGS_INICIALES[0].imagen);
    expect(JSON.parse(localStorage.getItem(KEY_BLOGS)!)[0].imagen).toBe(BLOGS_INICIALES[0].imagen);
  });

  it("conserva una imagen personalizada que no corresponde a la URL anterior", () => {
    const imagenPersonalizada = "https://cdn.ejemplo.cl/blog-principal.jpg";
    const blogsGuardados = BLOGS_INICIALES.map((blog) => ({ ...blog }));
    blogsGuardados[0] = { ...blogsGuardados[0], imagen: imagenPersonalizada };
    localStorage.setItem(KEY_BLOGS, JSON.stringify(blogsGuardados));

    expect(obtenerBlogs()[0].imagen).toBe(imagenPersonalizada);
  });
});
