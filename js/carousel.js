/* ============================================================
   carousel.js — Bento Grid Gallery + Modal Viewer  v3.0
   All Supabase. No Firebase references anywhere.
   Depends on: utils.js, auth.js (window.sb, window.currentUser)
   ============================================================ */
'use strict';

const GALLERY_PHOTOS = [
  { src:'images/sworup1.jpeg',     caption:'2082 Dashain — Syangja',       location:'Syangja, Nepal'   },
  { src:'images/sworup2.jpeg',     caption:'Little Refreshment',            location:'Nepal'            },
  { src:'images/sworup3.jpg',      caption:'Casual Vibes',                  location:'Nepal'            },
  { src:'images/sworup4.jpg',      caption:'Bindhavasini Temple',           location:'Pokhara, Nepal'   },
  { src:'images/sworup5.jpeg',     caption:'Party Moment',                  location:'Nepal'            },
  { src:'images/sworup6.jpeg',     caption:'Cultural Vibes',                location:'Nepal'            },
  { src:'images/sworup7.jpg',      caption:'Aesthetic Vibes',               location:'Pokhara, Nepal'   },
  { src:'images/certificate1.jpg', caption:'Graphic Design Certificate',    location:'Achievement'      },
];

/* ── Supabase helpers ───────────────────────────────────── */
const sb  = () => window.sb;
const uid = () => window.currentUser?.id ?? null;
const uName  = () => window.currentUser?.user_metadata?.full_name  || window.currentUser?.email?.split('@')[0] || 'Anonymous';
const uPhoto = () => window.currentUser?.user_metadata?.avatar_url || '';

function _ago(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ── Fetch like count ────────────────────────────────────── */
async function _likeCount(postId) {
  const { count } = await sb().from('likes')
    .select('*', { count:'exact', head:true }).eq('post_id', postId);
  return count ?? 0;
}

/* ── Check user liked ────────────────────────────────────── */
async function _userLiked(postId) {
  if (!uid()) return false;
  const { data } = await sb().from('likes')
    .select('id').eq('post_id', postId).eq('user_id', uid()).maybeSingle();
  return !!data;
}

/* ── Fetch comments ──────────────────────────────────────── */
async function _fetchComments(postId) {
  const { data } = await sb().from('comments')
    .select('*').eq('post_id', postId).order('created_at', { ascending: true });
  return data ?? [];
}

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════════════════
     HYBRID CARD GRID
     ════════════════════════════════════════════════════════ */
  const grid = document.getElementById('photo-grid');
  if (!grid) return;

  GALLERY_PHOTOS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.index = i;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View photo: ${p.caption}`);
    card.innerHTML = `
      <div class="pc-img-wrap loading" id="pcw-${i}">
        <img class="pc-img" src="${p.src}" alt="${p.caption}" loading="${i < 3 ? 'eager' : 'lazy'}" />
        <div class="pc-overlay">
          <div class="pc-overlay-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-title">${p.caption}</div>
        <div class="pc-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${p.location}
        </div>
        <div class="pc-footer">
          <span class="pc-likes" id="pcl-${i}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span id="blpc-${i}">–</span>
          </span>
          <span class="pc-open-hint">View →</span>
        </div>
      </div>`;

    /* Remove shimmer once image loads */
    const img  = card.querySelector('.pc-img');
    const wrap = card.querySelector('.pc-img-wrap');
    img.addEventListener('load',  () => wrap.classList.remove('loading'));
    img.addEventListener('error', () => wrap.classList.remove('loading'));

    card.addEventListener('click',   () => openModal(i));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(i); } });
    grid.appendChild(card);
  });

  /* Load like counts — update card footer + style it if > 0 */
  setTimeout(async () => {
    if (!sb()) return;
    for (let i = 0; i < GALLERY_PHOTOS.length; i++) {
      const c = await _likeCount(`photo_${i}`).catch(() => 0);
      const numEl  = document.getElementById(`blpc-${i}`);
      const rowEl  = document.getElementById(`pcl-${i}`);
      if (numEl) numEl.textContent = c;
      if (rowEl && c > 0) rowEl.classList.add('has-likes');
    }
  }, 700);

  /* ════════════════════════════════════════════════════════
     GALLERY MODAL  (click grid cell → opens modal)
     ════════════════════════════════════════════════════════ */
  const modal    = document.getElementById('gallery-modal');
  const gmClose  = document.getElementById('gm-close');
  const gmPrev   = document.getElementById('gm-prev');
  const gmNext   = document.getElementById('gm-next');
  const gmImg    = document.getElementById('gm-img');
  const gmCaption = document.getElementById('gm-caption');
  const gmLocation = document.getElementById('gm-location');
  const gmLikeBtn  = document.getElementById('gm-like-btn');
  const gmLikeNum  = document.getElementById('gm-like-num');
  const gmCmtNum   = document.getElementById('gm-cmt-num');
  const gmSaveBtn  = document.getElementById('gm-save-btn');
  const gmShareBtn = document.getElementById('gm-share-btn');
  const gmCmtList  = document.getElementById('gm-cmt-list');
  const gmCmtWrap  = document.getElementById('gm-cmt-input-wrap');

  let curIdx   = 0;
  let _channel = null;

  async function openModal(idx) {
    if (!modal) return;
    curIdx = idx;
    const p = GALLERY_PHOTOS[idx];

    /* Set image immediately */
    gmImg.classList.remove('loaded');
    gmImg.onload = () => gmImg.classList.add('loaded');
    gmImg.src    = p.src;
    gmImg.alt    = p.caption;
    if (gmCaption)  gmCaption.textContent  = p.caption;
    if (gmLocation) gmLocation.textContent = p.location;

    /* Reset state */
    gmLikeBtn?.classList.remove('liked');
    gmLikeBtn?.setAttribute('aria-pressed', 'false');
    gmLikeBtn?.querySelector('.gm-heart')?.setAttribute('fill', 'none');
    if (gmLikeNum) gmLikeNum.textContent = '–';
    if (gmCmtNum)  gmCmtNum.textContent  = '–';
    if (gmCmtList) gmCmtList.innerHTML   = '<div class="gm-loading">Loading…</div>';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    gmClose?.focus();
    if (typeof startLoading === 'function') startLoading();

    const store = sb();
    if (!store) { if (typeof finishLoading === 'function') finishLoading(); return; }

    const postId = `photo_${idx}`;
    try {
      const [likes, liked, comments] = await Promise.all([
        _likeCount(postId),
        _userLiked(postId),
        _fetchComments(postId),
      ]);

      if (gmLikeNum) gmLikeNum.textContent = likes;
      if (gmCmtNum)  gmCmtNum.textContent  = comments.length;

      /* Like button state */
      if (liked) {
        gmLikeBtn?.classList.add('liked');
        gmLikeBtn?.setAttribute('aria-pressed', 'true');
        gmLikeBtn?.querySelector('.gm-heart')?.setAttribute('fill', 'currentColor');
      }

      /* Render comments */
      _renderComments(comments, gmCmtList);

      /* Render input */
      _renderInput(postId, gmCmtWrap, gmCmtList, gmCmtNum);

      /* Realtime like count */
      if (_channel) { store.removeChannel(_channel); _channel = null; }
      _channel = store.channel(`gallery-likes-${postId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'likes', filter: `post_id=eq.${postId}` },
          async () => {
            const c = await _likeCount(postId);
            if (gmLikeNum) gmLikeNum.textContent = c;
            const gridNum = document.getElementById(`blpc-${idx}`);
            if (gridNum) gridNum.textContent = c;
            const gridRow = document.getElementById(`pcl-${idx}`);
            if (gridRow) gridRow.classList.toggle('has-likes', c > 0);
          })
        .subscribe();

    } catch (e) { console.warn('gallery modal:', e); }

    if (typeof finishLoading === 'function') finishLoading();
  }

  function closeModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
    const store = sb();
    if (_channel && store) { store.removeChannel(_channel); _channel = null; }
  }

  function goTo(delta) {
    openModal((curIdx + delta + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  }

  /* ── Like ────────────────────────────────────────────────── */
  gmLikeBtn?.addEventListener('click', async () => {
    if (!uid()) { showToast('👆 Sign in to like!', 3000); return; }
    const store  = sb();
    if (!store) return;
    const postId = `photo_${curIdx}`;

    /* Optimistic update */
    const wasLiked = gmLikeBtn.classList.contains('liked');
    gmLikeBtn.classList.toggle('liked', !wasLiked);
    gmLikeBtn.setAttribute('aria-pressed', String(!wasLiked));
    gmLikeBtn.querySelector('.gm-heart')?.setAttribute('fill', wasLiked ? 'none' : 'currentColor');
    if (!wasLiked) {
      gmLikeBtn.classList.add('like-pop');
      setTimeout(() => gmLikeBtn.classList.remove('like-pop'), 450);
    }

    if (wasLiked) {
      await store.from('likes').delete()
        .eq('post_id', postId).eq('user_id', uid());
    } else {
      await store.from('likes').insert({ post_id: postId, user_id: uid() });
    }
  });

  /* ── Save (bookmark) ─────────────────────────────────────── */
  gmSaveBtn?.addEventListener('click', () => {
    gmSaveBtn.classList.toggle('saved');
    showToast(gmSaveBtn.classList.contains('saved') ? '🔖 Photo saved!' : '🔖 Removed from saved.', 2500);
  });

  /* ── Share ───────────────────────────────────────────────── */
  gmShareBtn?.addEventListener('click', async () => {
    const p = GALLERY_PHOTOS[curIdx];
    try { await navigator.share({ title: p.caption, url: window.location.href }); }
    catch { navigator.clipboard?.writeText(window.location.href); showToast('🔗 Link copied!', 2500); }
  });

  /* ── Render comment list ────────────────────────────────── */
  function _renderComments(comments, listEl) {
    if (!listEl) return;
    if (!comments.length) {
      listEl.innerHTML = `<div class="gm-no-cmt">No comments yet — be the first ✨</div>`;
      return;
    }
    listEl.innerHTML = comments.map(c => `
      <div class="gm-cmt">
        <div class="gm-cmt-av">${c.photo_url
          ? `<img src="${c.photo_url}" alt="${esc(c.display_name)}">`
          : `<span>${(c.display_name || 'A')[0].toUpperCase()}</span>`}
        </div>
        <div class="gm-cmt-body">
          <span class="gm-cmt-name">${esc(c.display_name)}</span>
          <span class="gm-cmt-text">${esc(c.text)}</span>
          <div class="gm-cmt-time">${_ago(c.created_at)}</div>
        </div>
      </div>`).join('');
    listEl.scrollTop = listEl.scrollHeight;
  }

  /* ── Render comment input ───────────────────────────────── */
  function _renderInput(postId, wrap, listEl, countEl) {
    if (!wrap) return;
    if (uid()) {
      const photo = uPhoto(), name = uName();
      wrap.innerHTML = `
        <div class="gm-ci-row">
          <div class="gm-ci-av">
            ${photo ? `<img src="${photo}" alt="${esc(name)}">` : `<span>${name[0].toUpperCase()}</span>`}
          </div>
          <input class="gm-ci-input" type="text" placeholder="Add a comment…" maxlength="300" id="gm-ci-input" />
          <button class="gm-ci-post" id="gm-ci-post">Post</button>
        </div>`;

      const input = document.getElementById('gm-ci-input');
      const btn   = document.getElementById('gm-ci-post');
      const doPost = async () => {
        const text = input?.value.trim();
        if (!text) return;
        btn.disabled = true;
        const store = sb();
        await store.from('comments').insert({
          post_id:      postId,
          user_id:      uid(),
          display_name: uName(),
          photo_url:    uPhoto(),
          text,
        });
        if (input) input.value = '';
        btn.disabled = false;
        const fresh = await _fetchComments(postId);
        _renderComments(fresh, listEl);
        if (countEl) countEl.textContent = fresh.length;
      };
      btn?.addEventListener('click', doPost);
      input?.addEventListener('keydown', e => { if (e.key === 'Enter') doPost(); });
    } else {
      wrap.innerHTML = `
        <button class="gm-signin-cta" id="gm-signin-cta">
          <svg viewBox="0 0 24 24" width="15" height="15" style="flex-shrink:0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google to comment
        </button>`;
      document.getElementById('gm-signin-cta')?.addEventListener('click', () => {
        closeModal();
        setTimeout(() => typeof signInWithGoogle === 'function' && signInWithGoogle(), 320);
      });
    }
  }

  /* ── Controls ─────────────────────────────────────────────── */
  gmClose?.addEventListener('click', closeModal);
  gmPrev?.addEventListener('click',  () => goTo(-1));
  gmNext?.addEventListener('click',  () => goTo(+1));
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', e => {
    if (!modal?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  goTo(-1);
    if (e.key === 'ArrowRight') goTo(+1);
  });

  /* Touch swipe */
  let _tx = 0;
  modal?.addEventListener('touchstart', e => { _tx = e.touches[0].clientX; }, { passive: true });
  modal?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - _tx;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ════════════════════════════════════════════════════════
     PORTFOLIO DRAG SCROLL
     ════════════════════════════════════════════════════════ */
  const pg = document.getElementById('projects-grid');
  if (pg) {
    let dn = false, sx = 0, sl = 0;
    pg.addEventListener('mousedown',  e => { dn = true; pg.classList.add('grabbing'); sx = e.pageX - pg.offsetLeft; sl = pg.scrollLeft; });
    pg.addEventListener('mouseleave', () => { dn = false; pg.classList.remove('grabbing'); });
    pg.addEventListener('mouseup',    () => { dn = false; pg.classList.remove('grabbing'); });
    pg.addEventListener('mousemove',  e => { if (!dn) return; e.preventDefault(); pg.scrollLeft = sl - (e.pageX - pg.offsetLeft - sx); });
    document.getElementById('portfolio-prev')?.addEventListener('click', () => pg.scrollBy({ left: -340, behavior: 'smooth' }));
    document.getElementById('portfolio-next')?.addEventListener('click', () => pg.scrollBy({ left:  340, behavior: 'smooth' }));
  }

});