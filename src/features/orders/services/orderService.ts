import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { Order, NewOrder, OrderStatus } from "../types/order";

const ordersCollection = collection(db, "orders");

export async function createOrder(newOrder: NewOrder) {
  return addDoc(ordersCollection, {
    ...newOrder,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    ordersCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[];
}

export function subscribeToAllOrders(callback: (orders: Order[]) => void): Unsubscribe {
  const q = query(ordersCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[];
    callback(orders);
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orderRef = doc(db, "orders", orderId);
  return updateDoc(orderRef, { status });
}