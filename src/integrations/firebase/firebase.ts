// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore'; //// fixed import

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBik1vcrsjkxgGdy2pAkKiE_ngIpVtLYi0",
  authDomain: "informationsec-443c0.firebaseapp.com",
  projectId: "informationsec-443c0",
  storageBucket: "informationsec-443c0.firebasestorage.app",
  messagingSenderId: "455438954950",
  appId: "1:455438954950:web:b76842a3f684f8f8ff02c7"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export { db }; 

// Function to save user profile to Firestore
async function saveUserProfile(userId: string, displayName: string | null, email: string | null) {
  try {
    const profileRef = doc(db, 'profiles', userId); 
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      const defaultProfile = {
        full_name: displayName || email?.split('@')[0] || "User",  
        avatar_url: null,  
      };

      await setDoc(profileRef, defaultProfile);
      console.log("Profile created for:", userId);
    } else {
      console.log("Profile already exists for:", userId);
    }
  } catch (error) {
    console.error("Error saving user profile:", error);  
  }
}

// Function to save a user's comparison data to Firestore
export const saveComparison = async (userId: string, comparisonData: any) => {
  try {
    console.log('Attempting to save comparison data to Firestore:', comparisonData); //// debug line
    const historyRef = collection(db, 'history', userId, 'history'); //// fixed path

    // Ensure the parent document exists before adding to the subcollection
    const userHistoryDocRef = doc(db, 'history', userId);
    const userHistoryDocSnap = await getDoc(userHistoryDocRef);

    if (!userHistoryDocSnap.exists()) {
      await setDoc(userHistoryDocRef, {}); // Create the parent document if it doesn't exist
      console.log("Parent document created for user:", userId);
    }

    await addDoc(historyRef, comparisonData); //// use addDoc
    console.log("Comparison saved successfully for user:", userId);
  } catch (error) {
    console.error('Error saving comparison:', error);
    throw new Error('Failed to save comparison data');
  }
};

// Function to get all comparisons for a user
export const getComparisons = async (userId: string) => {
  try {
    const historyRef = collection(db, 'history', userId, 'history'); //// fixed path
    const querySnapshot = await getDocs(historyRef); //// get all docs inside history subcollection

    const comparisons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return comparisons;  
  } catch (error) {
    console.error("Error fetching comparisons:", error);  
    return [];  
  }
}

// Listen to authentication state changes and save profile on login
onAuthStateChanged(auth, async (user: User | null) => {
  if (user) {
    try {
      await saveUserProfile(user.uid, user.displayName, user.email);
    } catch (error) {
      console.error("Error handling auth state change:", error);  
    }
  } else {
    console.log("User logged out");
  }
});
