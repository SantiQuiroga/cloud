import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2j8r0ncve53MkQSUZWlEUIdm6lqf6h4g",
  authDomain: "auth-cloud-ea380.firebaseapp.com",
  projectId: "auth-cloud-ea380",
  storageBucket: "auth-cloud-ea380.firebasestorage.app",
  messagingSenderId: "955539850410",
  appId: "1:955539850410:web:f1b4a321c3423621d5bcd3",
  measurementId: "G-9FSB2E2LEY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  auth,
  db,
  storage,
  googleProvider,
  facebookProvider,
  linkWithPopup,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
};
