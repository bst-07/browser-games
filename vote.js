document.addEventListener('DOMContentLoaded', () => {
  const likeBtn = document.getElementById('like-btn');
  const dislikeBtn = document.getElementById('dislike-btn');
  const likeCount = document.getElementById('like-count');
  const dislikeCount = document.getElementById('dislike-count');

  const gameContainer = document.querySelector('.game-container');
  const slug = gameContainer.dataset.slug;

  // Load votes and user vote from localStorage
  const votes = JSON.parse(localStorage.getItem('votes')) || {};
  const userVotes = JSON.parse(localStorage.getItem('userVotes')) || {}; // stores 'like' or 'dislike'

  // Initialize votes if missing
  if (!votes[slug]) votes[slug] = { likes: 0, dislikes: 0 };

  // Display initial counts
  likeCount.textContent = votes[slug].likes;
  dislikeCount.textContent = votes[slug].dislikes;

  function updateVote(newVote) {
    const oldVote = userVotes[slug]; // current vote of user

    if (oldVote === newVote) return; // no change

    // Decrease old vote if exists
    if (oldVote) {
      votes[slug][oldVote]--;
    }

    // Increase new vote
    votes[slug][newVote]++;

    // Save new vote
    userVotes[slug] = newVote;

    // Update localStorage
    localStorage.setItem('votes', JSON.stringify(votes));
    localStorage.setItem('userVotes', JSON.stringify(userVotes));

    // Update UI
    likeCount.textContent = votes[slug].likes;
    dislikeCount.textContent = votes[slug].dislikes;
  }

  // Attach events
  likeBtn.addEventListener('click', () => updateVote('likes'));
  dislikeBtn.addEventListener('click', () => updateVote('dislikes'));
});
