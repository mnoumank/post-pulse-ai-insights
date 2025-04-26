import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "./types";
import { getCurrentUser } from "./profiles";

const auth = getAuth();
const db = getFirestore();

export async function login(email: string, password: string): Promise<User> {
  // Special handling for demo account
  if (email === "demo@example.com" && password === "password123") {
    return {
      id: "demo-user-id",
      name: "Demo User",
      email: "demo@example.com",
      avatarUrl: undefined,
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const profileRef = doc(db, "profiles", user.uid);
    const profileSnap = await getDoc(profileRef);

    const profileData = profileSnap.exists() ? profileSnap.data() : null;

    return {
      id: user.uid,
      name: profileData?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatarUrl: profileData?.avatar_url,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function register(email: string, password: string, name: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user profile to Firestore
    const profileRef = doc(db, "profiles", user.uid);
    await setDoc(profileRef, {
      full_name: name,
      avatar_url: null,
    });

    return {
      id: user.uid,
      name: name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatarUrl: undefined,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
