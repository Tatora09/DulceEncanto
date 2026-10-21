/**
 * Pruebas unitarias del componente CampoFormulario con Jasmine + Karma.
 * Compatible con React 19 (createRoot + act).
 *
 * Criterios cubiertos:
 * 1. Renderizado (básico y condicional de errores)
 * 2. Props (etiqueta, tipo, placeholder, callbacks)
 * 3. Estado (componente contenedor con useState)
 * 4. Eventos (input, click, submit)
 * 5. Aislamiento (espías de Jasmine sobre localStorage / storage.ts)
 */
import React, { useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react";
import CampoFormulario from "../components/CampoFormulario";
import { escribir } from "../services/storage";

// React 19 exige marcar el entorno como "de pruebas" para poder usar act()
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

/* ---------- Helpers de renderizado y eventos ---------- */

let contenedor: HTMLDivElement;
let raiz: Root;

function montar(elemento: React.ReactElement) {
  act(() => {
    raiz.render(elemento);
  });
}

beforeEach(() => {
  contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  raiz = createRoot(contenedor);
});

afterEach(() => {
  act(() => {
    raiz.unmount();
  });
  document.body.removeChild(contenedor);
});

/** Simula escribir en un input/textarea respetando el manejo de valores de React. */
function simularEscritura(campo: HTMLInputElement | HTMLTextAreaElement, texto: string) {
  const setterProto =
    campo instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(setterProto, "value")!.set!;
  act(() => {
    setter.call(campo, texto);
    campo.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/** Simula un clic del usuario. */
function simularClic(elemento: HTMLElement) {
  act(() => {
    elemento.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

/* ---------- 1 y 2: Renderizado y props del componente puro ---------- */

describe("CampoFormulario", () => {
  const propsBasicas = {
    id: "nombre",
    etiqueta: "Nombre completo",
    valor: "María Pérez",
    onCambio: () => {},
  };

  describe("Renderizado", () => {
    it("debería renderizar la etiqueta y el valor inicial recibidos por props", () => {
      // Arrange + Act
      montar(<CampoFormulario {...propsBasicas} />);

      // Assert
      const etiqueta = contenedor.querySelector("label")!;
      const campo = contenedor.querySelector("input")!;
      expect(etiqueta.textContent).toContain("Nombre completo");
      expect(etiqueta.getAttribute("for")).toBe("nombre");
      expect(campo.value).toBe("María Pérez");
    });

    it("no debería mostrar ningún mensaje de error cuando la prop error está vacía", () => {
      // Arrange + Act
      montar(<CampoFormulario {...propsBasicas} />);

      // Assert
      expect(contenedor.querySelector(".invalid-feedback")).toBeNull();
    });

    it("debería mostrar el mensaje de error únicamente cuando la prop error trae texto", () => {
      // Arrange: sin error
      montar(<CampoFormulario {...propsBasicas} />);
      expect(contenedor.querySelector(".invalid-feedback")).toBeNull();

      // Act: ahora con error
      montar(<CampoFormulario {...propsBasicas} error="El nombre es obligatorio" />);

      // Assert
      const mensaje = contenedor.querySelector(".invalid-feedback");
      expect(mensaje).not.toBeNull();
      expect(mensaje!.textContent).toBe("El nombre es obligatorio");
    });

    it("debería renderizar un textarea cuando la prop multilinea es true", () => {
      // Arrange + Act
      montar(<CampoFormulario {...propsBasicas} multilinea={true} />);

      // Assert
      expect(contenedor.querySelector("input")).toBeNull();
      expect(contenedor.querySelector("textarea")).not.toBeNull();
    });

    it("debería añadir el asterisco rojo de obligatorio solo cuando la prop requerido es true", () => {
      // Arrange + Act: sin requerido
      montar(<CampoFormulario {...propsBasicas} />);
      expect(contenedor.querySelector(".text-danger")).toBeNull();

      // Act: con requerido
      montar(<CampoFormulario {...propsBasicas} requerido={true} />);

      // Assert
      expect(contenedor.querySelector(".text-danger")!.textContent).toContain("*");
    });
  });

  describe("Propiedades (props)", () => {
    it("debería reflejar la prop tipo en el atributo type del input", () => {
      // Arrange + Act
      montar(<CampoFormulario {...propsBasicas} tipo="email" />);

      // Assert
      expect(contenedor.querySelector("input")!.type).toBe("email");
    });

    it("debería reflejar la prop placeholder en el campo", () => {
      // Arrange + Act
      montar(<CampoFormulario {...propsBasicas} placeholder="Ej: Dulce Encanto" />);

      // Assert
      expect(contenedor.querySelector("input")!.placeholder).toBe("Ej: Dulce Encanto");
    });

    it("debería aplicar las clases y atributos de accesibilidad cuando existe error", () => {
      // Arrange + Act
      montar(<CampoFormulario {...propsBasicas} error="Campo inválido" />);

      // Assert
      const campo = contenedor.querySelector("input")!;
      expect(campo.classList.contains("is-invalid")).toBeTrue();
      expect(campo.getAttribute("aria-invalid")).toBe("true");
      expect(campo.getAttribute("aria-describedby")).toBe("nombre-error");
    });

    it("debería invocar la prop onCambio con el nuevo valor cuando el usuario escribe", () => {
      // Arrange: espía de Jasmine en lugar de una función real
      const espiaOnCambio = jasmine.createSpy("onCambio");
      montar(<CampoFormulario {...propsBasicas} onCambio={espiaOnCambio} />);

      // Act
      simularEscritura(contenedor.querySelector("input")!, "torta de chocolate");

      // Assert
      expect(espiaOnCambio).toHaveBeenCalledTimes(1);
      expect(espiaOnCambio).toHaveBeenCalledWith("torta de chocolate");
    });
  });
});

/* ---------- 3 y 4: Estado y eventos con componente contenedor ---------- */

/** Componente de prueba que aloja el estado y persiste vía storage.ts. */
const FormularioNombre: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const guardar = () => {
    if (nombre.trim() === "") {
      setError("El nombre es obligatorio");
      return;
    }
    setError(undefined);
    escribir("pedido_nombre", nombre); // persistencia simulada (localStorage)
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        guardar();
      }}
    >
      <CampoFormulario
        id="nombre"
        etiqueta="Nombre del cliente"
        valor={nombre}
        onCambio={setNombre}
        error={error}
        requerido={true}
      />
      <button type="submit" data-testid="btn-guardar">
        Guardar
      </button>
    </form>
  );
};

describe("FormularioNombre (estado y eventos integrados con CampoFormulario)", () => {
  it("debería actualizar el estado interno cuando el usuario escribe en el formulario", () => {
    // Arrange
    montar(<FormularioNombre />);
    const campo = contenedor.querySelector("input")!;
    expect(campo.value).toBe("");

    // Act
    simularEscritura(campo, "Juan Quispe");

    // Assert: el estado fluyó de vuelta al input controlado
    expect(contenedor.querySelector("input")!.value).toBe("Juan Quispe");
  });

  it("debería mostrar el error de validación solo después de intentar guardar sin datos", () => {
    // Arrange
    montar(<FormularioNombre />);
    expect(contenedor.querySelector(".invalid-feedback")).toBeNull();

    // Act: clic en Guardar con el campo vacío
    simularClic(contenedor.querySelector("button[data-testid='btn-guardar']")!);

    // Assert
    expect(contenedor.querySelector(".invalid-feedback")!.textContent).toBe(
      "El nombre es obligatorio"
    );
  });

  it("debería desaparecer el error cuando el usuario corrige el campo y vuelve a guardar", () => {
    // Arrange: disparamos el error primero
    montar(<FormularioNombre />);
    simularClic(contenedor.querySelector("button[data-testid='btn-guardar']")!);
    expect(contenedor.querySelector(".invalid-feedback")).not.toBeNull();

    // Act: el usuario escribe y guarda de nuevo
    simularEscritura(contenedor.querySelector("input")!, "Ana Torres");
    simularClic(contenedor.querySelector("button[data-testid='btn-guardar']")!);

    // Assert
    expect(contenedor.querySelector(".invalid-feedback")).toBeNull();
  });
});

/* ---------- 5: Aislamiento con espías sobre la capa de persistencia ---------- */

describe("Aislamiento de la persistencia (storage.ts) mediante espías de Jasmine", () => {
  let espiaSetItem: jasmine.Spy;

  beforeEach(() => {
    // Mock: interceptamos localStorage, que es lo que usa storage.ts internamente
    espiaSetItem = spyOn(localStorage, "setItem").and.stub();
  });

  it("debería llamar a localStorage.setItem con la clave y el valor serializado al guardar", () => {
    // Arrange + Act
    escribir("pedido_nombre", "Torta de piña");

    // Assert
    expect(espiaSetItem).toHaveBeenCalledTimes(1);
    expect(espiaSetItem).toHaveBeenCalledWith(
      "pedido_nombre",
      JSON.stringify("Torta de piña")
    );
  });

  it("debería permitir escribir varias veces y recibir una llamada por cada guardado", () => {
    // Act
    escribir("clave_uno", 1);
    escribir("clave_dos", { region: "Araucanía" });

    // Assert
    expect(espiaSetItem).toHaveBeenCalledTimes(2);
    expect(espiaSetItem.calls.argsFor(1)[1]).toContain("Araucanía");
  });

  it("no debería romper el formulario si la persistencia falla (localStorage lanza excepción)", () => {
    // Arrange: simulamos que el almacenamiento está agotado o bloqueado
    espiaSetItem.and.throwError(new Error("Cuota de almacenamiento superada"));
    const espiaConsola = spyOn(console, "error"); // storage.ts captura y registra el error
    montar(<FormularioNombre />);

    // Act
    simularEscritura(contenedor.querySelector("input")!, "Pedido de prueba");
    simularClic(contenedor.querySelector("button[data-testid='btn-guardar']")!);

    // Assert: el componente sigue funcional pese al fallo de persistencia
    expect(espiaConsola).toHaveBeenCalled();
    expect(contenedor.querySelector(".invalid-feedback")).toBeNull();
    expect(contenedor.querySelector("input")!.value).toBe("Pedido de prueba");
  });
});
