import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlnHswacdCS03as6OXsdkrvAVNBMk1uv4",
  authDomain: "cphino-knowledgehub.firebaseapp.com",
  projectId: "cphino-knowledgehub",
  storageBucket: "cphino-knowledgehub.appspot.com",
  messagingSenderId: "1047808575898",
  appId: "1:1047808575898:web:dcb42a93d286303d35d223"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);




