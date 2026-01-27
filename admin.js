import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";


/* DOM */
const loginBox = document.getElementById("loginBox");
const editor = document.getElementById("editor");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const publishBtn = document.getElementById("publishBtn");
const postsDiv = document.getElementById("posts");

/* LOGIN */
loginBtn?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert(e.message);
  }
});

/* LOGOUT */
logoutBtn?.addEventListener("click", () => signOut(auth));

/* AUTH STATE */
onAuthStateChanged(auth, user => {
  if (user) {
    loginBox.style.display = "none";
    editor.style.display = "block";
    loadPosts();
  } else {
    loginBox.style.display = "block";
    editor.style.display = "none";
  }
});

/* CREATE / UPDATE */
publishBtn?.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const postId = document.getElementById("postId").value;

  if (!title || !content) return alert("Fill all fields");

  if (postId) {
    await updateDoc(doc(db, "posts", postId), { title, content });
  } else {
    await addDoc(collection(db, "posts"), {
      title,
      content,
      createdAt: new Date()
    });
  }

  clearForm();
  loadPosts();
});

/* LOAD POSTS */
async function loadPosts() {
  postsDiv.innerHTML = "";
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  snap.forEach(d => {
    const data = d.data();
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h4>${data.title}</h4>
      <p>${data.content}</p>
      <div class="actions">
        <button class="btn edit">Edit</button>
        <button class="btn danger delete">Delete</button>
      </div>
    `;
    div.querySelector(".edit").onclick = () => editPost(d.id, data);
    div.querySelector(".delete").onclick = () => deletePost(d.id);
    postsDiv.appendChild(div);
  });
}

/* EDIT */
function editPost(id, data) {
  document.getElementById("postId").value = id;
  document.getElementById("title").value = data.title;
  document.getElementById("content").value = data.content;
}

/* DELETE */
async function deletePost(id) {
  if (confirm("Delete this post?")) {
    await deleteDoc(doc(db, "posts", id));
    loadPosts();
  }
}

/* RESET */
function clearForm() {
  document.getElementById("postId").value = "";
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}
