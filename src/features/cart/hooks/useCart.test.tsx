import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "./useCart";
import { AllProvidersWrapper } from "../../../test/AllProvidersWrapper";
import type { Product } from "../../products/types/product";

const mockProduct: Product = {
  id: "prod-1",
  name: "Zapatillas Nike",
  description: "Zapatillas deportivas",
  price: 150000,
  category: "sports",
  imageUrl: "https://example.com/img.jpg",
  stock: 15,
  createdAt: 1723500000000,
};

describe("useCart", () => {
  it("arranca con el carrito vacío", () => {
    const { result } = renderHook(() => useCart(), { wrapper: AllProvidersWrapper });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("agrega un producto y actualiza el total", () => {
    const { result } = renderHook(() => useCart(), { wrapper: AllProvidersWrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(150000);
    expect(result.current.itemCount).toBe(1);
  });

  it("vacía el carrito con clearCart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: AllProvidersWrapper });

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });
});