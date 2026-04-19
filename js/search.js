/* ============================================================
   search.js — Ctrl+K site search
   Indexes nav sections, projects, blog posts from PORTFOLIO_DATA.
   Depends on: utils.js, data.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const backdrop    = $('#search-overlay');
  const modal       = $('#search-modal');
  const input       = $('#search-input');
  const results     = $('#search-results');
  const clearBtn    = $('#search-clear');
  const openBtns    = $$('#search-icon-btn, #search-icon-btn-mobile');

  if (!modal || !input) return;

  /* ── Build search index ──────────────────────────────── */
  const INDEX = [];

  /* Sections */
  [
    { id: 'home',      icon: '🏠', title: 'Home',      body: 'Hero — Sworup Pokhrel, software engineer, Nepal' },
    { id: 'about',     icon: '👤', title: 'About Me',  body: 'Skills, timeline, bio, PCM student, Nepal' },
    { id: 'gallery',   icon: '🖼️', title: 'Gallery',   body: 'Photo gallery, images, Syangja, Pokhara' },
    { id: 'portfolio', icon: '💼', title: 'Portfolio', body: 'Projects, work, code, design' },
    { id: 'blog',      icon: '✍️', title: 'Blog',      body: 'Articles, posts, coding, design, life' },
    { id: 'contact',   icon: '📬', title: 'Contact',   body: 'Email, hire me, message, form' },
  ].forEach(s => INDEX.push({ type: 'section', href: '#' + s.id, ...s }));

  /* Projects */
  PORTFOLIO_DATA.projects.forEach((p, i) => {
    INDEX.push({ type: 'project', icon: p.icon, title: p.title, body: p.desc + ' ' + p.tech.join(' '), href: '#portfolio', index: i });
  });

  /* Blog */
  PORTFOLIO_DATA.blog.forEach((b, i) => {
    INDEX.push({ type: 'blog', icon: '📝', title: b.title, body: b.snippet + ' ' + b.tags.join(' '), href: '#blog', index: i });
  });

  /* ── Open / close ────────────────────────────────────── */
  function openSearch() {
    backdrop?.classList.add('open');
    modal.classList.add('open');
    input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    renderResults('');
    requestAnimationFrame(() => input.focus());
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    backdrop?.classList.remove('open');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn?.addEventListener('click', openSearch));
  backdrop?.addEventListener('click', closeSearch);

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape' && modal.classList.contains('open')) closeSearch();
  });

  /* ── Search logic ────────────────────────────────────── */
  function highlight(text, query) {
    if (!query) return text;
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();

    const matches = q
      ? INDEX.filter(item => (item.title + ' ' + item.body).toLowerCase().includes(q))
      : INDEX;

    if (!matches.length) {
      results.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          <div class="search-empty-title">No results for "${query}"</div>
          <div class="search-empty-sub">Try a different keyword — section name, skill, or tech.</div>
        </div>`;
      return;
    }

    const groups = { section: [], project: [], blog: [] };
    matches.forEach(m => groups[m.type]?.push(m));

    const labels = { section: 'Sections', project: 'Projects', blog: 'Blog Posts' };

    results.innerHTML = Object.entries(groups)
      .filter(([, items]) => items.length)
      .map(([type, items]) => `
        <div class="search-group">
          <div class="search-group-label">${labels[type]}</div>
          ${items.map(item => `
            <div class="search-result" tabindex="0" data-href="${item.href}" data-type="${item.type}" data-index="${item.index ?? ''}">
              <div class="search-result-icon">${item.icon}</div>
              <div class="search-result-text">
                <div class="search-result-title">${highlight(item.title, q)}</div>
                <div class="search-result-body">${item.body.slice(0, 72)}…</div>
              </div>
              <span class="search-result-arrow">›</span>
            </div>
          `).join('')}
        </div>
      `).join('');

    /* Bind result clicks */
    $$('.search-result').forEach(r => {
      const activate = () => {
        closeSearch();
        const href  = r.dataset.href;
        const type  = r.dataset.type;
        const index = parseInt(r.dataset.index);

        if (href) {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
        /* Open project or blog modal after scroll */
        setTimeout(() => {
          if (type === 'project' && !isNaN(index)) openProjectModal(index);
          if (type === 'blog'    && !isNaN(index)) openBlogModal(index);
        }, 400);
      };
      r.addEventListener('click', activate);
      r.addEventListener('keydown', e => { if (e.key === 'Enter') activate(); });
    });
  }

  input.addEventListener('input', debounce(() => {
    const q = input.value;
    if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';
    renderResults(q);
  }, 150));

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    renderResults('');
    input.focus();
  });

});