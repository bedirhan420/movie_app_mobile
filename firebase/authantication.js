//authantication.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword as signIn } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBbauOCnkDMHA5mjp3h4MPGkRQjonHzgME",
    authDomain: "movie-app-a1232.firebaseapp.com",
    projectId: "movie-app-a1232",
    storageBucket: "movie-app-a1232.appspot.com",
    messagingSenderId: "204886806291",
    appId: "1:204886806291:web:e32305de0941a34557d4e6"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth();

const signInWithEmailAndPassword = async (email, password) => {
  return signIn(FIREBASE_AUTH, email, password);
};

export { FIREBASE_AUTH, signInWithEmailAndPassword };
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

export const changePassword = async (newPassword) => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      await user.updatePassword(newPassword);
      return "Password changed successfully";
    } else {
      throw new Error("No user is currently signed in.");
    }
  } catch (error) {
    throw error.message;
  }
};
