/* ========================= DATA========================= */
const blogPosts = [
  {
    category: "Career",
    readTime: "5 min read",
    title: "Beware the Hype Chasers",
    snippet: "A critique of superficial trends and where the real opportunities are.",
    date: "January 5, 2025"
  },

  {
    category: "Career",
    readTime: "5 min read",
    title: "How I Prepare for Coding Competitions",
    snippet: "Learn my approach to mastering programming challenges and improving problem-solving skills.",
    date: "April 7, 2026"
  },
  {
    category: "Project",
    readTime: "6 min read",
    title: "Building My Portfolio Website from Scratch",
    snippet: "A step-by-step guide on how I created a responsive, SEO-friendly portfolio website using HTML, CSS, and JS.",
    date: "March 25, 2026"
  },
  {
    category: "Tutorial",
    readTime: "4 min read",
    title: "Top 5 Python Tricks for Beginners",
    snippet: "Boost your Python skills quickly with these simple but effective coding tricks.",
    date: "April 1, 2026"
  },
  {
    category: "Productivity",
    readTime: "3 min read",
    title: "Managing Studies and Coding as a Student",
    snippet: "My personal workflow to balance school, coding, and self-learning efficiently.",
    date: "March 30, 2026"
  },
  {
    category: "Insights",
    readTime: "5 min read",
    title: "Why Web Development Skills Are in High Demand",
    snippet: "An overview of why learning web development can supercharge your career opportunities.",
    date: "April 3, 2026"
  }
];


const skills = [
  { name: "⌨ Programming (Python, JAVA, C++)", level: 90 },
  { name: "🌐 Web Development", level: 87 },
  { name: " IoT & Automation / Electronics", level: 77 },
  { name: "🎨 Graphic Design/Web Design", level: 74 }, 
  { name: "🎤 Public Speaking", level: 69 },
{ name: "🤖 AI/ML Basics", level: 65 },
 { name: "📊 Data Analysis", level: 60}
 

];

/* ✅ REQUIRED: Projects (prevents crash) */
const projects = [
  {id:1,icon:"💻",title:"Portfolio Website",desc:"A modern personal portfolio website.",details:"Built using HTML, CSS, JS with responsive design.",tech:["HTML","CSS","JavaScript"],demo:"#",github:"#"},
  {id:2,icon:"📱",title:"Mobile App Design",desc:"UI/UX for a productivity mobile app.",details:"Designed clean UI for a mobile task manager app.",tech:["Figma","Adobe XD"],demo:"#",github:"#"},
  {id:3,icon:"🛒",title:"E-Commerce Platform",desc:"Frontend for an online store.",details:"Implemented responsive e-commerce website with cart functionality.",tech:["HTML","CSS","JS","React"],demo:"#",github:"#"},
  {id:4,icon:"🎨",title:"Graphic Design Portfolio",desc:"Collection of graphic works.",details:"Showcased branding, poster, and illustration work.",tech:["Photoshop","Illustrator"],demo:"#",github:"#"},
  {id:5,icon:"🌐",title:"Web App Dashboard",desc:"Admin dashboard UI for analytics.",details:"Built interactive charts and widgets for admin panel.",tech:["HTML","CSS","JS","Chart.js"],demo:"#",github:"#"},
  {id:6,icon:"🤖",title:"AI Chatbot",desc:"Web AI chatbot interface.",details:"Created a chatbot interface integrated with AI responses.",tech:["HTML","CSS","JS","OpenAI API"],demo:"#",github:"#"}
];

/* ========================= UTIL========================= */
function scrollTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* =========================================================== RENDER PROJECTS =================================================== */
function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projects.map(p => `
    <div class="project-card" data-id="${p.id}">
      <div class="project-icon">${p.icon}</div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-tech">
        ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join("")}
      </div>
      <div class="project-links">
        <span class="project-cta">View Case Study →</span>
        <span class="project-hint">Click to expand</span>
      </div>
    </div>
  `).join("");

  // Attach modal click events
  grid.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = +card.dataset.id;
      const project = projects.find(p => p.id === id);
      if (project) openModal(project);
    });
  });
}

function initPortfolioButtons() {
  const grid = document.getElementById("projects-grid");
  const prev = document.getElementById("portfolio-prev");
  const next = document.getElementById("portfolio-next");
  if (!grid || !prev || !next) return;

  const scrollAmount = 340; // should be approx card width + gap

  prev.addEventListener("click", () => {
    grid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}



/* ========================================= RENDER BLOG ======================================== */
function renderBlog() {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  grid.innerHTML = blogPosts.map(post => `
    <article class="blog-card">
      <div class="blog-meta">
        <span class="blog-cat">${post.category}</span>
        <span class="blog-read">${post.readTime}</span>
      </div>
      <h3 class="blog-title">${post.title}</h3>
      <p class="blog-snippet">${post.snippet}</p>
      <div class="blog-footer">
        <span class="blog-date">${post.date}</span>
        <span class="blog-more" onclick="alert('Full blog coming soon!')">Read more →</span>
      </div>
    </article>
  `).join("");
}

/* =========================================== BLOG CAROUSEL ===================================== */
function initBlogCarousel() {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  const scrollAmount = 320;
  const autoSlideInterval = 4000;
  let autoSlide;

  // Auto-slide only on desktop
  if (window.innerWidth > 768) {
    autoSlide = setInterval(() => {
      if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 5) {
        grid.scrollLeft = 0; // loop back
      } else {
        grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, autoSlideInterval);
  }

  // Touch slider only for mobile
  if (window.innerWidth <= 768) {
    let startX = 0, isTouching = false;
    grid.addEventListener("touchstart", e => { startX = e.touches[0].clientX; isTouching = true; });
    grid.addEventListener("touchmove", e => {
      if (!isTouching) return;
      const moveX = e.touches[0].clientX;
      grid.scrollLeft += (startX - moveX) * 0.5;
      startX = moveX;
    });
    grid.addEventListener("touchend", e => { isTouching = false; });
  }
}

/* ======================================= PORTFOLIO CAROUSEL =================================================== */

function initPortfolioControls() {
  const grid = document.getElementById("projects-grid");
  const prevBtn = document.getElementById("portfolio-prev");
  const nextBtn = document.getElementById("portfolio-next");
  if (!grid || !prevBtn || !nextBtn) return;

  const scrollAmount = 320; // same as card width

  prevBtn.addEventListener("click", () => {
    grid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

function initPortfolioCarousel() {
  const grid = document.getElementById("projects-grid");
  const prevBtn = document.getElementById("portfolio-prev");
  const nextBtn = document.getElementById("portfolio-next");
  if (!grid || !prevBtn || !nextBtn) return;

  const cardWidth = 320; // adjust to match CSS card width + gap

  // ----- Button scrolling -----
  prevBtn.addEventListener("click", () => {
    grid.scrollBy({ left: -cardWidth, behavior: "smooth" });
  });
  nextBtn.addEventListener("click", () => {
    grid.scrollBy({ left: cardWidth, behavior: "smooth" });
  });

  // ----- Touch swipe -----
  let startX = 0, isTouching = false;
  grid.addEventListener("touchstart", e => { startX = e.touches[0].clientX; isTouching = true; });
  grid.addEventListener("touchmove", e => {
    if (!isTouching) return;
    const moveX = e.touches[0].clientX;
    grid.scrollLeft += (startX - moveX) * 0.5;
    startX = moveX;
  });
  grid.addEventListener("touchend", () => { isTouching = false; });

  // ----- Mouse drag -----
  let isMouseDown = false, mouseStartX = 0;
  grid.addEventListener("mousedown", e => { isMouseDown = true; mouseStartX = e.clientX; grid.classList.add("grabbing"); });
  grid.addEventListener("mousemove", e => {
    if (!isMouseDown) return;
    const diff = mouseStartX - e.clientX;
    grid.scrollLeft += diff * 0.5;
    mouseStartX = e.clientX;
  });
  grid.addEventListener("mouseup", () => { isMouseDown = false; grid.classList.remove("grabbing"); });
  grid.addEventListener("mouseleave", () => { if (isMouseDown) { isMouseDown = false; grid.classList.remove("grabbing"); } });

  // ----- Optional: clone first cards for infinite loop effect -----
  const cloneCount = Math.min(2, grid.children.length);
  const originalCards = Array.from(grid.children);
  originalCards.slice(0, cloneCount).forEach(c => grid.appendChild(c.cloneNode(true)));
}

/* ============================================= SKILL ANIMATION====================================================================== */
function renderSkills() {
  const skillsContainer = document.getElementById("skills-container");
  if (!skillsContainer) return;

  skillsContainer.innerHTML = skills.map(skill => `
    <div class="skill-item">
      <div class="skill-header">
        <span>${skill.name}</span>
        <span class="skill-pct">${skill.level}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-level="${skill.level}"></div>
      </div>
    </div>
  `).join("");
}

/* ========================= SKILL ANIMATION ========================== */
function initSkillObserver() {
  const section = document.getElementById("about");
  if (!section) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".skill-fill").forEach(bar => {
        bar.style.width = bar.dataset.level + "%";
      });
      observer.disconnect(); // animate only once
    }
  }, { threshold: 0.25 });

  observer.observe(section);
}

function initAboutSkills() {
  renderSkills();        // Create skill bars dynamically
  initSkillObserver();   // Animate bars on scroll
}

window.addEventListener("DOMContentLoaded", () => {
  initAboutSkills();
});

function openModal(project) {
  document.getElementById("modal-icon").textContent = project.icon;
  document.getElementById("modal-title").textContent = project.title;
  document.getElementById("modal-body").textContent = project.details;
  document.getElementById("modal-tech").innerHTML =
    project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
  document.getElementById("modal-demo").href = project.demo;
  document.getElementById("modal-github").href = project.github;

  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
}

/* ========================= NAVBAR========================= */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const sections = ["home","about","gallery","portfolio","blog","contact"];
  const links = document.querySelectorAll(".nav-links a");

  function onScroll() {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 20);

    let current = "home";
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 160) current = id;
    });

    links.forEach(a => {
      a.classList.toggle("active", a.dataset.section === current);
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll();

  links.forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.section);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    });
  });
}

/* ========================= DARK MODE========================= */
function initDarkMode() {
  const toggles = document.querySelectorAll("#dark-toggle, #dark-toggle-desktop");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );
    });
  });
}

/* ========================= MOBILE MENU ========================= */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

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
}

/* ========================= CONTACT FORM ========================= */
function initForm() {
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form || !success) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll(".form-error").forEach(el => el.textContent = "");
    form.querySelectorAll(".form-input, .form-textarea").forEach(el => el.classList.remove("error"));

    const name = form.querySelector("#f-name");
    const email = form.querySelector("#f-email");
    const message = form.querySelector("#f-message");

    // Validation
    if (!name.value.trim()) { showError(name, "name-error", "Name is required."); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, "email-error", "Enter a valid email."); valid = false; }
    if (message.value.trim().length < 10) { showError(message, "message-error", "Minimum 10 characters."); valid = false; }

    if (!valid) return;

    try {
      // Send form data to Formspree
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.style.display = "none";
        success.classList.add("show");
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      alert("Oops! Something went wrong. Please try again.");
    }
  });

  // Reset form to send another message
  document.getElementById("reset-form")?.addEventListener("click", () => {
    form.reset();
    form.style.display = "block";
    success.classList.remove("show");
  });
}

/* ========================= ERROR ========================= */
function showError(input, id, msg) {
  input.classList.add("error");
  document.getElementById(id).textContent = msg;
}

/* =================================================PARTICLES =============================================================================== */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4
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

/* ===========================================  BACK TO TOP====================================================== */
function initBackTop() {
  document.getElementById("back-top")?.addEventListener("click", () => {
    scrollTo("home");
  });
}


/* ============================================================= GALLERY SYSTEM ====================================================== */
function initGallery() {
  const slides = document.querySelectorAll(".gallery-slide");
  const thumbs = document.querySelectorAll(".gallery-thumb");
  const captionText = document.getElementById("caption-text");
  const captionSub = document.getElementById("caption-sub");

  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");

  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  const lbClose = document.getElementById("lightbox-close");

  const brightness = document.getElementById("brightness-range");
  const contrast = document.getElementById("contrast-range");

  let current = 0;

  if (!slides.length) return;

  function updateGallery(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    thumbs.forEach((t, i) => t.classList.toggle("active", i === index));

    const img = slides[index];
    captionText.textContent = img.dataset.caption || "";
    captionSub.textContent = `${index + 1} / ${slides.length} · Click to zoom`;

    current = index;
  }

  /* Arrows */
  prevBtn?.addEventListener("click", () => {
    updateGallery((current - 1 + slides.length) % slides.length);
  });

  nextBtn?.addEventListener("click", () => {
    updateGallery((current + 1) % slides.length);
  });

  /* Thumbnails */
  thumbs.forEach(t => {
    t.addEventListener("click", () => {
      updateGallery(+t.dataset.idx);
    });
  });

  /* Lightbox */
  slides.forEach((img, i) => {
    img.addEventListener("click", () => {
      lightbox.classList.add("open");
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.dataset.caption || "";
      current = i;
    });
  });

  function updateLightbox(index) {
    const img = slides[index];
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.dataset.caption || "";
    current = index;
  }

  lbPrev?.addEventListener("click", () => {
    updateLightbox((current - 1 + slides.length) % slides.length);
  });

  lbNext?.addEventListener("click", () => {
    updateLightbox((current + 1) % slides.length);
  });

  lbClose?.addEventListener("click", () => {
    lightbox.classList.remove("open");
  });

  lightbox?.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.classList.remove("open");
  });

  /* Brightness / Contrast */
  function applyFilters() {
    const b = brightness.value;
    const c = contrast.value;

    slides.forEach(img => {
      img.style.filter = `brightness(${b}%) contrast(${c}%)`;
    });

    document.getElementById("brightness-val").textContent = b + "%";
    document.getElementById("contrast-val").textContent = c + "%";
  }

  brightness?.addEventListener("input", applyFilters);
  contrast?.addEventListener("input", applyFilters);

  document.getElementById("reset-controls")?.addEventListener("click", () => {
    brightness.value = 100;
    contrast.value = 100;
    applyFilters();
  });

  /* Init */
  updateGallery(0);
}


/* =======================================  INIT=============================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();           // Renders projects
  initPortfolioCarousel();    // Initializes portfolio horizontal carousel
  renderBlog();               // Renders blogs
  initBlogCarousel();         // Blog carousel
  // initSkills() removed because it does not exist
  initSkillObserver();        // Animates skill bars

  initNavbar();
  initDarkMode();
  initMobileMenu();
  initForm();
  initParticles();
  initBackTop();
  initGallery();

  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  document.getElementById("modal")?.addEventListener("click", e => {
    if (e.target === e.currentTarget) closeModal();
  });
});