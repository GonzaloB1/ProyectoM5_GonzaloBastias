import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { Order, NewOrder } from "../types/order";

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