/* ============================================================
   auth.js — Supabase Google Authentication  v5.0
   Replaces Firebase entirely. Uses Supabase Auth + Postgres.
   Desktop:  signInWithOAuth (popup via window.open workaround)
   Mobile:   signInWithOAuth redirect flow
   ============================================================ */
'use strict';

const SUPABASE_URL      = 'https://dtjbluhmynspesuxfdom.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0amJsdWhteW5zcGVzdXhmZG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MTY2NzQsImV4cCI6MjA5MjA5MjY3NH0.6bNZuiSQHMQFqFeLu2oZgPZMjljrf_ZOrnCPVswYiUk';

/* Init Supabase client */
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.sb  = _sb;          /* expose for render.js + carousel.js */
window.currentUser = null;

/* ── Mobile detection (touch + narrow OR mobile UA) ─────── */
const isMobileDevice = () => {
  const agent  = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const narrow = window.screen.width <= 1024;
  const touch  = navigator.maxTouchPoints > 0 || ('ontouchstart' in window);
  return agent || (touch && narrow);
};

/* ════════════════════════════════════════════════════════
   LOADING BAR  (#nav-progress-fill)
   ════════════════════════════════════════════════════════ */
let _lt = null;
function startLoading() {
  const b = document.getElementById('nav-progress-fill');
  if (!b) return;
  clearTimeout(_lt);
  b.style.cssText = 'transition:width .5s ease,opacity 0s;opacity:1;width:75%;background:var(--gradient)';
}
function finishLoading() {
  const b = document.getElementById('nav-progress-fill');
  if (!b) return;
  b.style.transition = 'width .25s ease';
  b.style.width = '100%';
  clearTimeout(_lt);
  _lt = setTimeout(() => {
    b.style.transition = 'opacity .35s ease';
    b.style.opacity = '0';
    setTimeout(() => { b.style.cssText = 'width:0%;opacity:1;transition:width .1s linear'; }, 380);
  }, 280);
}
function errorLoading() {
  const b = document.getElementById('nav-progress-fill');
  if (!b) return;
  b.style.background = '#ef4444';
  b.style.width = '100%';
  setTimeout(() => { b.style.width = '0%'; b.style.background = 'var(--gradient)'; }, 900);
}
window.startLoading  = startLoading;
window.finishLoading = finishLoading;
window.errorLoading  = errorLoading;

/* ════════════════════════════════════════════════════════
   SIGN IN WITH GOOGLE
   ════════════════════════════════════════════════════════ */
async function signInWithGoogle() {
  startLoading();
  try {
    const redirectTo = window.location.href.split('?')[0].split('#')[0];
    if (isMobileDevice()) {
      /* Mobile: full redirect — page reloads after Google login */
      closeSheet();
      setTimeout(async () => {
        const { error } = await _sb.auth.signInWithOAuth({
          provider: 'google',
          options:  { redirectTo, queryParams: { prompt: 'select_account' } },
        });
        if (error) { errorLoading(); showToast('❌ Sign-in failed. Try again.', 4000); }
      }, 300);
    } else {
      /* Desktop: popup window */
      const { error } = await _sb.auth.signInWithOAuth({
        provider: 'google',
        options:  {
          redirectTo,
          queryParams:  { prompt: 'select_account' },
          skipBrowserRedirect: false,
        },
      });
      if (error) { errorLoading(); showToast('❌ Sign-in failed. Try again.', 4000); }
      else finishLoading();
    }
  } catch (e) {
    errorLoading();
    console.error('signIn:', e);
  }
}
window.signInWithGoogle = signInWithGoogle;

/* ════════════════════════════════════════════════════════
   SIGN OUT
   ════════════════════════════════════════════════════════ */
async function signOut() {
  startLoading();
  closeSheet();
  const { error } = await _sb.auth.signOut();
  if (error) { errorLoading(); return; }
  finishLoading();
  showToast('👋 Signed out.', 3000);
}
window.signOut = signOut;

/* ════════════════════════════════════════════════════════
   AUTH STATE LISTENER
   ════════════════════════════════════════════════════════ */
function initAuth() {
  startLoading();

  /* Handle OAuth callback (token in URL hash after redirect) */
  _sb.auth.getSession().then(({ data: { session } }) => {
    const user = session?.user ?? null;
    window.currentUser = user;
    _updateAllUI(user);
    finishLoading();
    if (user && window.location.hash.includes('access_token')) {
      showToast(`✅ Welcome, ${user.user_metadata?.full_name?.split(' ')[0] || 'there'}!`, 4000);
      /* Clean the hash from the URL */
      history.replaceState(null, '', window.location.pathname);
    }
  });

  /* Live auth state changes */
  _sb.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null;
    window.currentUser = user;
    _updateAllUI(user);
  });
}

/* ════════════════════════════════════════════════════════
   USER HELPERS  (Supabase user shape is different from Firebase)
   user.id               ← was user.uid
   user.email            ← same
   user.user_metadata.full_name    ← was user.displayName
   user.user_metadata.avatar_url   ← was user.photoURL
   ════════════════════════════════════════════════════════ */
function _name(user)   { return user?.user_metadata?.full_name  || user?.email?.split('@')[0] || 'User'; }
function _photo(user)  { return user?.user_metadata?.avatar_url || ''; }
function _uid(user)    { return user?.id || ''; }

function _avatarHTML(photoURL, name, w, h) {
  return photoURL
    ? `<img src="${photoURL}" alt="${name}" style="width:${w}px;height:${h}px;border-radius:50%;object-fit:cover;">`
    : `<span style="font-weight:800;font-size:${Math.round(w*.4)}px;color:var(--blue)">${(name||'U')[0].toUpperCase()}</span>`;
}

/* ════════════════════════════════════════════════════════
   UI UPDATES
   ════════════════════════════════════════════════════════ */
function _updateAllUI(user) {
  _updateDesktop(user);
  _updateMobileRow(user);
  _updateSheet(user);
}

function _updateDesktop(user) {
  const av  = document.getElementById('nav-profile-avatar');
  const dot = document.querySelector('.nav-profile-dot');
  const ta  = document.querySelector('.profile-tooltip-avatar');
  const tt  = document.querySelector('.profile-tooltip-title');
  const ts  = document.querySelector('.profile-tooltip-sub');
  const tn  = document.querySelector('.profile-tooltip-note');
  const lb  = document.getElementById('profile-login-btn');

  if (user) {
    const n = _name(user), p = _photo(user), e = user.email || '';
    if (av)  av.innerHTML  = _avatarHTML(p, n, 34, 34);
    if (dot) dot.style.background = '#3b82f6';
    if (ta)  ta.innerHTML  = _avatarHTML(p, n, 44, 44);
    if (tt)  tt.textContent = n;
    if (ts)  ts.textContent = e;
    if (tn)  tn.textContent = '✅ You can now like & comment!';
    if (lb)  { lb.innerHTML = '🚪 Sign Out'; lb.onclick = signOut; }
  } else {
    const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
    if (av)  av.innerHTML  = svg;
    if (dot) dot.style.background = '#22c55e';
    if (ta)  ta.innerHTML  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
    if (tt)  tt.textContent = 'Sign in with Google';
    if (ts)  ts.textContent = 'Like & comment on posts';
    if (tn)  tn.textContent = '🔒 Your identity stays private';
    if (lb)  { lb.innerHTML = `${_gLogo(16)} Continue with Google`; lb.onclick = signInWithGoogle; }
  }
}

function _updateMobileRow(user) {
  const av = document.getElementById('mm-profile-avatar');
  const ti = document.getElementById('mm-profile-title');
  const su = document.getElementById('mm-profile-sub');
  if (user) {
    const n = _name(user), p = _photo(user);
    if (av) av.innerHTML = _avatarHTML(p, n, 38, 38) + `<span class="mm-profile-dot" style="background:#3b82f6"></span>`;
    if (ti) ti.textContent = n;
    if (su) su.textContent = user.email || '';
  } else {
    if (av) av.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg><span class="mm-profile-dot"></span>`;
    if (ti) ti.textContent = 'Sign in with Google';
    if (su) su.textContent = 'Tap to sign in';
  }
}

/* ════════════════════════════════════════════════════════
   BOTTOM SHEET
   ════════════════════════════════════════════════════════ */
function openSheet() {
  document.getElementById('mobile-menu')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
  const sheet = document.getElementById('mobile-profile-sheet');
  const bd    = document.getElementById('sheet-backdrop');
  if (!sheet) return;
  setTimeout(() => {
    bd?.classList.add('open');
    sheet.classList.add('open');
    document.body.style.overflow = 'hidden';
  }, 160);
}
function closeSheet() {
  document.getElementById('mobile-profile-sheet')?.classList.remove('open');
  document.getElementById('sheet-backdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeSheet = closeSheet;

function _updateSheet(user) {
  const av = document.getElementById('sheet-avatar');
  const nm = document.getElementById('sheet-name');
  const em = document.getElementById('sheet-email');
  const lo = document.getElementById('sheet-logged-out');
  const li = document.getElementById('sheet-logged-in');
  const d2 = document.getElementById('sheet-divider-2');
  const so = document.getElementById('sheet-signout-section');

  if (user) {
    const n = _name(user), p = _photo(user);
    if (av) av.innerHTML  = _avatarHTML(p, n, 52, 52);
    if (nm) nm.textContent = n;
    if (em) em.textContent = user.email || '';
    if (lo) lo.style.display = 'none';
    if (li) li.style.display = 'block';
    if (d2) d2.style.display = 'block';
    if (so) so.style.display = 'block';
    /* Load counts */
    _loadSheetCounts(_uid(user));
  } else {
    if (av) av.innerHTML  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
    if (nm) nm.textContent = 'Welcome';
    if (em) em.textContent = 'Sign in to unlock all features';
    if (lo) lo.style.display = 'block';
    if (li) li.style.display = 'none';
    if (d2) d2.style.display = 'none';
    if (so) so.style.display = 'none';
  }
}

async function _loadSheetCounts(uid) {
  try {
    const [{ count: lc }, { count: cc }] = await Promise.all([
      _sb.from('likes').select('*', { count:'exact', head:true }).eq('user_id', uid),
      _sb.from('comments').select('*', { count:'exact', head:true }).eq('user_id', uid),
    ]);
    const lcEl = document.getElementById('sheet-likes-count');
    const ccEl = document.getElementById('sheet-comments-count');
    if (lcEl) lcEl.textContent = lc ?? 0;
    if (ccEl) ccEl.textContent = cc ?? 0;
  } catch {}
}

function _gLogo(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`;
}

/* ════════════════════════════════════════════════════════
   BOOTSTRAP
   ════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  document.getElementById('mobile-profile-btn')?.addEventListener('click', openSheet);
  document.getElementById('sheet-backdrop')?.addEventListener('click', closeSheet);
  document.getElementById('sheet-google-signin')?.addEventListener('click', signInWithGoogle);
  document.getElementById('sheet-signout')?.addEventListener('click', signOut);

  const sheet = document.getElementById('mobile-profile-sheet');
  if (sheet) {
    let sy = 0;
    sheet.addEventListener('touchstart', e => { sy = e.touches[0].clientY; }, { passive: true });
    sheet.addEventListener('touchend',   e => { if (e.changedTouches[0].clientY - sy > 72) closeSheet(); }, { passive: true });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
});