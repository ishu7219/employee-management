// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your Firebase config (your own credentials)
const firebaseConfig = {
  apiKey: "AIzaSyCr3Acxn1rtAEiH1-1VNDFkphmZbYil9SY",
  authDomain: "employeefire-4ee96.firebaseapp.com",
  databaseURL: "https://employeefire-4ee96-default-rtdb.firebaseio.com",
  projectId: "employeefire-4ee96",
  storageBucket: "employeefire-4ee96.firebasestorage.app",
  messagingSenderId: "853297636253",
  appId: "1:853297636253:web:6a28f90b9e6638f9dc0574",
  measurementId: "G-1JW6YZVN5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// Register Function
window.registerUser = async function () {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const username = document.getElementById("regUsername").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(db, "employees/" + userCred.user.uid), {
      username,
      email,
      role: "user",
      leaves: 0
    });
    alert("Registration successful! You can now log in.");
    toggleForm();
  } catch (error) {
    alert(error.message);
  }
};

// Login Function
window.loginUser = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful!");
    // Redirect
    window.location.href = "leave-management.html";
  } catch (error) {
    alert(error.message);
  }
};

// Google Sign-In
window.googleSignIn = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await set(ref(db, "employees/" + user.uid), {
      username: user.displayName,
      email: user.email,
      role: "user",
      leaves: 0
    });
    alert("Google Sign-in Successful!");
    window.location.href = "leave-management.html";
  } catch (error) {
    alert(error.message);
  }
};

// Toggle between forms
window.toggleForm = function () {
  const login = document.getElementById("login-form");
  const register = document.getElementById("register-form");
  const title = document.getElementById("form-title");

  if (login.style.display === "none") {
    login.style.display = "block";
    register.style.display = "none";
    title.innerText = "Sign In";
  } else {
    login.style.display = "none";
    register.style.display = "block";
    title.innerText = "Register";
  }
};

// Password Strength Check
window.checkPasswordStrength = function (password) {
  const msg = document.getElementById("password-check");
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (regex.test(password)) {
    msg.style.color = "green";
    msg.textContent = "✅ Strong password!";
  } else {
    msg.style.color = "red";
    msg.textContent = "❌ Must have uppercase, lowercase, number, and symbol (8+ chars)";
  }
};
