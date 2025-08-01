import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "./firebase";

// Collection name for gifts
const COLLECTION_NAME = "gifts";

/**
 * Add a new person to the gift list
 * @param {string} name - Person's name
 * @param {string} status - Gift status (not-sent, preparing, sent)
 * @returns {Promise} - Document reference
 */
export const addPerson = async (name, status = "not-sent") => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      name: name.trim(),
      status: status,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef;
  } catch (error) {
    console.error("Error adding person:", error);
    throw error;
  }
};

/**
 * Get all people from the gift list
 * @returns {Promise<Array>} - Array of people with their data
 */
export const getAllPeople = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const people = [];
    querySnapshot.forEach((doc) => {
      people.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return people;
  } catch (error) {
    console.error("Error getting people:", error);
    throw error;
  }
};

/**
 * Update person's gift status
 * @param {string} id - Document ID
 * @param {string} status - New status
 * @returns {Promise} - Update result
 */
export const updatePersonStatus = async (id, status) => {
  try {
    const personRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(personRef, {
      status: status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating person status:", error);
    throw error;
  }
};

/**
 * Delete a person from the gift list
 * @param {string} id - Document ID
 * @returns {Promise} - Delete result
 */
export const deletePerson = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting person:", error);
    throw error;
  }
};

/**
 * Listen to real-time updates
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} - Unsubscribe function
 */
export const listenToPeople = (callback) => {
  return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
    const people = [];
    snapshot.forEach((doc) => {
      people.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(people);
  });
};
