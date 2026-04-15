/* ============================================================
   ui.js — ALL UI BEHAVIOUR
   Covers: Progress bar, Navbar, Dark mode, Mobile menu,
           Particles, Gallery + Lightbox, Skills animation,
           Back to top button.
   Uses scrollToSection() from utils.js.
   ============================================================ */


/* ========================= SCROLL PROGRESS BAR ========================= */
/* Fills the thin gradient line at the very top as the user scrolls */
function initProgressBar() {
  const fill = document.getElementById("nav-progress-fill");
  if (!fill) return;
  window.addEventListener("scroll", () => {
    const max = document.body.scrollHeight - window.innerHeight;
    fill.style.width = max > 0 ? (window.scrollY / max) * 100 + "%" : "0%";
  }, { passive: true });
}


/* ========================= NAVBAR ========================= */
/* Frosted glass on scroll, scroll spy active link, sliding pill indicator */
function initNavbar() {
  const navbar   = document.getElementById("navbar");
  const sections = ["home", "about", "gallery", "portfolio", "blog", "contact"];
  const links    = document.querySelectorAll(".nav-links a");
  const pill     = document.getElementById("nav-pill");

  // Moves the sliding pill behind whichever link is active
  function movePill(activeLink) {
    if (!pill || !activeLink) return;
    const navRect  = document.querySelector(".nav-links").getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    pill.style.left  = (linkRect.left - navRect.left) + "px";
    pill.style.width = linkRect.width + "px";
  }

  function onScroll() {
    if (!navbar) return;
    // Frosted glass after scrolling 20px
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    // Scroll spy — find which section is in view
    let current = "home";
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 160) current = id;
    });
    // Update active link and slide the pill
    links.forEach(a => {
      const isActive = a.dataset.section === current;
      a.classList.toggle("active", isActive);
      if (isActive) movePill(a);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true }); // reposition pill on resize
  setTimeout(onScroll, 50); // run once on load so pill is in place immediately

  // Smooth scroll on desktop nav link click
  links.forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.section);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    });
  });
}


/* ========================= DARK MODE ========================= */
/* Toggles dark class on body and saves preference to localStorage */
function initDarkMode() {
  const toggles = document.querySelectorAll("#dark-toggle, #dark-toggle-desktop");
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  });
}


/* ========================= MOBILE MENU ========================= */
/* Slide-in panel from the right with blurred backdrop */
function initMobileMenu() {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeBtn   = document.getElementById("mobile-menu-close");
  const backdrop   = document.getElementById("mobile-backdrop");
  if (!hamburger || !mobileMenu) return;

  // Open
  hamburger.addEventListener("click", () => {
    hamburger.classList.add("open");
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden"; // prevent page scroll behind menu
  });

  // Close — via X button, backdrop tap, or Escape key
  closeBtn?.addEventListener("click", closeMobileMenu);
  backdrop?.addEventListener("click", closeMobileMenu);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMobileMenu(); });

  // Smooth scroll + close on link tap
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.section);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    });
  });
}

function closeMobileMenu() {
  document.getElementById("hamburger")?.classList.remove("open");
  document.getElementById("mobile-menu")?.classList.remove("open");
  document.body.style.overflow = ""; // restore page scroll
}


/* ========================= PARTICLES ========================= */
/* Floating dot particles on the hero canvas */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 60 }, () => ({
    x:  Math.random() * w,
    y:  Math.random() * h,
    r:  Math.random() * 2,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x = (p.x + p.dx + w) % w;
      p.y = (p.y + p.dy + h) % h;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}


/* ========================= SKILLS ANIMATION ========================= */
/* Animates skill bar widths when the About section scrolls into view */
function initSkillsObserver() {
  const container = document.getElementById("skills-container");
  const section   = document.getElementById("about");
  if (!container || !section) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      container.querySelectorAll(".skill-fill").forEach(bar => {
        bar.style.width = bar.dataset.level + "%";
      });
      observer.disconnect(); // animate only once
    }
  }, { threshold: 0.25 });

  observer.observe(section);
}


/* ========================= BACK TO TOP ========================= */
function initBackTop() {
  document.getElementById("back-top")?.addEventListener("click", () => {
    scrollToSection("home");
  });
}


/* ========================= GALLERY ========================= */
/* Photo gallery: slide navigation, thumbnails, lightbox, brightness/contrast */
function initGallery() {
  const slides          = document.querySelectorAll(".gallery-slide");
  const thumbs          = document.querySelectorAll(".gallery-thumb");
  const captionText     = document.getElementById("caption-text");
  const captionSub      = document.getElementById("caption-sub");
  const prevBtn         = document.getElementById("gallery-prev");
  const nextBtn         = document.getElementById("gallery-next");
  const lightbox        = document.getElementById("lightbox");
  const lightboxImg     = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lbPrev          = document.getElementById("lb-prev");
  const lbNext          = document.getElementById("lb-next");
  const lbClose         = document.getElementById("lightbox-close");
  const brightness      = document.getElementById("brightness-range");
  const contrast        = document.getElementById("contrast-range");

  let current = 0;
  if (!slides.length) return;

  function updateGallery(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    thumbs.forEach((t, i) => t.classList.toggle("active", i === index));
    captionText.textContent = slides[index].dataset.caption || "";
    captionSub.textContent  = `${index + 1} / ${slides.length} · Click to zoom`;
    current = index;
  }

  // Gallery arrows
  prevBtn?.addEventListener("click", () => { updateGallery((current - 1 + slides.length) % slides.length); });
  nextBtn?.addEventListener("click", () => { updateGallery((current + 1) % slides.length); });

  // Thumbnails
  thumbs.forEach(t => {
    t.addEventListener("click", () => { updateGallery(+t.dataset.idx); });
  });

  // Lightbox open
  slides.forEach((img, i) => {
    img.addEventListener("click", () => {
      lightbox.classList.add("open");
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.dataset.caption || "";
      current = i;
    });
  });

  // Lightbox navigation
  function updateLightbox(index) {
    lightboxImg.src = slides[index].src;
    lightboxCaption.textContent = slides[index].dataset.caption || "";
    current = index;
  }

  lbPrev?.addEventListener("click",  () => { updateLightbox((current - 1 + slides.length) % slides.length); });
  lbNext?.addEventListener("click",  () => { updateLightbox((current + 1) % slides.length); });
  lbClose?.addEventListener("click", () => { lightbox.classList.remove("open"); });
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) lightbox.classList.remove("open"); });

  // Brightness / Contrast controls
  function applyFilters() {
    const b = brightness.value;
    const c = contrast.value;
    slides.forEach(img => { img.style.filter = `brightness(${b}%) contrast(${c}%)`; });
    document.getElementById("brightness-val").textContent = b + "%";
    document.getElementById("contrast-val").textContent   = c + "%";
  }

  brightness?.addEventListener("input", applyFilters);
  contrast?.addEventListener("input",   applyFilters);
  document.getElementById("reset-controls")?.addEventListener("click", () => {
    brightness.value = 100;
    contrast.value   = 100;
    applyFilters();
  });

  updateGallery(0);
}
