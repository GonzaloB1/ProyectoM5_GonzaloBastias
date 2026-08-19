import { useReducer, useMemo, type ReactNode } from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import { CartContext } from "./CartContext";
import type { Product } from "../../products/types/product";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  function addItem(product: Product) {
    dispatch({ type: "ADD_ITEM", payload: product });
  }

  function removeItem(productId: string) {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  }

  function updateQuantity(productId: string, quantity: number) {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  const total = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}