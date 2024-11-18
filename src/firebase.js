import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCn9r0lxDk1FWaQgE1U3IzaHk8fcGzR6_o",
  authDomain: "budgettracker-6af4a.firebaseapp.com",
  projectId: "budgettracker-6af4a",
  storageBucket: "budgettracker-6af4a.firebasestorage.app",
  messagingSenderId: "352072506371",
  appId: "1:352072506371:web:f75d176887ae8ea0384236",
  measurementId: "G-Q6MF72HJF5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;