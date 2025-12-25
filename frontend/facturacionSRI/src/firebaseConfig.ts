// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA8mHKxYmKZ_n44GSeSVwcXwM-E0lK9Eo",
  authDomain: "facturacion-electronica-eb12b.firebaseapp.com",
  projectId: "facturacion-electronica-eb12b",
  storageBucket: "facturacion-electronica-eb12b.firebasestorage.app",
  messagingSenderId: "1043619954334",
  appId: "1:1043619954334:web:ab39e76e910ba1e460858f",
  measurementId: "G-4GBBLL37SX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);