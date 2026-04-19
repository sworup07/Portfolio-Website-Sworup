/* ============================================================
   render.js — Skills, Projects, Blog + Supabase likes/comments
   Depends on: utils.js, data.js
   auth.js exposes: window.sb, window.currentUser
   ============================================================ */
'use strict';

/* ════════════════════════════════════════════════════════
   SUPABASE HELPERS
   ════════════════════════════════════════════════════════ */
const getSB  = () => window.sb || null;
const getUID = () => window.currentUser?.id || null;

function fmtCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n ?? 0);
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Fetch like count for a post ────────────────────────── */
async function fetchLikeCount(postId) {
  const sb = getSB(); if (!sb) return 0;
  const { count } = await sb.from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
  return count ?? 0;
}

/* ── Check if current user liked a post ─────────────────── */
async function fetchUserLiked(postId) {
  const sb = getSB(); const uid = getUID();
  if (!sb || !uid) return false;
  const { data } = await sb.from('likes')
    .select('id').eq('post_id', postId).eq('user_id', uid).maybeSingle();
  return !!data;
}

/* ── Toggle like ────────────────────────────────────────── */
async function doToggleLike(postId, btnEl, countEl) {
  const sb = getSB(); const uid = getUID();
  if (!sb) return;
  if (!uid) { showToast('👆 Sign in to like!', 3000); return; }

  const { data: existing } = await sb.from('likes')
    .select('id').eq('post_id', postId).eq('user_id', uid).maybeSingle();

  if (existing) {
    await sb.from('likes').delete().eq('id', existing.id);
    btnEl?.classList.remove('liked');
    btnEl?.setAttribute('aria-pressed', 'false');
    btnEl?.querySelector('svg')?.setAttribute('fill', 'none');
  } else {
    await sb.from('likes').insert({ post_id: postId, user_id: uid });
    btnEl?.classList.add('liked');
    btnEl?.setAttribute('aria-pressed', 'true');
    btnEl?.querySelector('svg')?.setAttribute('fill', 'currentColor');
    btnEl?.classList.add('like-pop');
    setTimeout(() => btnEl?.classList.remove('like-pop'), 400);
  }

  const newCount = await fetchLikeCount(postId);
  if (countEl) countEl.textContent = fmtCount(newCount);
}

/* ── Fetch comments ─────────────────────────────────────── */
async function fetchComments(postId) {
  const sb = getSB(); if (!sb) return [];
  const { data } = await sb.from('comments')
    .select('*').eq('post_id', postId).order('created_at', { ascending: true });
  return data ?? [];
}

/* ── Post comment ───────────────────────────────────────── */
async function doPostComment(postId, text, listEl, countEl) {
  const sb = getSB(); const uid = getUID();
  if (!sb || !uid || !text.trim()) return;
  const user = window.currentUser;
  await sb.from('comments').insert({
    post_id:      postId,
    user_id:      uid,
    display_name: user.user_metadata?.full_name  || user.email?.split('@')[0] || 'Anonymous',
    photo_url:    user.user_metadata?.avatar_url || '',
    text:         text.trim(),
  });
  const comments = await fetchComments(postId);
  renderCommentList(comments, listEl);
  if (countEl) countEl.textContent = fmtCount(comments.length);
}

/* ── Render comment list ────────────────────────────────── */
function renderCommentList(comments, listEl) {
  if (!listEl) return;
  if (!comments.length) {
    listEl.innerHTML = `<div class="comment-empty">No comments yet. Be the first! 💬</div>`;
    return;
  }
  listEl.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">
        ${c.photo_url
          ? `<img src="${c.photo_url}" alt="${c.display_name}">`
          : `<span>${(c.display_name || 'A')[0].toUpperCase()}</span>`}
      </div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-name">${c.display_name}</span>
          <span class="comment-time">${timeAgo(c.created_at)}</span>
        </div>
        <div class="comment-text">${escHtml(c.text)}</div>
      </div>
    </div>`).join('');
}

/* ── Interaction bar HTML ───────────────────────────────── */
function interactionBarHTML(id, likeCount = 0, commentCount = 0, userLiked = false) {
  return `
    <div class="interaction-bar" data-id="${id}">
      <button class="ib-btn ib-like${userLiked ? ' liked' : ''}" aria-pressed="${userLiked}" aria-label="Like">
        <svg class="ib-heart" viewBox="0 0 24 24" fill="${userLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span class="ib-like-count">${fmtCount(likeCount)}</span>
      </button>
      <button class="ib-btn ib-comment" aria-label="Toggle comments">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="ib-comment-count">${fmtCount(commentCount)}</span>
      </button>
      <button class="ib-btn ib-share" aria-label="Share">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        <span>Share</span>
      </button>
    </div>
    <div class="comment-section" id="cs-${id}" style="display:none">
      <div class="comment-list" id="cl-${id}"></div>
      ${window.currentUser ? `
        <div class="comment-input-row">
          <div class="comment-input-avatar">
            ${window.currentUser.user_metadata?.avatar_url
              ? `<img src="${window.currentUser.user_metadata.avatar_url}" alt="">`
              : `<span>${(window.currentUser.user_metadata?.full_name || 'U')[0]}</span>`}
          </div>
          <input class="comment-input" type="text" placeholder="Add a comment…" maxlength="300" />
          <button class="comment-submit">Post</button>
        </div>` : `
        <div class="comment-signin-prompt">
          <button class="comment-signin-btn">Sign in to comment</button>
        </div>`}
    </div>`;
}

/* ── Wire up interaction bar ────────────────────────────── */
async function wireInteractionBar(containerEl, postId) {
  const bar        = containerEl.querySelector('.interaction-bar');
  const likeBtn    = bar?.querySelector('.ib-like');
  const likeCount  = bar?.querySelector('.ib-like-count');
  const commentBtn = bar?.querySelector('.ib-comment');
  const section    = containerEl.querySelector(`#cs-${postId}`);
  const list       = containerEl.querySelector(`#cl-${postId}`);
  const input      = containerEl.querySelector('.comment-input');
  const submitBtn  = containerEl.querySelector('.comment-submit');
  const signinBtn  = containerEl.querySelector('.comment-signin-btn');
  const shareBtn   = bar?.querySelector('.ib-share');

  if (!bar) return;

  const [total, liked, comments] = await Promise.all([
    fetchLikeCount(postId),
    fetchUserLiked(postId),
    fetchComments(postId),
  ]);

  if (likeCount) likeCount.textContent = fmtCount(total);
  if (liked && likeBtn) { likeBtn.classList.add('liked'); likeBtn.querySelector('svg')?.setAttribute('fill','currentColor'); }
  const ccEl = bar.querySelector('.ib-comment-count');
  if (ccEl) ccEl.textContent = fmtCount(comments.length);

  likeBtn?.addEventListener('click', () => doToggleLike(postId, likeBtn, likeCount));

  commentBtn?.addEventListener('click', () => {
    const open = section.style.display === 'none';
    section.style.display = open ? 'block' : 'none';
    if (open) { renderCommentList(comments, list); input?.focus(); }
  });

  const post = () => {
    if (!input?.value.trim()) return;
    doPostComment(postId, input.value, list, ccEl)
      .then(() => { if (input) input.value = ''; });
  };
  submitBtn?.addEventListener('click', post);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); post(); } });
  signinBtn?.addEventListener('click', () => typeof signInWithGoogle === 'function' && signInWithGoogle());

  shareBtn?.addEventListener('click', async () => {
    try { await navigator.share({ title: 'Sworup Pokhrel', url: window.location.href }); }
    catch { navigator.clipboard?.writeText(window.location.href); showToast('🔗 Link copied!', 2500); }
  });
}

/* ════════════════════════════════════════════════════════
   SKILLS
   ════════════════════════════════════════════════════════ */
function renderSkills() {
  const container = $('#skills-container');
  if (!container) return;
  container.innerHTML = PORTFOLIO_DATA.skills.map(s => `
    <div class="skill-item">
      <div class="skill-header"><span>${s.name}</span><span class="skill-pct">${s.pct}%</span></div>
      <div class="skill-track"><div class="skill-fill" data-pct="${s.pct}"></div></div>
    </div>`).join('');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.pct + '%'; io.unobserve(e.target); } });
  }, { threshold: 0.3 });
  $$('.skill-fill').forEach(f => io.observe(f));
}

/* ════════════════════════════════════════════════════════
   PROJECTS
   ════════════════════════════════════════════════════════ */
function renderProjects() {
  const grid = $('#projects-grid');
  if (!grid) return;
  grid.innerHTML = PORTFOLIO_DATA.projects.map((p, i) => `
    <div class="project-card" data-index="${i}" tabindex="0" role="button" aria-label="View project: ${p.title}">
      <div class="project-icon">${p.icon}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.desc}</div>
      <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
      <div class="project-links"><span class="project-cta">View Details →</span><span class="project-hint">Click to expand</span></div>
    </div>`).join('');
  $$('.project-card', grid).forEach(card => {
    const open = () => openProjectModal(parseInt(card.dataset.index));
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}

function openProjectModal(index) {
  const p = PORTFOLIO_DATA.projects[index], modal = $('#modal');
  if (!modal || !p) return;
  $('#modal-icon').textContent  = p.icon;
  $('#modal-title').textContent = p.title;
  $('#modal-body').textContent  = p.detail;
  $('#modal-tech').innerHTML    = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  $('#modal-demo').href         = p.demo;
  $('#modal-github').href       = p.github;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#modal-close')?.focus(), 80);
  trapFocus(modal.querySelector('.modal-box'));
}

function closeProjectModal() {
  $('#modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════════════════════
   BLOG
   ════════════════════════════════════════════════════════ */
function renderBlog() {
  const grid = $('#blog-grid');
  if (!grid) return;
  grid.innerHTML = PORTFOLIO_DATA.blog.map((post, i) => `
    <article class="blog-card" data-index="${i}" tabindex="0" role="button" aria-label="Read post: ${post.title}">
      <div class="blog-meta">
        <span class="blog-cat" style="background:${post.catColor};color:${post.catText}">${post.cat}</span>
        <span class="blog-read">${post.read}</span>
      </div>
      <div class="blog-title">${post.title}</div>
      <div class="blog-snippet">${post.snippet}</div>
      <div class="blog-footer">
        <span class="blog-date">${post.date}</span>
        <span class="blog-more">Read more →</span>
      </div>
      <div class="blog-card-interaction">
        <span class="bci-likes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span id="bci-${i}">0</span>
        </span>
        <span class="bci-comments">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span id="bcc-${i}">0</span>
        </span>
      </div>
    </article>`).join('');

  /* Load card counts async */
  setTimeout(() => {
    const sb = getSB(); if (!sb) return;
    PORTFOLIO_DATA.blog.forEach((_, i) => {
      const pid = `blog_${i}`;
      sb.from('likes').select('*',{count:'exact',head:true}).eq('post_id',pid)
        .then(({count}) => { const el = $(`#bci-${i}`); if (el) el.textContent = fmtCount(count); });
      sb.from('comments').select('*',{count:'exact',head:true}).eq('post_id',pid)
        .then(({count}) => { const el = $(`#bcc-${i}`); if (el) el.textContent = fmtCount(count); });
    });
  }, 500);

  $$('.blog-card', grid).forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.blog-card-interaction')) return;
      openBlogModal(parseInt(card.dataset.index));
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openBlogModal(parseInt(card.dataset.index)); });
  });
}

async function openBlogModal(index) {
  const post = PORTFOLIO_DATA.blog[index], modal = $('#blog-modal');
  if (!modal || !post) return;
  if (typeof startLoading === 'function') startLoading();

  const postId = `blog_${index}`;
  const [totalLikes, userLiked, comments] = await Promise.all([
    fetchLikeCount(postId),
    fetchUserLiked(postId),
    fetchComments(postId),
  ]).catch(() => [0, false, []]);

  if (typeof finishLoading === 'function') finishLoading();

  /* ── Sticky bar ── */
  const stickyBar  = document.getElementById('blog-sticky-bar');
  const bsbTitle   = document.getElementById('bsb-title');
  const bsbLike    = document.getElementById('bsb-like');
  const bsbLikeNum = document.getElementById('bsb-like-count');
  const bsbCmtNum  = document.getElementById('bsb-cmt-count');
  const bsbComment = document.getElementById('bsb-comment');

  if (bsbTitle)   bsbTitle.textContent   = post.title;
  if (bsbLikeNum) bsbLikeNum.textContent = fmtCount(totalLikes);
  if (bsbCmtNum)  bsbCmtNum.textContent  = fmtCount(comments.length);

  /* Set initial liked state on sticky bar */
  if (bsbLike) {
    bsbLike.classList.toggle('liked', userLiked);
    bsbLike.setAttribute('aria-pressed', String(userLiked));
    bsbLike.querySelector('.bsb-heart')?.setAttribute('fill', userLiked ? 'currentColor' : 'none');
    bsbLike.onclick = async () => {
      const wasLiked = bsbLike.classList.contains('liked');
      bsbLike.classList.toggle('liked', !wasLiked);
      bsbLike.setAttribute('aria-pressed', String(!wasLiked));
      bsbLike.querySelector('.bsb-heart')?.setAttribute('fill', wasLiked ? 'none' : 'currentColor');
      if (!wasLiked) { bsbLike.classList.add('like-pop'); setTimeout(() => bsbLike.classList.remove('like-pop'), 400); }
      /* Mirror to bottom bar */
      const botLike = document.querySelector(`#bmi-${postId} .ib-like`);
      botLike?.classList.toggle('liked', !wasLiked);
      await doToggleLike(postId, bsbLike, bsbLikeNum);
      /* Sync bottom bar count */
      const botCount = document.querySelector(`#bmi-${postId} .ib-like-count`);
      if (botCount) botCount.textContent = bsbLikeNum.textContent;
    };
  }

  /* Jump to comments */
  if (bsbComment) {
    bsbComment.onclick = () => {
      const cmtSection = document.getElementById(`cs-${postId}`);
      if (cmtSection) {
        cmtSection.style.display = 'block';
        cmtSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cmtSection.querySelector('.comment-input')?.focus();
      }
    };
  }

  /* ── Body content ── */
  $('#blog-modal-content').innerHTML = `
    <div class="blog-modal-header">
      <div class="blog-modal-meta">
        <span class="blog-modal-cat" style="background:${post.catColor};color:${post.catText}">${post.cat}</span>
        <span class="blog-modal-read">${post.read}</span>
        <span class="blog-modal-date">${post.date}</span>
      </div>
      <h2 class="blog-modal-title">${post.title}</h2>
      <p class="blog-modal-snippet">${post.snippet}</p>
    </div>
    <div class="blog-modal-divider"></div>
    <div class="blog-modal-body">${post.body.map(p => `<p>${p}</p>`).join('')}</div>
    <div class="blog-modal-footer">
      <div class="blog-modal-tags-label">Tags</div>
      <div class="blog-modal-tags">${post.tags.map(t => `<span class="blog-modal-tag">${t}</span>`).join('')}</div>
    </div>
    <div class="blog-modal-divider"></div>
    <div class="blog-modal-interactions" id="bmi-${postId}">
      ${interactionBarHTML(postId, totalLikes, comments.length, userLiked)}
    </div>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#blog-modal-close')?.focus(), 80);
  trapFocus(modal.querySelector('.blog-modal-box'));

  const wrapper = $(`#bmi-${postId}`);
  if (wrapper) wireInteractionBar(wrapper, postId);

  /* Realtime likes — update BOTH sticky + bottom bar */
  const sb = getSB();
  if (sb) {
    sb.channel(`blog-likes-${postId}`)
      .on('postgres_changes', { event:'*', schema:'public', table:'likes', filter:`post_id=eq.${postId}` },
        async () => {
          const c = await fetchLikeCount(postId);
          const fmt = fmtCount(c);
          if (bsbLikeNum) bsbLikeNum.textContent = fmt;
          const botCount = wrapper?.querySelector('.ib-like-count');
          if (botCount) botCount.textContent = fmt;
          const cardEl = $(`#bci-${index}`);
          if (cardEl) cardEl.textContent = fmt;
        })
      .subscribe();
  }
}

function closeBlogModal() {
  const modal = $('#blog-modal');
  if (!modal) return;
  getSB()?.removeAllChannels();
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════════════════════
   BOOTSTRAP
   ════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderProjects();
  renderBlog();

  $('#modal-close')?.addEventListener('click', closeProjectModal);
  $('#modal')?.addEventListener('click', e => { if (e.target === $('#modal')) closeProjectModal(); });
  $('#blog-modal-close')?.addEventListener('click', closeBlogModal);
  $('#blog-modal')?.addEventListener('click', e => { if (e.target === $('#blog-modal')) closeBlogModal(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeProjectModal(); closeBlogModal();
  });
});