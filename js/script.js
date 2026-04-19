/* ============================================================
   script.js — Entry point / boot sequence
   This file just documents load order and adds any global
   one-time setup that doesn't belong in a specific module.

   Load order in index.html:
     1. utils.js   — helpers ($, showToast, debounce, trapFocus)
     2. data.js    — PORTFOLIO_DATA content
     3. render.js  — skills, projects, blog cards + modals
     4. carousel.js — gallery slider, lightbox, photo controls
     5. search.js  — Ctrl+K search modal
     6. ui.js      — navbar, dark mode, hamburger, particles, form
     7. auth.js    — Firebase Google login
     8. script.js  — this file (final init)
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Smooth scroll for ALL anchor links (#section) ──────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Animate elements into view on scroll ─────────────── */
  const animateTargets = document.querySelectorAll(
    '.timeline-item, .project-card, .blog-card, .stat-num, .funfact-box'
  );

  const fadeIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        fadeIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  animateTargets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    fadeIO.observe(el);
  });

  /* ── Console Easter egg ─────────────────────────────────── */
  console.log('%c👋 Hey developer!', 'font-size:18px;font-weight:bold;color:#3b82f6;');
  console.log('%cYou\'re looking at Sworup Pokhrel\'s portfolio — built with vanilla HTML, CSS & JS.\nFeel free to inspect the code. If you spot something to improve, reach out!', 'color:#64748b;');

});