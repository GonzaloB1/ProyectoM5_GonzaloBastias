import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../../features/cart/contexts/CartProvider";
import { useCart } from "../../features/cart/hooks/useCart";
import type { Product } from "../../features/products/types/product";

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

function TestProductDetail() {
  const { addItem } = useCart();
  return <button onClick={() => addItem(mockProduct)}>Agregar al carrito</button>;
}

function TestCartCounter() {
  const { itemCount, total } = useCart();
  return (
    <p>
      Carrito ({itemCount}) - Total: ${total}
    </p>
  );
}

describe("Flujo de integración: agregar al carrito", () => {
  it("al agregar un producto, el contador y el total se actualizan en otro componente", async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestCartCounter />
        <TestProductDetail />
      </CartProvider>
    );

    expect(screen.getByText("Carrito (0) - Total: $0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    expect(screen.getByText("Carrito (1) - Total: $150000")).toBeInTheDocument();
  });

  it("agregar el mismo producto dos veces suma la cantidad, no duplica el ítem", async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <TestCartCounter />
        <TestProductDetail />
      </CartProvider>
    );

    const button = screen.getByRole("button", { name: /agregar al carrito/i });
    await user.click(button);
    await user.click(button);

    expect(screen.getByText("Carrito (2) - Total: $300000")).toBeInTheDocument();
  });
});