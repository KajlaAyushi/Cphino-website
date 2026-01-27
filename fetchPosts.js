import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const postsContainer = document.getElementById("postsList");

async function loadPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    postsContainer.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  postsContainer.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    const url = window.location.href;

    postsContainer.innerHTML += `
      <div class="post-card">
        <h3>${d.title}</h3>
        <p>${d.content}</p>
        <div class="share">
          <a target="_blank"
            href="https://www.linkedin.com/sharing/share-offsite/?url=${url}">
            Share on LinkedIn
          </a>
        </div>
      </div>
    `;
  });
}

loadPosts();
