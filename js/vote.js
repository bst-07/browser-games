
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

const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');

const slug = document.querySelector('.game-container').dataset.slug;

let userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
let voteQueue = null;

// Update icon fill based on visitor vote
function updateIconFill(){
  const userVote = userVotes[slug]; 
  const likeIcon = document.querySelector('.like-icon');
  const dislikeIcon = document.querySelector('.dislike-icon');

  if(userVote === 'likes'){
    likeIcon.setAttribute('fill','currentColor');  
    dislikeIcon.setAttribute('fill','none');       
  } else if(userVote === 'dislikes'){
    dislikeIcon.setAttribute('fill','currentColor');
    likeIcon.setAttribute('fill','none');
  } else {
    likeIcon.setAttribute('fill','none');
    dislikeIcon.setAttribute('fill','none');
  }
}

// Listen to global votes in real-time
db.ref('votes/' + slug).on('value', snapshot => {
  const data = snapshot.val() || { likes: 0, dislikes: 0 };
  likeCount.textContent = data.likes;
  dislikeCount.textContent = data.dislikes;
  updateIconFill();
});

// Push vote to Firebase
function pushVote(type){
  const oldVote = userVotes[slug];

  db.ref('votes/' + slug).transaction(current => {
    if(!current) current = { likes: 0, dislikes: 0 };

    if(oldVote) current[oldVote] = Math.max((current[oldVote] || 1) - 1, 0);
    current[type] = (current[type] || 0) + 1;

    return current;
  }, (error, committed) => {
    if(committed){
      userVotes[slug] = type;
      localStorage.setItem('userVotes', JSON.stringify(userVotes));
      voteQueue = null;
      updateIconFill();
    } else if(error){
      console.error(error);
    }
  });
}

// Handle clicks with cache (debounce)
function handleVote(type){
  if(voteQueue === type) return;
  voteQueue = type;
  setTimeout(() => {
    if(voteQueue) pushVote(voteQueue);
  }, 300);
}

likeBtn.onclick = () => handleVote('likes');
dislikeBtn.onclick = () => handleVote('dislikes');
