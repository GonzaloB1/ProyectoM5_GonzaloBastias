import { createContext } from "react";
import type { CartContextType } from "../types/cartContext";

export const CartContext = createContext<CartContextType | undefined>(undefined);