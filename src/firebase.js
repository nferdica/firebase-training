import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDyMi7oLZp9k-bFBMBOyEm-MCoxwWYowzI",
    authDomain: "curso-app-c2186.firebaseapp.com",
    projectId: "curso-app-c2186",
    storageBucket: "curso-app-c2186.appspot.com",
    messagingSenderId: "548649266831",
    appId: "1:548649266831:web:f7ed28a4ad5260245b4afa",
    measurementId: "G-TSPTRT3FTW"
  };

  const firebaseApp = initializeApp(firebaseConfig)
  const db = getFirestore(firebaseApp)

  export {db}