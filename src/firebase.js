// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";

// call this initializeapp function providied by firebase.we passed the config in it
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD4_OpraWlp7TrvCwf-AS1Kghlq0HO0HKg",
  authDomain: "instagram-clone-react-2172f.firebaseapp.com",
  databaseURL:
    "https://instagram-clone-react-2172f-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-2172f",
  storageBucket: "instagram-clone-react-2172f.appspot.com",
  messagingSenderId: "901639087742",
  appId: "1:901639087742:web:4c5839c3eac815fdb91a2f",
  measurementId: "G-M3E0R8SMHS",
});

// grabbing 3 services from firebase nd storing in the 3 variables
// access the db
const db = firebaseApp.firestore();
// acces the authenetication[login logout]
const auth = firebase.auth();
// access the storage
const storage = firebase.storage();

export { db, auth, storage };
