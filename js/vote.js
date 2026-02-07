
// Define colors
const ACCENT_COLOR = "#48a8fa"; // color for the voted icon
const STROKE_COLOR = "#000";  
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
   // color for non-voted icons

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');

const slug = document.querySelector('.game-container').dataset.slug;

// Visitor vote cache
let userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
let voteQueue = null;

// Update icon colors based on vote
function updateIconColors() {
  const vote = userVotes[slug];
  const likeIcon = document.querySelector('.like-icon');
  const dislikeIcon = document.querySelector('.dislike-icon');

  if (vote === 'likes') {
    likeIcon.setAttribute('fill', ACCENT_COLOR);   // liked icon fill
    likeIcon.setAttribute('stroke', ACCENT_COLOR);
    dislikeIcon.setAttribute('fill', 'none');      // disliked icon reset
    dislikeIcon.setAttribute('stroke', STROKE_COLOR);
  } else if (vote === 'dislikes') {
    dislikeIcon.setAttribute('fill', ACCENT_COLOR); // disliked icon fill
    dislikeIcon.setAttribute('stroke', ACCENT_COLOR);
    likeIcon.setAttribute('fill', 'none');          // liked icon reset
    likeIcon.setAttribute('stroke', STROKE_COLOR);
  } else {
    likeIcon.setAttribute('fill', 'none');          
    likeIcon.setAttribute('stroke', STROKE_COLOR);
    dislikeIcon.setAttribute('fill', 'none');
    dislikeIcon.setAttribute('stroke', STROKE_COLOR);
  }
}

// Listen Firebase real-time votes
db.ref('votes/' + slug).on('value', snapshot => {
  const data = snapshot.val() || { likes: 0, dislikes: 0 };
  likeCount.textContent = data.likes;
  dislikeCount.textContent = data.dislikes;
  updateIconColors();
});

// Push vote to Firebase with transaction
function pushVote(type) {
  const oldVote = userVotes[slug];

  db.ref('votes/' + slug).transaction(current => {
    if (!current) current = { likes: 0, dislikes: 0 };

    if (oldVote && current[oldVote] > 0) current[oldVote]--;
    current[type] = (current[type] || 0) + 1;
    return current;
  }, (err, committed) => {
    if (committed) {
      userVotes[slug] = type; 
      localStorage.setItem('userVotes', JSON.stringify(userVotes));
      voteQueue = null;
      updateIconColors();
    } else if (err) {
      console.error(err);
    }
  });
}

// Debounce rapid votes
function handleVote(type) {
  if (voteQueue === type) return;
  voteQueue = type;
  setTimeout(() => {
    if (voteQueue) pushVote(voteQueue);
  }, 300);
}

// Attach events
likeBtn.onclick = () => handleVote('likes');
dislikeBtn.onclick = () => handleVote('dislikes');

// Initialize on load
updateIconColors();

