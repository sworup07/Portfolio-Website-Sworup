/* ============================================================
   utils.js — Shared utility helpers
   Loaded first so all other modules can use these.
   ============================================================ */

'use strict';

/* ── DOM shorthand ─────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Toast notification ────────────────────────────────── */
function showToast(msg, duration = 3200) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Debounce ───────────────────────────────────────────── */
function debounce(fn, ms = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* ── Clamp a number between min and max ────────────────── */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/* ── Trap keyboard focus inside a modal element ─────────── */
function trapFocus(el) {
  const focusable = $$('button,a,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])', el);
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}

/* ── Resolve a Google OAuth profile photo across possible
   Supabase user-object shapes. Different OAuth/session flows
   populate different fields, so we check them all in order. ── */
function getUserPhoto(user) {
  if (!user) return '';
  return (
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.identities?.[0]?.identity_data?.avatar_url ||
    user.identities?.[0]?.identity_data?.picture ||
    ''
  );
}