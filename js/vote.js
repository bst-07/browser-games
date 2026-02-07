
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

// Elements
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');
const ratingValue = document.getElementById('rating-value');
const ratingFill = document.getElementById('rating-fill');

const slug = document.querySelector('.game-container').dataset.slug;

let userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
let voteQueue = null;

// Update icon fill based on visitor vote
function updateIconFill(){
  const userVote = userVotes[slug]; 
  const likeIcon = document.querySelector('.like-icon');
  const dislikeIcon = document.querySelector('.dislike-icon');

  likeIcon.style.backgroundColor = '';
  dislikeIcon.style.backgroundColor = '';

  if(userVote === 'likes'){
    likeIcon.setAttribute('fill','currentColor');  
    dislikeIcon.setAttribute('fill','none');   
    likeIcon.style.backgroundColor = '#7dc597';

  } else if(userVote === 'dislikes'){
    dislikeIcon.setAttribute('fill','currentColor');
    likeIcon.setAttribute('fill','none');
    dislikeIcon.style.backgroundColor = '#eb8d8d';
  } else {
    likeIcon.setAttribute('fill','none');
    dislikeIcon.setAttribute('fill','none');
  }
}

// ⭐ Rating الحساب
function updateRating(likes, dislikes){
  const totalVotes = likes + dislikes;
  let rating = 0;

  if(totalVotes > 0){
    rating = (likes / totalVotes) * 10;
  }

  rating = rating.toFixed(1);

  ratingValue.textContent = rating;
  ratingFill.style.width = (rating * 10) + '%';

  // color change based on rating
  if(rating < 4){
    ratingFill.style.background = '#ff6b6b';
  } else if(rating < 7){
    ratingFill.style.background = '#f7b731';
  } else {
    ratingFill.style.background = '#26de81';
  }
}

// Listen to global votes in real-time
db.ref('votes/' + slug).on('value', snapshot => {
  const data = snapshot.val() || { likes: 0, dislikes: 0 };

  likeCount.textContent = data.likes;
  dislikeCount.textContent = data.dislikes;

  updateIconFill();
  updateRating(data.likes, data.dislikes);
});

// Push vote to Firebase
function pushVote(type){
  const oldVote = userVotes[slug];

  db.ref('votes/' + slug).transaction(current => {
    if(!current) current = { likes: 0, dislikes: 0 };

    if(oldVote){
      current[oldVote] = Math.max((current[oldVote] || 1) - 1, 0);
    }

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

// Handle clicks with debounce
function handleVote(type){
  if(voteQueue === type) return;
  voteQueue = type;

  setTimeout(() => {
    if(voteQueue) pushVote(voteQueue);
  }, 300);
}

likeBtn.onclick = () => handleVote('likes');
dislikeBtn.onclick = () => handleVote('dislikes');
