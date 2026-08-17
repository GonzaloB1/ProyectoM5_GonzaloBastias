import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../services/firebase";
import type { UserRole } from "../types/user";

const googleProvider = new GoogleAuthProvider();

export async function registerWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(credential.user.uid, credential.user.email ?? email, "customer");
  return credential;
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  const existing = await getDoc(doc(db, "users", credential.user.uid));

  if (!existing.exists()) {
    await createUserDocument(credential.user.uid, credential.user.email ?? "", "customer");
  }

  return credential;
}

export async function logout() {
  return signOut(auth);
}

async function createUserDocument(uid: string, email: string, role: UserRole) {
  await setDoc(doc(db, "users", uid), { email, role });
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return snapshot.data().role as UserRole;
}