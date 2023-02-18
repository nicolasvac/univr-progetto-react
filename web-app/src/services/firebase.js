// import firebase from "firebase/compat/app"
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
import { doc, getFirestore, collection } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ID,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth = getAuth();
export const db = getFirestore();

export const collections = {
    patients: collection(db, "patients"),
    workouts: collection(db, "workouts"),
}

export const documents = {
    patient: (uid) => doc(db, "patients", uid),
}
