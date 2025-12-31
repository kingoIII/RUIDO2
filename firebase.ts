import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Placeholder config - in a real app these would be in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey_RuidoMarketplace",
  authDomain: "ruido-market.firebaseapp.com",
  projectId: "ruido-market",
  storageBucket: "ruido-market.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

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