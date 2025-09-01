import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { app, db } from '../firebase';

// Define types for better type safety
interface UserData {
  id: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

interface NoteData {
  title: string;
  content: string;
  category: string;
  tags: string;
  isPublic: boolean;
  [key: string]: unknown;
}

interface BusinessIdeaData {
  title: string;
  description: string;
  category: string;
  stage: string;
  industry: string;
  problem: string;
  solution: string;
  targetMarket: string;
  revenueModel: string;
  competitors: string;
  resources: string;
  timeline: string;
  budget: string;
  risks: string;
  nextSteps: string;
  [key: string]: unknown;
}

interface LibraryResourceData {
  title: string;
  type: string;
  topic: string;
  description: string;
  url: string;
  author: string;
  duration: string;
  difficulty: string;
  rating: number;
  notes: string;
  tags: string;
  isCompleted: boolean;
  isBookmarked: boolean;
  [key: string]: unknown;
}

// Authentication
export const auth = getAuth(app);

// Firestore Database
export const firestoreDb = getFirestore(app);

// Storage
export const storage = getStorage(app);

// User Management Functions
export const createUserDocument = async (clerkUserId: string, userData: UserData) => {
  try {
    const userRef = doc(db, 'users', clerkUserId);
    await setDoc(userRef, {
      uid: clerkUserId,
      email: userData.emailAddresses?.[0]?.emailAddress || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileComplete: false,
      ...userData
    });
    console.log('User document created successfully');
    return true;
  } catch (error) {
    console.error('Error creating user document:', error);
    return false;
  }
};

export const getUserDocument = async (clerkUserId: string) => {
  try {
    const userRef = doc(db, 'users', clerkUserId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
};

export const updateUserDocument = async (clerkUserId: string, updateData: Record<string, unknown>) => {
  try {
    const userRef = doc(db, 'users', clerkUserId);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    console.log('User document updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user document:', error);
    return false;
  }
};

// Notes Functions
export const createNote = async (clerkUserId: string, noteData: NoteData) => {
  try {
    const noteRef = await addDoc(collection(db, 'notes'), {
      ...noteData,
      userId: clerkUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('Note created successfully with ID:', noteRef.id);
    return noteRef.id;
  } catch (error) {
    console.error('Error creating note:', error);
    return null;
  }
};

export const getUserNotes = async (clerkUserId: string) => {
  try {
    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', clerkUserId)
    );
    const querySnapshot = await getDocs(notesQuery);
    const notes: Array<{ id: string; [key: string]: unknown }> = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    return notes;
  } catch (error) {
    console.error('Error getting user notes:', error);
    return [];
  }
};

// Business Ideas Functions
export const createBusinessIdea = async (clerkUserId: string, ideaData: BusinessIdeaData) => {
  try {
    const ideaRef = await addDoc(collection(db, 'businessIdeas'), {
      ...ideaData,
      userId: clerkUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('Business idea created successfully with ID:', ideaRef.id);
    return ideaRef.id;
  } catch (error) {
    console.error('Error creating business idea:', error);
    return null;
  }
};

export const getUserBusinessIdeas = async (clerkUserId: string) => {
  try {
    const ideasQuery = query(
      collection(db, 'businessIdeas'),
      where('userId', '==', clerkUserId)
    );
    const querySnapshot = await getDocs(ideasQuery);
    const ideas: Array<{ id: string; [key: string]: unknown }> = [];
    querySnapshot.forEach((doc) => {
      ideas.push({ id: doc.id, ...doc.data() });
    });
    return ideas;
  } catch (error) {
    console.error('Error getting user business ideas:', error);
    return [];
  }
};

// Library Functions
export const createLibraryResource = async (clerkUserId: string, resourceData: LibraryResourceData) => {
  try {
    const resourceRef = await addDoc(collection(db, 'libraryResources'), {
      ...resourceData,
      userId: clerkUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('Library resource created successfully with ID:', resourceRef.id);
    return resourceRef.id;
  } catch (error) {
    console.error('Error creating library resource:', error);
    return null;
  }
};

export const getUserLibraryResources = async (clerkUserId: string) => {
  try {
    const resourcesQuery = query(
      collection(db, 'libraryResources'),
      where('userId', '==', clerkUserId)
    );
    const querySnapshot = await getDocs(resourcesQuery);
    const resources: Array<{ id: string; [key: string]: unknown }> = [];
    querySnapshot.forEach((doc) => {
      resources.push({ id: doc.id, ...doc.data() });
    });
    return resources;
  } catch (error) {
    console.error('Error getting user library resources:', error);
    return [];
  }
};

// Export the app instance for other uses
export { app, db };
