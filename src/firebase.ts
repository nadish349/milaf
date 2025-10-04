// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWl6Wz1an7-S_4aRbzVcSVMC0lUkJutW8",
  authDomain: "milafcola-australia.firebaseapp.com",
  projectId: "milafcola-australia",
  storageBucket: "milafcola-australia.firebasestorage.app",
  messagingSenderId: "1068019674339",
  appId: "1:1068019674339:web:0adc17c23247d22b7269d6",
  measurementId: "G-74EMSMTF6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported (handles development environment)
let analytics = null;
isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };

