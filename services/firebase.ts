import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// ------------------------------------------------------------------
// INSTRUCTIONS:
// Since you don't have a .env file, paste your Firebase configuration 
// directly inside the quotes below.
// 
// You can find these in Firebase Console -> Project Settings -> General
// ------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyAVzBMI2W3VXUZ5sXVD8wChCzhvr1QmWqw",
  authDomain: "pricenexus-8956a.firebaseapp.com",
  projectId: "pricenexus-8956a",
  storageBucket: "pricenexus-8956a.firebasestorage.app",
  messagingSenderId: "514244614036",
  appId: "1:514244614036:web:fd664f32a4966dc8216181"
};

// ------------------------------------------------------------------

let app;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let githubProvider: GithubAuthProvider | null = null;

// Check if the user has actually pasted their keys (simple validation)
const isConfigured = firebaseConfig.apiKey && 
                     !firebaseConfig.apiKey.includes("PASTE_YOUR");

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
    console.log("✅ Firebase connected successfully.");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
    console.warn("⚠️ Firebase config is missing. Please edit services/firebase.ts to add your keys. App is running in Mock Mode.");
}

export { auth, db, googleProvider, githubProvider };