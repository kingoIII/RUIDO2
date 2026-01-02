import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Placeholder config - in a real app these would be in environment variables
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq0Y0kh1STLtPB8b5ZUgH-DEecZq4pb1o",
  authDomain: "ruido-auth.firebaseapp.com",
  projectId: "ruido-auth",
  storageBucket: "ruido-auth.firebasestorage.app",
  messagingSenderId: "924032043558",
  appId: "1:924032043558:web:b4727f12df9a1082a934e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return null;
  }
};

export const logout = () => signOut(auth); 