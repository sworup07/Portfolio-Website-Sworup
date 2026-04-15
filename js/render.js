/* ============================================================
   render.js — RENDERING FUNCTIONS
   Builds HTML and injects it into the page.
   Covers: Projects, Blog cards, Skills, Modal, Blog Modal,
           Contact Form.
   Uses data from data.js and helpers from utils.js.
   ============================================================ */


/* ========================= RENDER PROJECTS ========================= */
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

  grid.querySelectorAll(".project-card").forEach(card => {

    // Open project modal on click
    card.addEventListener("click", () => {
      const id      = +card.dataset.id;
      const project = projects.find(p => p.id === id);
      if (project) openModal(project);
    });

    // Apple-style 3D tilt on hover (desktop)
    card.addEventListener("mousemove", e => {
      const rect  = card.getBoundingClientRect();
      const tiltX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * 6;
      const tiltY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * -6;
      card.style.transform  = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      card.style.transition = "transform 0.05s ease";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform  = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
      card.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
    });
  });
}


/* ========================= RENDER BLOG ========================= */
/* Only shows posts where published: true */
function renderBlog() {
  const grid = document.getElementById("blog-grid");
  if (!grid) return;

  // Filter to only published posts
  const published = blogPosts.filter(p => p.published);

  grid.innerHTML = published.map(post => `
    <article class="blog-card" data-slug="${post.slug}">
      <div class="blog-meta">
        <span class="blog-cat">${post.category}</span>
        <span class="blog-read">${post.readTime}</span>
      </div>
      <h3 class="blog-title">${post.title}</h3>
      <p class="blog-snippet">${post.snippet}</p>
      <div class="blog-footer">
        <span class="blog-date">${post.date}</span>
        <span class="blog-more">Read more →</span>
      </div>
    </article>
  `).join("");

  // Attach "Read more" click — opens the blog modal with full content
  grid.querySelectorAll(".blog-more").forEach(btn => {
    btn.addEventListener("click", () => {
      const slug = btn.closest(".blog-card").dataset.slug;
      const post = blogPosts.find(p => p.slug === slug);
      if (post) openBlogModal(post);
    });
  });

  // Clicking anywhere on the card also opens the modal
  grid.querySelectorAll(".blog-card").forEach(card => {
    card.addEventListener("click", () => {
      const post = blogPosts.find(p => p.slug === card.dataset.slug);
      if (post) openBlogModal(post);
    });
  });
}


/* ========================= RENDER SKILLS ========================= */
function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  container.innerHTML = skills.map(skill => `
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


/* ========================= PROJECT MODAL ========================= */
function openModal(project) {
  document.getElementById("modal-icon").textContent  = project.icon;
  document.getElementById("modal-title").textContent = project.title;
  document.getElementById("modal-body").textContent  = project.details;
  document.getElementById("modal-tech").innerHTML    = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
  document.getElementById("modal-demo").href         = project.demo;
  document.getElementById("modal-github").href       = project.github;
  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
}


/* ========================= BLOG MODAL ========================= */
/* Opens a full reading experience for a blog post.
   Formats the content field into clean readable paragraphs.
   Shows category badge, read time, date, and all tags. */

function openBlogModal(post) {
  const modal = document.getElementById("blog-modal");
  if (!modal) return;

  // Category badge color — looks up from blogCategories
  const catObj  = blogCategories.find(c => c.id === post.category);
  const catColor = catObj ? catObj.color : "var(--blue)";
  const catLabel = catObj ? catObj.label : post.category;

  // Convert the raw content string into clean HTML paragraphs
  // Each non-empty line becomes its own paragraph
  const paragraphs = post.content
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join("");

  // Tags rendered as pills
  const tagsHtml = post.tags
    .map(tag => `<span class="blog-modal-tag">${tag}</span>`)
    .join("");

  // Build the full modal content
  document.getElementById("blog-modal-content").innerHTML = `
    <div class="blog-modal-header">
      <div class="blog-modal-meta">
        <span class="blog-modal-cat" style="background:${catColor}20;color:${catColor};border:1px solid ${catColor}40">${catLabel}</span>
        <span class="blog-modal-read">${post.readTime}</span>
        <span class="blog-modal-date">${post.date}</span>
      </div>
      <h2 class="blog-modal-title">${post.title}</h2>
      <p class="blog-modal-snippet">${post.snippet}</p>
    </div>
    <div class="blog-modal-divider"></div>
    <div class="blog-modal-body">
      ${paragraphs}
    </div>
    <div class="blog-modal-divider"></div>
    <div class="blog-modal-footer">
      <div class="blog-modal-tags-label">Topics</div>
      <div class="blog-modal-tags">${tagsHtml}</div>
    </div>
  `;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";

  // Scroll the modal body back to top every time it opens
  document.getElementById("blog-modal-inner").scrollTop = 0;
}

function closeBlogModal() {
  document.getElementById("blog-modal")?.classList.remove("open");
  document.body.style.overflow = "";
}


/* ========================= CONTACT FORM ========================= */
function initForm() {
  const form    = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (!form || !success) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll(".form-error").forEach(el => el.textContent = "");
    form.querySelectorAll(".form-input, .form-textarea").forEach(el => el.classList.remove("error"));

    const name    = form.querySelector("#f-name");
    const email   = form.querySelector("#f-email");
    const message = form.querySelector("#f-message");

    if (!name.value.trim())                               { showError(name,    "name-error",    "Name is required.");      valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email,   "email-error",   "Enter a valid email.");   valid = false; }
    if (message.value.trim().length < 10)                 { showError(message, "message-error", "Minimum 10 characters."); valid = false; }

    if (!valid) return;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
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

  document.getElementById("reset-form")?.addEventListener("click", () => {
    form.reset();
    form.style.display = "block";
    success.classList.remove("show");
  });
}