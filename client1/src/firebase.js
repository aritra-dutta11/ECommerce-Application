// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAt96VNJLCjwfcKnYmSv-DV8ugGeCTejA",
    authDomain: "ecommerce-1289e.firebaseapp.com",
    projectId: "ecommerce-1289e",
    storageBucket: "ecommerce-1289e.appspot.com",
    messagingSenderId: "61367241662",
    appId: "1:61367241662:web:248a3bf4bd6cde6330c7ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app