/* ============================================================
   script.js — ENTRY POINT
   This file controls everything. It starts the whole portfolio.

   FILE STRUCTURE:
   js/
   ├── script.js   ← YOU ARE HERE — starts everything
   ├── data.js     ← all data: projects, blog posts, skills
   ├── render.js   ← builds HTML: cards, modal, blog modal, form
   ├── carousel.js ← portfolio + blog sliders
   ├── ui.js       ← navbar, dark mode, menu, particles, gallery
   ├── search.js   ← Ctrl+K spotlight search
   └── utils.js    ← helper functions

   LOAD ORDER IN index.html (must be in this exact order):
   <script src="js/data.js"></script>
   <script src="js/utils.js"></script>
   <script src="js/render.js"></script>
   <script src="js/carousel.js"></script>
   <script src="js/ui.js"></script>
   <script src="js/search.js"></script>
   <script src="js/script.js"></script>
   ============================================================ */


document.addEventListener("DOMContentLoaded", () => {

  /* --- UI & Layout --- */
  initProgressBar();       // scroll progress bar at top              → ui.js
  initNavbar();            // frosted glass, scroll spy, sliding pill  → ui.js
  initDarkMode();          // dark/light toggle + localStorage          → ui.js
  initMobileMenu();        // slide-in panel, backdrop, Escape key     → ui.js
  initParticles();         // floating dots on hero canvas             → ui.js
  initBackTop();           // back to top button                       → ui.js

  /* --- Content Rendering --- */
  renderProjects();        // build project cards from data.js         → render.js
  renderBlog();            // build blog cards from data.js            → render.js
  renderSkills();          // build skill bars from data.js            → render.js
  initSkillsObserver();    // animate skill bars on scroll             → ui.js
  initForm();              // contact form validation + Formspree      → render.js

  /* --- Carousels --- */
  initPortfolioCarousel(); // snap scroll, drag, touch, buttons        → carousel.js
  initBlogCarousel();      // auto-slide desktop, touch swipe mobile   → carousel.js

  /* --- Gallery --- */
  initGallery();           // slides, thumbnails, lightbox, filters    → ui.js

  /* --- Search --- */
  initSearch();            // Ctrl+K spotlight search                  → search.js

  /* --- Project Modal --- */
  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  document.getElementById("modal")?.addEventListener("click", e => {
    if (e.target === e.currentTarget) closeModal();
  });

  /* --- Blog Modal --- */
  document.getElementById("blog-modal-close")?.addEventListener("click", closeBlogModal);
  document.getElementById("blog-modal")?.addEventListener("click", e => {
    if (e.target === e.currentTarget) closeBlogModal();
  });

});