import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* DOM */
const adminLogin = document.getElementById("adminLogin");
const postForm = document.getElementById("postForm");
const postsList = document.getElementById("postsList");
const loginMsg = document.getElementById("loginMsg");

let editPostId = null;

/* LOGIN */
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      adminEmail.value,
      adminPass.value
    );
    loginMsg.innerText = "Login successful";
  } catch (e) {
    loginMsg.innerText = e.message;
  }
});

/* AUTH STATE */
onAuthStateChanged(auth, user => {
  adminLogin.style.display = user ? "none" : "block";
  postForm.style.display = user ? "block" : "none";
  if (user) loadPosts();
});

/* CREATE / UPDATE POST */
submitPost.addEventListener("click", async () => {
  const title = postTitle.value;
  const content = postContent.value;

  if (!title || !content) {
    alert("Fill all fields");
    return;
  }

  if (editPostId) {
    await updateDoc(doc(db, "posts", editPostId), { title, content });
    editPostId = null;
  } else {
    await addDoc(collection(db, "posts"), {
      title,
      content,
      createdAt: serverTimestamp()
    });
  }

  postTitle.value = "";
  postContent.value = "";
  loadPosts();
});

/* LOAD POSTS */
async function loadPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  postsList.innerHTML = "";
  snap.forEach(d => {
    const p = d.data();
    postsList.innerHTML += `
      <div class="card">
        <h4>${p.title}</h4>
        <p>${p.content}</p>
        <button onclick="editPost('${d.id}','${p.title}','${p.content}')">Edit</button>
        <button onclick="deletePost('${d.id}')">Delete</button>
      </div>
    `;
  });
}

/* EDIT */
window.editPost = (id, t, c) => {
  editPostId = id;
  postTitle.value = t;
  postContent.value = c;
};

/* DELETE */
window.deletePost = async id => {
  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};
