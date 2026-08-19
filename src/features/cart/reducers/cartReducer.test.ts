import { describe, it, expect } from "vitest";
import { cartReducer, initialCartState } from "./cartReducer";
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

describe("cartReducer", () => {
  it("agrega un producto nuevo con cantidad 1", () => {
    const result = cartReducer(initialCartState, { type: "ADD_ITEM", payload: mockProduct });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].productId).toBe("prod-1");
    expect(result.items[0].quantity).toBe(1);
  });

  it("incrementa la cantidad si el producto ya está en el carrito", () => {
    const stateWithItem = cartReducer(initialCartState, { type: "ADD_ITEM", payload: mockProduct });
    const result = cartReducer(stateWithItem, { type: "ADD_ITEM", payload: mockProduct });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(2);
  });

  it("elimina un producto del carrito", () => {
    const stateWithItem = cartReducer(initialCartState, { type: "ADD_ITEM", payload: mockProduct });
    const result = cartReducer(stateWithItem, {
      type: "REMOVE_ITEM",
      payload: { productId: "prod-1" },
    });

    expect(result.items).toHaveLength(0);
  });

  it("actualiza la cantidad de un producto", () => {
    const stateWithItem = cartReducer(initialCartState, { type: "ADD_ITEM", payload: mockProduct });
    const result = cartReducer(stateWithItem, {
      type: "UPDATE_QUANTITY",
      payload: { productId: "prod-1", quantity: 5 },
    });

    expect(result.items[0].quantity).toBe(5);
  });

  it("elimina el producto si la cantidad actualizada es 0 o menor", () => {
    const stateWithItem = cartReducer(initialCartState, { type: "ADD_ITEM", payload: mockProduct });
    const result = cartReducer(stateWithItem, {
      type: "UPDATE_QUANTITY",
      payload: { productId: "prod-1", quantity: 0 },
    });

    expect(result.items).toHaveLength(0);
  });

  it("vacía el carrito completo", () => {
    const stateWithItem = cartReducer(initialCartState, { type: "ADD_ITEM", payload: mockProduct });
    const result = cartReducer(stateWithItem, { type: "CLEAR_CART" });

    expect(result.items).toHaveLength(0);
  });
});