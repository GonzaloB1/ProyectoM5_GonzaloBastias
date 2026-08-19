import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/contexts/AuthProvider";
import { CartProvider } from "../features/cart/contexts/CartProvider";

export function AllProvidersWrapper({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}