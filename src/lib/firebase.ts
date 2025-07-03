// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXV8bZXRyalo_fbJrvGTpngRtfefJb5xo",
  authDomain: "bola8-dd429.firebaseapp.com",
  projectId: "bola8-dd429",
  storageBucket: "bola8-dd429.appspot.com",
  messagingSenderId: "640292246805",
  appId: "1:640292246805:web:75a573f8f07833d245051c",
  measurementId: "G-5VM3C9JG2P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { app };
