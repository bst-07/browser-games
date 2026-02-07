document.addEventListener('DOMContentLoaded', () => {
  const likeBtn = document.getElementById('like-btn');
  const dislikeBtn = document.getElementById('dislike-btn');
  const likeCount = document.getElementById('like-count');
  const dislikeCount = document.getElementById('dislike-count');

  const gameContainer = document.querySelector('.game-container');
  const slug = gameContainer.dataset.slug;

  // API URL ديال WordPress
  const API = "https://funzilo.com/wp-json/votes/v1";

  // function باش نجيب votes من WordPress
  function loadVotes() {
    fetch(`${API}/get?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        likeCount.textContent = data.likes || 0;
        dislikeCount.textContent = data.dislikes || 0;
      })
      .catch(err => console.error("Error loading votes:", err));
  }

  // function باش نصيفط vote جديد للWordPress
  function sendVote(type) {
    fetch(`${API}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, type })
    })
    .then(res => res.json())
    .then(data => {
      likeCount.textContent = data.likes || 0;
      dislikeCount.textContent = data.dislikes || 0;
    })
    .catch(err => console.error("Error sending vote:", err));
  }

  // attach events
  likeBtn.addEventListener('click', () => sendVote('likes'));
  dislikeBtn.addEventListener('click', () => sendVote('dislikes'));

  // load initial votes
  loadVotes();
});
