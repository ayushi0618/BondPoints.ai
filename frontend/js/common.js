/* ============================================================
   BondPoints — shared helpers (loaded by every page)
   ============================================================ */
(function () {
  'use strict';

  // Backend API base. Override with window.BONDPOINTS_API_BASE
  // (e.g. "http://localhost:5000" for local dev). Defaults to the
  // production Render backend (CORS is enabled there).
  const API_BASE = (window.BONDPOINTS_API_BASE || 'https://bondpoints-ai.onrender.com').replace(/\/$/, '');
  window.BP_API = API_BASE;

  /* ---------- toast notifications (cute, no alert() spam) ---------- */
  function toast(msg, type) {
    let el = document.getElementById('bp-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'bp-toast';
      document.body.appendChild(el);
    }
    const emoji = type === 'success' ? '💗' : type === 'error' ? '🥺' : '✨';
    el.className = type || '';
    el.innerHTML = '<span class="t-emoji">' + emoji + '</span>' + escapeHtml(msg);
    // force reflow so re-triggering works
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3400);
  }
  window.bpToast = toast;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  window.bpEscape = escapeHtml;

  /* ---------- auth helpers ---------- */
  window.bpGetToken = () => localStorage.getItem('token');
  window.bpSetToken = (t) => localStorage.setItem('token', t);
  window.bpLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  };
  // Redirect to login when there is no token
  window.bpRequireAuth = () => {
    if (!window.bpGetToken()) { window.location.href = 'index.html?login=1'; return false; }
    return true;
  };

  /* ---------- API helper ---------- */
  window.bpApi = async function (path, opts) {
    opts = opts || {};
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    const token = window.bpGetToken();
    if (token) headers['x-auth-token'] = token;
    const res = await fetch(API_BASE + path, Object.assign({}, opts, { headers }));
    let data = null;
    try { data = await res.json(); } catch (e) { /* non-JSON */ }
    return { ok: res.ok, status: res.status, data };
  };

  /* ---------- floating hearts background ---------- */
  window.bpHearts = function (canvasId, count) {
    const canvas = document.getElementById(canvasId || 'heartsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const N = count || 26;
    let W, H;
    const hearts = [];
    const COLORS = ['#ffb3cd', '#ff8fb3', '#ffd0e0', '#e6c9ff', '#ffc9a8'];

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    addEventListener('resize', resize); resize();

    function make(fromBottom) {
      return {
        x: Math.random() * W,
        y: fromBottom ? H + 30 : Math.random() * H,
        s: 8 + Math.random() * 16,
        v: 0.25 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.4,
        o: 0.25 + Math.random() * 0.45,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      };
    }
    for (let i = 0; i < N; i++) hearts.push(make(false));

    function drawHeart(x, y, s, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.translate(x, y);
      ctx.scale(s / 20, s / 20);
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.bezierCurveTo(-11, -4, -6, -14, 0, -7);
      ctx.bezierCurveTo(6, -14, 11, -4, 0, 6);
      ctx.fill();
      ctx.restore();
    }

    (function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.y -= h.v; h.x += h.drift;
        if (h.y < -40) hearts[i] = make(true);
        else drawHeart(h.x, h.y, h.s, h.c, h.o);
      }
      requestAnimationFrame(tick);
    })();
  };

  /* ---------- mobile nav toggle (pages opt in with .nav-toggle) ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.bp-nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
      links.addEventListener('click', (e) => {
        if (e.target.closest('a,button')) links.classList.remove('open');
      });
    }
  });
})();
