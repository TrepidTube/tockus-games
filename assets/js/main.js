/* ============================================================
   Tockus Games — interacciones
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- año del footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- menú móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- barra pegajosa ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal al entrar en pantalla ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- formulario (demo, sin backend) ---------- */
  var form = document.getElementById('form');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('input, textarea');
      var ok = true;
      fields.forEach(function (f) {
        var valid = f.value.trim() !== '' && (f.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.classList.toggle('err', !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        if (status) status.textContent = 'Revisa los campos marcados.';
        return;
      }
      if (status) status.textContent = '';
      form.reset();
      toast('MENSAJE ENVIADO · GRACIAS');
      // Para recibirlos de verdad: conecta Formspree, Netlify Forms o tu propio endpoint.
    });
  }

  /* ---------- toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }

  /* ---------- fondo de estrellas pixeladas ---------- */
  var canvas = document.getElementById('stars');
  if (canvas && !reduced) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var colors = ['#FFFFFF', '#5BE0FF', '#FF7A18', '#3B82F6'];

    function build() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((window.innerWidth * window.innerHeight) / 11000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          s: Math.random() < 0.82 ? 2 : 3,
          v: 0.08 + Math.random() * 0.35,
          c: colors[Math.random() < 0.8 ? 0 : 1 + Math.floor(Math.random() * 3)],
          a: 0.25 + Math.random() * 0.6
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.y += st.v;
        if (st.y > window.innerHeight) { st.y = -4; st.x = Math.random() * window.innerWidth; }
        ctx.globalAlpha = st.a;
        ctx.fillStyle = st.c;
        ctx.fillRect(Math.round(st.x), Math.round(st.y), st.s, st.s);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    build();
    draw();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(build, 180);
    });
  }

  /* ---------- easter egg: código Konami ---------- */
  var konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;
  document.addEventListener('keydown', function (e) {
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === konami[pos] ? pos + 1 : (key === konami[0] ? 1 : 0);
    if (pos === konami.length) {
      pos = 0;
      document.body.classList.toggle('konami');
      toast('↑↑↓↓←→←→BA · 30 VIDAS EXTRA');
    }
  });
})();
