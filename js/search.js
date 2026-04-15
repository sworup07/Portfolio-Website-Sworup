/* ============================================================
   search.js — CTRL+K SPOTLIGHT SEARCH
   Full site search covering Projects, Blog, Skills,
   Timeline, and Sections.

   HOW IT WORKS:
   - Press Ctrl+K (or Cmd+K on Mac) anywhere on the page
   - Or click the search icon in the navbar
   - Type anything — results appear instantly, grouped by type
   - Click any result — scrolls to section or opens modal
   - Press Escape or click backdrop to close

   ADDING NEW SEARCHABLE CONTENT:
   - New projects/blog posts added to data.js appear automatically
   - To add Timeline or Section entries, edit the arrays below
   ============================================================ */


/* ========================= SEARCH INDEX ========================= */
/* Builds the master list of everything that can be searched.
   Called once on DOMContentLoaded so it is always up to date. */

function buildSearchIndex() {
  const index = [];

  /* --- Projects (from data.js) --- */
  projects.forEach(p => {
    index.push({
      type:    "Project",
      icon:    p.icon,
      title:   p.title,
      body:    p.desc + " " + p.tech.join(" "),
      tags:    p.tech,
      action:  () => openModal(p),
      section: "portfolio",
    });
  });

  /* --- Blog Posts (from data.js — published only) --- */
  blogPosts.filter(p => p.published).forEach(post => {
    index.push({
      type:    "Blog",
      icon:    "📝",
      title:   post.title,
      body:    post.snippet + " " + post.category + " " + post.tags.join(" "),
      tags:    [post.category, post.readTime],
      action:  () => openBlogModal(post),
      section: "blog",
    });
  });

  /* --- Skills (from data.js) --- */
  skills.forEach(skill => {
    index.push({
      type:    "Skill",
      icon:    "⚡",
      title:   skill.name,
      body:    "Proficiency " + skill.level + "%",
      tags:    [skill.level + "%"],
      action:  () => scrollToSection("about"),
      section: "about",
    });
  });

  /* --- Timeline --- */
  const timeline = [
    { year: "2026 – Present", role: "Full Stack Developer Enthusiast",      desc: "Building web apps using HTML, CSS, JS, Python, React and Node.js." },
    { year: "2025",           role: "Graphic Design & Branding Projects",    desc: "Designed logos, social media graphics, and UI mockups." },
    { year: "2024",           role: "Began Computer Science & PCM Studies",  desc: "Grade 11/12 with Physics, Chemistry, Mathematics and Computer Science." },
    { year: "2023",           role: "First Programming Steps",               desc: "Self-taught Python and JavaScript; first automation scripts and websites." },
  ];
  timeline.forEach(item => {
    index.push({
      type:    "Timeline",
      icon:    "🗓️",
      title:   item.role,
      body:    item.year + " " + item.desc,
      tags:    [item.year],
      action:  () => scrollToSection("about"),
      section: "about",
    });
  });

  /* --- Sections --- */
  const sections = [
    { title: "Home",      icon: "🏠", body: "Hero — introduction, identity, and ambition.",          id: "home"      },
    { title: "About",     icon: "👤", body: "Bio, skills, timeline, and milestones.",                id: "about"     },
    { title: "Gallery",   icon: "🖼️", body: "Photo gallery with lightbox viewer.",                   id: "gallery"   },
    { title: "Portfolio", icon: "💼", body: "Selected projects, case studies, and tech stack.",      id: "portfolio" },
    { title: "Blog",      icon: "✍️", body: "Articles on career, tutorials, and productivity.",      id: "blog"      },
    { title: "Contact",   icon: "📬", body: "Get in touch, hire me, or collaborate.",                id: "contact"   },
  ];
  sections.forEach(s => {
    index.push({
      type:    "Section",
      icon:    s.icon,
      title:   s.title,
      body:    s.body,
      tags:    [],
      action:  () => scrollToSection(s.id),
      section: s.id,
    });
  });

  return index;
}


/* ========================= SEARCH LOGIC ========================= */
/* Scores each item by how well it matches the query.
   Title match = 3pts, tag match = 2pts, body/type match = 1pt.
   Results sorted highest score first. */

function runSearch(index, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return index
    .map(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const bodyMatch  = item.body.toLowerCase().includes(q);
      const tagMatch   = item.tags.some(t => t.toLowerCase().includes(q));
      const typeMatch  = item.type.toLowerCase().includes(q);
      const score      = (titleMatch ? 3 : 0) + (tagMatch ? 2 : 0) + (bodyMatch ? 1 : 0) + (typeMatch ? 1 : 0);
      return score > 0 ? { ...item, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}


/* ========================= HIGHLIGHT ========================= */
/* Wraps matching text in a <mark> tag for the blue highlight effect */

function highlight(text, query) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}


/* ========================= RENDER RESULTS ========================= */
/* Builds the results HTML grouped by type in a fixed display order */

function renderResults(results, container, query) {
  if (!results.length) {
    container.innerHTML = `
      <div class="search-empty">
        <div class="search-empty-icon">🔍</div>
        <div class="search-empty-title">No results for "${query}"</div>
        <div class="search-empty-sub">Try a project name, skill, blog topic, or section</div>
      </div>`;
    return;
  }

  const ORDER  = ["Section", "Project", "Blog", "Skill", "Timeline"];
  const groups = {};
  results.forEach(r => {
    if (!groups[r.type]) groups[r.type] = [];
    groups[r.type].push(r);
  });

  let html = "";
  ORDER.forEach(type => {
    if (!groups[type]) return;
    const plural = type === "Blog" ? "Blog posts" : type + "s";
    html += `<div class="search-group"><div class="search-group-label">${plural}</div>`;
    groups[type].forEach((item, i) => {
      const tagsHtml = item.tags.map(t => `<span class="search-tag">${t}</span>`).join("");
      html += `
        <div class="search-result" data-type="${type}" data-idx="${i}" tabindex="0" role="option">
          <span class="search-result-icon">${item.icon}</span>
          <div class="search-result-text">
            <div class="search-result-title">${highlight(item.title, query)}</div>
            <div class="search-result-body">${item.body}</div>
            ${tagsHtml ? `<div class="search-result-tags">${tagsHtml}</div>` : ""}
          </div>
          <span class="search-result-arrow">→</span>
        </div>`;
    });
    html += `</div>`;
  });

  container.innerHTML = html;

  /* Attach click + keyboard events to every result */
  ORDER.forEach(type => {
    if (!groups[type]) return;
    groups[type].forEach((item, i) => {
      const el = container.querySelector(`[data-type="${type}"][data-idx="${i}"]`);
      if (!el) return;
      const fire = () => { item.action(); closeSearch(); };
      el.addEventListener("click", fire);
      el.addEventListener("keydown", e => { if (e.key === "Enter") fire(); });
    });
  });
}


/* ========================= SEARCH INIT ========================= */
/* Wires up the search icon, Ctrl+K shortcut, input, and keyboard nav */

function initSearch() {
  const searchIndex = buildSearchIndex();

  const overlay    = document.getElementById("search-overlay");
  const modal      = document.getElementById("search-modal");
  const input      = document.getElementById("search-input");
  const results    = document.getElementById("search-results");
  const clearBtn   = document.getElementById("search-clear");
  const searchIcon = document.getElementById("search-icon-btn");

  if (!modal || !input || !results) return;

  let debounce = null;

  /* Open search */
  function openSearch() {
    overlay.classList.add("open");
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 50);
  }

  /* Close search — reset everything */
  function closeSearchInternal() {
    overlay.classList.remove("open");
    modal.classList.remove("open");
    document.body.style.overflow = "";
    input.value = "";
    results.innerHTML = "";
    results.classList.remove("has-results");
    clearBtn.style.display = "none";
  }

  /* Search icon — both desktop AND mobile buttons */
searchIcon?.addEventListener("click", openSearch);
document.getElementById("search-icon-btn-mobile")?.addEventListener("click", openSearch);

  /* Ctrl+K / Cmd+K anywhere on page */
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (modal.classList.contains("open")) {
        closeSearchInternal();
      } else {
        openSearch();
      }
    }
    /* Escape to close */
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeSearchInternal();
    }
    /* Arrow keys to navigate results */
    if (modal.classList.contains("open") && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const items = results.querySelectorAll(".search-result");
      if (!items.length) return;
      const focused = results.querySelector(".search-result:focus");
      if (!focused) { items[0].focus(); return; }
      const idx = Array.from(items).indexOf(focused);
      if (e.key === "ArrowDown" && idx < items.length - 1) items[idx + 1].focus();
      if (e.key === "ArrowUp") {
        if (idx > 0) items[idx - 1].focus();
        else input.focus(); // arrow up from first result goes back to input
      }
    }
    /* Arrow down from input focuses first result */
    if (modal.classList.contains("open") && e.key === "ArrowDown" && document.activeElement === input) {
      e.preventDefault();
      results.querySelector(".search-result")?.focus();
    }
  });

  /* Click backdrop to close */
  overlay?.addEventListener("click", closeSearchInternal);

  /* Live search as user types */
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    const q = input.value.trim();
    clearBtn.style.display = q ? "flex" : "none";
    if (!q) {
      results.innerHTML = "";
      results.classList.remove("has-results");
      return;
    }
    debounce = setTimeout(() => {
      const found = runSearch(searchIndex, q);
      renderResults(found, results, q);
      results.classList.toggle("has-results", found.length > 0);
    }, 150);
  });

  /* Clear button */
  clearBtn?.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    results.innerHTML = "";
    results.classList.remove("has-results");
    input.focus();
  });

  /* Make closeSearch available globally so script.js can call it */
  window.closeSearch = closeSearchInternal;
}