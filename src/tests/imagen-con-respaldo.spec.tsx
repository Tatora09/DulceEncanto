import React from "react";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import ImagenConRespaldo from "../components/ImagenConRespaldo";

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe("ImagenConRespaldo", () => {
  let contenedor: HTMLDivElement;
  let raiz: Root;

  beforeEach(() => {
    contenedor = document.createElement("div");
    document.body.appendChild(contenedor);
    raiz = createRoot(contenedor);
  });

  afterEach(() => {
    act(() => raiz.unmount());
    document.body.removeChild(contenedor);
  });

  it("usa una imagen local cuando no recibe una URL", () => {
    act(() => raiz.render(<ImagenConRespaldo src="  " alt="Postre" />));

    expect(contenedor.querySelector("img")!.getAttribute("src")).toBe("/images/postre-placeholder.svg");
  });

  it("reemplaza una imagen que falla por la imagen local", () => {
    act(() => raiz.render(<ImagenConRespaldo src="https://ejemplo.invalid/postre.jpg" alt="Postre" />));
    const imagen = contenedor.querySelector("img")!;

    act(() => imagen.dispatchEvent(new Event("error")));

    expect(imagen.getAttribute("src")).toBe("/images/postre-placeholder.svg");
  });
});
