/* ============================================================
   ui.js — All UI interactions
   • Navbar: scroll effect, active link, nav-pill
   • Dark mode toggle (desktop + mobile)
   • Hamburger mobile menu
   • Profile tooltip (desktop)
   • Scroll progress bar
   • Back-to-top button
   • Contact form validation
   • CV download toast
   • Particle canvas hero
   Depends on: utils.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════ SCROLL PROGRESS BAR ════════════════════════ */
  const progressFill = $('#nav-progress-fill');
  if (progressFill) {
    window.addEventListener('scroll', () => {
      const total   = document.body.scrollHeight - window.innerHeight;
      const pct     = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressFill.style.width = pct + '%';
    }, { passive: true });
  }

  /* ════════════════════════ NAVBAR — scroll shrink effect ════════════════════════ */

  const navbar = $('#navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════════════════════════════════════════════════════
     ACTIVE NAV LINK + NAV-PILL
     ══════════════════════════════════════════════════════════ */
  const navLinks    = $$('.nav-links a');
  const navPill     = $('#nav-pill');
  const navLinksEl  = $('#nav-links');
  const sections    = $$('section[id]');

  function movePill(link) {
    if (!navPill || !link || !navLinksEl) return;
    const linkRect = link.getBoundingClientRect();
    const ulRect   = navLinksEl.getBoundingClientRect();
    navPill.style.left  = (linkRect.left - ulRect.left) + 'px';
    navPill.style.width = linkRect.width + 'px';
  }

  function setActiveLink(id) {
    navLinks.forEach(a => {
      const active = a.dataset.section === id;
      a.classList.toggle('active', active);
      if (active) movePill(a);
    });
  }

  /* Intersection observer for sections */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) setActiveLink(e.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => {
    if ($$('[data-section="' + s.id + '"]').length) io.observe(s);
  });

  /* Set initial pill on first active link */
  const firstActive = navLinks.find(a => a.classList.contains('active'));
  if (firstActive) movePill(firstActive);
  else if (navLinks[0]) setTimeout(() => movePill(navLinks[0]), 100);

  /* Pill on window resize */
  window.addEventListener('resize', debounce(() => {
    const active = navLinks.find(a => a.classList.contains('active')) || navLinks[0];
    if (active) movePill(active);
  }, 150));

  /* ===============Dark Mode Toggle ================================== */
  const toggleDesktop = $('#dark-toggle-desktop');
  const toggleMobile  = $('#dark-toggle');

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
  }

  function updateDarkAriaLabels() {
    const isDark = document.body.classList.contains('dark');
    const label  = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    toggleDesktop?.setAttribute('aria-label', label);
    toggleMobile?.setAttribute('aria-label',  label);
  }
  updateDarkAriaLabels();

  function applyDarkToggle() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateDarkAriaLabels();
  }

  toggleDesktop?.addEventListener('click', applyDarkToggle);
  toggleMobile?.addEventListener('click',  applyDarkToggle);

  /* ════════════════════════════ HAMBURGER / MOBILE MENU═════════════════════════════════ */
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileClose = $('#mobile-menu-close');
  const mobileBackdrop = $('#mobile-backdrop');
  const mobileNavLinks = $$('.mobile-menu-links a');

  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    hamburger?.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileClose?.focus();
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    hamburger?.classList.remove('open');
    document.body.style.overflow = '';
    hamburger?.focus();
  }

  hamburger?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(a => {
    a.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMobileMenu();
  });

  /* ══════════════════════════════════════════════════════════
     PROFILE TOOLTIP (DESKTOP)
     ══════════════════════════════════════════════════════════ */
  const profileBtn = $('#nav-profile');
  const profileTip = $('#profile-tooltip');

  if (profileBtn && profileTip) {
    /* Move tooltip into nav-right so CSS position:absolute works correctly */
    const navRight = $('.nav-right');
    if (navRight && !navRight.contains(profileTip)) {
      navRight.appendChild(profileTip);
    }

    profileBtn.setAttribute('aria-expanded', 'false');
    profileBtn.setAttribute('aria-haspopup', 'true');

    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = profileTip.classList.toggle('open');
      profileBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', e => {
      if (!profileTip.contains(e.target) && e.target !== profileBtn) {
        profileTip.classList.remove('open');
        profileBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && profileTip.classList.contains('open')) {
        profileTip.classList.remove('open');
        profileBtn.setAttribute('aria-expanded', 'false');
        profileBtn.focus();
      }
    });

    trapFocus(profileTip);
  }

  /* ══════════════════════════════════════════════════════════
     CV DOWNLOAD BUTTON → TOAST
     ══════════════════════════════════════════════════════════ */
  $('#cv-download-btn')?.addEventListener('click', e => {
    e.preventDefault();
    showToast('📄 Digital CV will be available soon! Stay tuned.', 3500);
  });

  /* ══════════════════════════════════════════════════════════
     BACK TO TOP
     ══════════════════════════════════════════════════════════ */
  $('#back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════════════════════════════
     CONTACT FORM VALIDATION
     ══════════════════════════════════════════════════════════ */
  const form        = $('#contact-form');
  const formSuccess = $('#form-success');
  const resetFormBtn = $('#reset-form');

  function setError(inputId, errorId, msg) {
    const input = $('#' + inputId);
    const error = $('#' + errorId);
    if (input)  input.classList.toggle('error', !!msg);
    if (error)  error.textContent = msg || '';
  }

  function validateForm() {
    let valid = true;
    const name    = $('#f-name')?.value.trim()    || '';
    const email   = $('#f-email')?.value.trim()   || '';
    const message = $('#f-message')?.value.trim() || '';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name)               { setError('f-name',    'name-error',    'Please enter your name.');             valid = false; }
    else                     { setError('f-name',    'name-error',    ''); }

    if (!emailRe.test(email)){ setError('f-email',   'email-error',   'Please enter a valid email address.'); valid = false; }
    else                     { setError('f-email',   'email-error',   ''); }

    if (message.length < 10) { setError('f-message', 'message-error', 'Message must be at least 10 characters.'); valid = false; }
    else                     { setError('f-message', 'message-error', ''); }

    return valid;
  }

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = form.querySelector('[type=submit]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body:   new FormData(form),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        form.style.display        = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      } else {
        showToast('❌ Failed to send. Please try emailing directly.', 4000);
      }
    } catch {
      showToast('❌ Network error. Please try again.', 4000);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message →'; }
    }
  });

  resetFormBtn?.addEventListener('click', () => {
    form?.reset();
    if (form)        form.style.display   = '';
    if (formSuccess) formSuccess.classList.remove('show');
    ['f-name','f-email','f-message'].forEach(id => {
      $('#' + id)?.classList.remove('error');
    });
    ['name-error','email-error','message-error'].forEach(id => {
      const el = $('#' + id);
      if (el) el.textContent = '';
    });
  });

  /* ══════════════════════════════════════════════════════════
     PARTICLE CANVAS HERO
     ══════════════════════════════════════════════════════════ */
  const canvas = $('#particle-canvas');
  if (canvas) {
    const ctx    = canvas.getContext('2d');
    let particles = [];
    let animId;
    let visible  = true;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    function createParticles() {
      const count = Math.min(60, Math.floor(canvas.width / 20));
      particles = Array.from({ length: count }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 2 + 1,
        a:  Math.random() * 0.4 + 0.1,
      }));
    }
    createParticles();

    function draw() {
      if (!visible) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.body.classList.contains('dark');
      const color  = isDark ? '148,163,184' : '100,116,139';

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.a})`;
        ctx.fill();
      });

      /* Draw connecting lines */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    /* Pause particles when hero is off-screen (save battery) */
    const heroIO = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    heroIO.observe($('#home'));
  }

});