import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { Product, NewProduct } from "../types/product";

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
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Product;
}

export function subscribeToAllProducts(callback: (products: Product[]) => void): Unsubscribe {
  const q = query(productsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    callback(products);
  });
}

export async function createProduct(newProduct: NewProduct) {
  return addDoc(productsCollection, {
    ...newProduct,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, data: Partial<NewProduct>) {
  const productRef = doc(db, "products", id);
  return updateDoc(productRef, data);
}

export async function deleteProduct(id: string) {
  const productRef = doc(db, "products", id);
  return deleteDoc(productRef);
}