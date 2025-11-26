import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD3fPERlGwRNKOq5ze-duGCkwULTqHpKHU",
    authDomain: "thegreencoders.firebaseapp.com",
    projectId: "thegreencoders",
    storageBucket: "thegreencoders.firebasestorage.app",
    messagingSenderId: "957716963356",
    appId: "1:957716963356:web:b66fefead81b911ae3ffd9",
    measurementId: "G-9YNKS7N1TG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
