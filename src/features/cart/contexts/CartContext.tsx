import { createContext } from "react";
import type { CartContextType } from "../types/CartContext";
export const CartContext = createContext<CartContextType | undefined>(undefined);