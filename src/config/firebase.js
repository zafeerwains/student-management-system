// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4lUUOmNoseU9MXFeSO_fbM6yCMmKMQLw",
  authDomain: "hackathon-08-10-2023.firebaseapp.com",
  projectId: "hackathon-08-10-2023",
  storageBucket: "hackathon-08-10-2023.appspot.com",
  messagingSenderId: "829797641258",
  appId: "1:829797641258:web:179d8cedb428ca01786753",
  measurementId: "G-Q9ZRVMLY2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app}