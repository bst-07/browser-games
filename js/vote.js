// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRNoFOHQ2bC6XTliivWfpGMBDfKnR9sko",
  authDomain: "general-games-2775e.firebaseapp.com",
  databaseURL: "https://general-games-2775e-default-rtdb.firebaseio.com",
  projectId: "general-games-2775e",
  storageBucket: "general-games-2775e.firebasestorage.app",
  messagingSenderId: "750591153144",
  appId: "1:750591153144:web:12c8207bc0aa08c2b43c0d",
  measurementId: "G-5HM7TYMGD9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const slug = document.querySelector('.game-container').dataset.slug;
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');

// Listen for changes in votes
db.ref('votes/' + slug).on('value', snapshot => {
  const data = snapshot.val() || { likes: 0, dislikes: 0 };
  likeCount.textContent = data.likes;
  dislikeCount.textContent = data.dislikes;
});

// Function to send vote
function sendVote(type){
  db.ref('votes/' + slug).transaction(current => {
    if(current){
      current[type] = (current[type] || 0) + 1;
    } else {
      current = { likes: 0, dislikes: 0 };
      current[type] = 1;
    }
    return current;
  });
}

// Attach click events
likeBtn.onclick = () => sendVote('likes');
dislikeBtn.onclick = () => sendVote('dislikes');
