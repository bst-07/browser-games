


document.addEventListener("DOMContentLoaded", () => {

  // 1. Fetch games JSON w create cards
  const loadGames = async () => {
    try {
      const res = await fetch('games.json');
      if (!res.ok) throw new Error("Cannot fetch games.json");
      const games = await res.json();

      const grid = document.getElementById('gamesGrid');
      grid.innerHTML = '';

      games.forEach(game => {
        const rating = game.rating ?? 0;
        const players = game.players ?? 0;
        const link = game.link || "#";

        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.title = game.title.toLowerCase(); // for search
        card.onclick = () => window.location.href = link;

        card.innerHTML = `
          <div class="game-thumb" style="background: ${game.gradient || 'gray'};">
            <img src="${game.thumbnail}" alt="${game.title}">
          </div>
          <div class="game-info">
            <h3>${game.title}</h3>
            <div class="game-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                ${rating}
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                ${players}
              </span>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });

      // 2. Search function (after cards loaded)
      const searchInput = document.getElementById("searchInput");
      searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        document.querySelectorAll(".game-card").forEach(card => {
          card.style.display = card.dataset.title.includes(value) ? "block" : "none";
        });
      });

    } catch (err) {
      console.error(err);
    }
  };

  loadGames(); // call async function

});
