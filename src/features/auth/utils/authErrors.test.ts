import { describe, it, expect } from "vitest";
import { getAuthErrorMessage } from "./authErrors";

describe("getAuthErrorMessage", () => {
  it("traduce un código conocido de Firebase a un mensaje en español", () => {
    expect(getAuthErrorMessage("auth/wrong-password")).toBe("La contraseña es incorrecta.");
  });

  it("traduce el error específico de Google popup cerrado", () => {
    expect(getAuthErrorMessage("auth/popup-closed-by-user")).toBe(
      "Cerraste la ventana de Google antes de completar el ingreso."
    );
  });

  it("devuelve un mensaje genérico para un código desconocido", () => {
    expect(getAuthErrorMessage("auth/codigo-inventado")).toBe("Ocurrió un error. Intentá de nuevo.");
  });
});