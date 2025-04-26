import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "./types";

const auth = getAuth();
const db = getFirestore();

export async function getCurrentUser(): Promise<User | null> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  try {
    const profileRef = doc(db, "profiles", currentUser.uid); // Reference to the profile in Firestore
    const profileSnap = await getDoc(profileRef); // Get the profile document

    if (!profileSnap.exists()) {
      // Create a default profile if none exists
      const defaultProfile = {
        full_name: currentUser.displayName || currentUser.email?.split("@")[0] || "User",
        avatar_url: null,
      };

      // Save the new profile to Firestore
      await setDoc(profileRef, defaultProfile);

      // Return the user information including the default profile
      return {
        id: currentUser.uid,
        name: defaultProfile.full_name,
        email: currentUser.email || "",
        avatarUrl: defaultProfile.avatar_url,
      };
    }

    // If the profile exists, return the data from Firestore
    const profileData = profileSnap.data();

    return {
      id: currentUser.uid,
      name: profileData.full_name || currentUser.email?.split('@')[0] || "User",
      email: currentUser.email || "",
      avatarUrl: profileData.avatar_url,
    };
  } catch (error) {
    console.error("Error fetching or creating profile:", error);
    return null;
  }
}
