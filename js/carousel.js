/* ============================================================
   carousel.js — CAROUSEL & SLIDER FUNCTIONS
   Covers: Portfolio horizontal carousel, Blog auto-scroll slider.
   Uses CARD_WIDTH and AUTO_SLIDE_MS constants from data.js.
   ============================================================ */


/* ========================= PORTFOLIO CAROUSEL ========================= */
/* Apple-style: snap scrolling + momentum touch + smart click vs drag */
function initPortfolioCarousel() {
  const grid    = document.getElementById("projects-grid");
  const prevBtn = document.getElementById("portfolio-prev");
  const nextBtn = document.getElementById("portfolio-next");
  if (!grid || !prevBtn || !nextBtn) return;

  // Snap scrolling — cards lock into place like iPhone Photos app
  grid.style.scrollSnapType          = "x mandatory";
  grid.style.webkitOverflowScrolling = "touch";
  grid.querySelectorAll(".project-card").forEach(card => {
    card.style.scrollSnapAlign = "start";
  });

  // ----- Button scrolling -----
  prevBtn.addEventListener("click", () => { grid.scrollBy({ left: -CARD_WIDTH, behavior: "smooth" }); });
  nextBtn.addEventListener("click", () => { grid.scrollBy({ left:  CARD_WIDTH, behavior: "smooth" }); });

  // ----- Touch swipe with momentum (mobile) -----
  // Tracks finger speed — the faster you flick, the further it glides
  let startX = 0, startScroll = 0, lastX = 0, velocity = 0, lastTime = 0, isTouching = false;

  grid.addEventListener("touchstart", e => {
    startX = lastX = e.touches[0].clientX;
    startScroll = grid.scrollLeft;
    lastTime = Date.now();
    isTouching = true;
    velocity = 0;
  }, { passive: true });

  grid.addEventListener("touchmove", e => {
    if (!isTouching) return;
    const moveX = e.touches[0].clientX;
    const now   = Date.now();
    velocity    = (lastX - moveX) / (now - lastTime || 1); // px per ms
    lastX       = moveX;
    lastTime    = now;
    grid.scrollLeft = startScroll + (startX - moveX); // 1:1 finger tracking
  }, { passive: true });

  grid.addEventListener("touchend", () => {
    isTouching = false;
    grid.scrollBy({ left: velocity * 80, behavior: "smooth" }); // momentum flick
  });

  // ----- Mouse drag (desktop) -----
  // Smart detection: short move = click (opens modal), long move = drag
  let isMouseDown = false, mouseStartX = 0, mouseScrollStart = 0, hasDragged = false;

  grid.addEventListener("mousedown", e => {
    isMouseDown = true;
    hasDragged  = false;
    mouseStartX = e.clientX;
    mouseScrollStart = grid.scrollLeft;
    grid.classList.add("grabbing");
  });

  grid.addEventListener("mousemove", e => {
    if (!isMouseDown) return;
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 5) hasDragged = true; // only drag if moved more than 5px
    grid.scrollLeft = mouseScrollStart + diff;
  });

  grid.addEventListener("mouseup", () => {
    isMouseDown = false;
    grid.classList.remove("grabbing");
    // Snap to nearest card after drag
    if (hasDragged) {
      const nearest = Math.round(grid.scrollLeft / CARD_WIDTH) * CARD_WIDTH;
      grid.scrollTo({ left: nearest, behavior: "smooth" });
    }
  });

  grid.addEventListener("mouseleave", () => {
    if (isMouseDown) { isMouseDown = false; grid.classList.remove("grabbing"); }
  });

  // Clone first 2 cards for infinite loop effect
  const cloneCount = Math.min(2, grid.children.length);
  Array.from(grid.children).slice(0, cloneCount).forEach(c => grid.appendChild(c.cloneNode(true)));
}


/* ========================= BLOG CAROUSEL ========================= */
/* Auto-slides on desktop, momentum touch swipe on mobile */
function initBlogCarousel() {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  // Snap scrolling for blog cards too
  grid.style.scrollSnapType          = "x mandatory";
  grid.style.webkitOverflowScrolling = "touch";
  grid.querySelectorAll(".blog-card").forEach(card => {
    card.style.scrollSnapAlign = "start";
  });

  // Auto-slide on desktop — loops back to start when it reaches the end
  if (window.innerWidth > 768) {
    setInterval(() => {
      const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 5;
      atEnd
        ? grid.scrollTo({ left: 0, behavior: "smooth" })
        : grid.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
    }, AUTO_SLIDE_MS);
  }

  // Touch swipe with momentum on mobile
  if (window.innerWidth <= 768) {
    let startX = 0, startScroll = 0, lastX = 0, velocity = 0, lastTime = 0, isTouching = false;

    grid.addEventListener("touchstart", e => {
      startX = lastX = e.touches[0].clientX;
      startScroll = grid.scrollLeft;
      lastTime = Date.now();
      isTouching = true;
      velocity = 0;
    }, { passive: true });

    grid.addEventListener("touchmove", e => {
      if (!isTouching) return;
      const moveX = e.touches[0].clientX;
      const now   = Date.now();
      velocity    = (lastX - moveX) / (now - lastTime || 1);
      lastX       = moveX;
      lastTime    = now;
      grid.scrollLeft = startScroll + (startX - moveX);
    }, { passive: true });

    grid.addEventListener("touchend", () => {
      isTouching = false;
      grid.scrollBy({ left: velocity * 80, behavior: "smooth" });
    });
  }
}
