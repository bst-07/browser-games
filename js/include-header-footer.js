document.addEventListener("DOMContentLoaded", () => {

  const loadHTML = async (url, selector) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Cannot load ${url}`);
      const html = await res.text();
      document.querySelector(selector).innerHTML = html;
    } catch (err) {
      console.error(err);
    }
  };

  // Load header and footer
  loadHTML("/browser-games/partials/header.html", "header");
  loadHTML("/browser-games/partials/footer.html", "footer");

});
