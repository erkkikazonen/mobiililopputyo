import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCOaZqX18AQeQbPCTPL_4wJz2UbXw_MNb8",
  authDomain: "lopputyo-ca527.firebaseapp.com",
  databaseURL: "https://lopputyo-ca527-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lopputyo-ca527",
  storageBucket: "lopputyo-ca527.appspot.com",
  messagingSenderId: "522184224458",
  appId: "1:522184224458:web:79ad27ce11ec6390d84e33"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };