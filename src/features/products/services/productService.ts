import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { Product } from "../types/product";

const productsCollection = collection(db, "products");

export async function getAllProducts(): Promise<Product[]> {
  const q = query(productsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    productsCollection,
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const snapshot = await getDocs(query(productsCollection, where("__name__", "==", id)));
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Product;
}