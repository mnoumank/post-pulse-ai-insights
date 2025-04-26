// src/utils/firebase.ts

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // assuming the Firebase initialization is here

export async function saveComparison(userId: string, comparisonData: object) {
  try {
    const comparisonsRef = collection(db, 'comparisons');
    await addDoc(comparisonsRef, {
      userId,
      ...comparisonData,
      createdAt: new Date(),
    });
    console.log('Comparison saved successfully');
  } catch (error) {
    console.error('Error saving comparison:', error);
    throw new Error('Error saving comparison');
  }
}
