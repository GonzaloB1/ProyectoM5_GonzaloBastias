import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import * as useAuthModule from "../features/auth/hooks/useAuth";

vi.mock("../features/auth/hooks/useAuth");

function renderAdminRoute() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <p>Contenido secreto de admin</p>
            </AdminRoute>
          }
        />
        <Route path="/login" element={<p>Página de login</p>} />
        <Route path="/" element={<p>Catálogo</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminRoute", () => {
  it("muestra 'Cargando...' mientras loading o roleLoading son true", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      firebaseUser: null,
      role: null,
      loading: true,
      roleLoading: true,
    });

    renderAdminRoute();
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("redirige a /login si no hay usuario autenticado", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      firebaseUser: null,
      role: null,
      loading: false,
      roleLoading: false,
    });

    renderAdminRoute();
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  it("redirige a / si el usuario está autenticado pero no es admin", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      firebaseUser: { uid: "123" } as any,
      role: "customer",
      loading: false,
      roleLoading: false,
    });

    renderAdminRoute();
    expect(screen.getByText("Catálogo")).toBeInTheDocument();
  });

  it("muestra el contenido si el usuario es admin", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      firebaseUser: { uid: "123" } as any,
      role: "admin",
      loading: false,
      roleLoading: false,
    });

    renderAdminRoute();
    expect(screen.getByText("Contenido secreto de admin")).toBeInTheDocument();
  });
});