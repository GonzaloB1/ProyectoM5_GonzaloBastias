import type { CartItem } from "../../cart/types/cartItem";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export interface NewOrder {
  userId: string;
  items: CartItem[];
  total: number;
}