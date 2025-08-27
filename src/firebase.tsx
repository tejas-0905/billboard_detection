// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHyG_mKJufiM5iVyPpek4hBXimVqtv4A4",
  authDomain: "billboard-7f8fe.firebaseapp.com",
  projectId: "billboard-7f8fe",
  storageBucket: "billboard-7f8fe.firebasestorage.app",
  messagingSenderId: "1053020356194",
  appId: "1:1053020356194:web:6bb9e185ed399dea379b3b",
  measurementId: "G-2SRFB1M133"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

