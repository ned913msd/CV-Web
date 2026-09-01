/* ================================================================
   ALFA & OMEGA — Landing Pages de Alta Conversión
   JS: reveal, contadores, FAQ, particles, menú móvil, nav sticky
================================================================ */

/* ---------- MOBILE MENU ---------- */
(function () {
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      var expanded = hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
      hamburger.setAttribute('aria-expanded', expanded);
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ---------- REVEAL ON SCROLL ---------- */
(function () {
  var revealEls = document.querySelectorAll('.reveal, [class*="delay-"]');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { observer.observe(el); });
})();

/* ---------- ANIMATED COUNTERS ---------- */
(function () {
  var counters = document.querySelectorAll('.stat-number[data-count], .metric-value[data-count]');
  if (!counters.length) return;

  function animate(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = null;

    function format(value) {
      return prefix + value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
    }

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = format(target);
      }
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(function (el) { observer.observe(el); });
})();

/* ---------- FAQ ACCORDION (one open at a time) ---------- */
(function () {
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) { other.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ---------- PARTICLE FIELD (hero) ---------- */
(function () {
  var field = document.querySelector('.particle-field');
  if (!field) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var count = window.innerWidth < 768 ? 20 : 36;
  for (var i = 0; i < count; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.background =
      Math.random() > 0.7 ? 'rgba(0,240,255,0.6)' : 'rgba(0,255,102,0.6)';
    field.appendChild(p);
  }
})();

/* ---------- STICKY NAV "SCROLLED" STATE ---------- */
(function () {
  var nav = document.querySelector('.nav-bar');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
