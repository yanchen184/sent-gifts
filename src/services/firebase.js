// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAw30zCDm_yKOuHFM8rlCTy6JelH9Wrog",
  authDomain: "sent-gifts.firebaseapp.com",
  projectId: "sent-gifts",
  storageBucket: "sent-gifts.firebasestorage.app",
  messagingSenderId: "156584281808",
  appId: "1:156584281808:web:9f7bbd775b151af36540d5",
  measurementId: "G-XR9LPKEJW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };
export default app;
