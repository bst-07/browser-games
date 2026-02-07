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

// LocalStorage: visitor vote tracker
let userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};

// 🔹 جلب count global من Firebase
db.ref('votes/' + slug).on('value', snapshot => {
  const data = snapshot.val() || { likes: 0, dislikes: 0 };
  likeCount.textContent = data.likes;
  dislikeCount.textContent = data.dislikes;

  // update UI buttons color
  if(userVotes[slug] === 'likes'){
    likeBtn.style.background = 'green';
    dislikeBtn.style.background = '';
  } else if(userVotes[slug] === 'dislikes'){
    dislikeBtn.style.background = 'red';
    likeBtn.style.background = '';
  } else {
    likeBtn.style.background = '';
    dislikeBtn.style.background = '';
  }
});

// 🔹 Function to send vote
function sendVote(type){
  const currentVote = userVotes[slug];

  if(currentVote === type) return; // no change

  db.ref('votes/' + slug).transaction(current => {
    if(!current) current = { likes: 0, dislikes: 0 };

    // decrease old vote if exists
    if(currentVote){
      current[currentVote] = Math.max((current[currentVote] || 1) - 1, 0);
    }

    // increase new vote
    current[type] = (current[type] || 0) + 1;
    return current;
  });

  // save visitor vote in LocalStorage
  userVotes[slug] = type;
  localStorage.setItem('userVotes', JSON.stringify(userVotes));
}

// 🔹 Attach click events
likeBtn.onclick = () => sendVote('likes');
dislikeBtn.onclick = () => sendVote('dislikes');
