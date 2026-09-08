/* ================================================================
   ALFA & OMEGA — Landing Pages de Alta Conversión
   JS v2.1: reveal, counters, FAQ, particles, sticky header,
   urgency bar, activity widget, exit-intent popup, mobile menu
================================================================ */

/* ---------- URGENCY BAR (close + localStorage) ---------- */
(function () {
  var bar = document.getElementById('urgency-bar');
  var closeBtn = document.getElementById('urgency-bar-close');
  if (!bar || !closeBtn) return;

  try {
    if (localStorage.getItem('ao_urgency_closed') === '1') {
      bar.classList.add('hidden');
      return;
    }
  } catch (e) {}

  closeBtn.addEventListener('click', function () {
    bar.classList.add('hidden');
    try { localStorage.setItem('ao_urgency_closed', '1'); } catch (e) {}
  });
})();

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

/* ---------- FAQ ACCORDION ---------- */
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

/* ---------- PARTICLE FIELD ---------- */
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

/* ---------- STICKY HEADER (appears after hero) ---------- */
(function () {
  var sticky = document.getElementById('sticky-header');
  var hero = document.querySelector('.hero');
  if (!sticky || !hero) return;

  function onScroll() {
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - 80) {
      sticky.classList.add('visible');
    } else {
      sticky.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- NAV SHADOW ON SCROLL ---------- */
(function () {
  var nav = document.querySelector('.nav-bar');
  if (!nav) return;
  function onScroll() {
    nav.style.boxShadow = window.scrollY > 10 ? '0 10px 30px rgba(0,0,0,0.5)' : 'none';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- ACTIVITY NOTIFICATIONS WIDGET ---------- */
(function () {
  var widget = document.getElementById('activity-widget');
  if (!widget) return;

  var notifications = [
    { icon: '🔥', name: 'Juan de Bogotá', action: 'solicitó su auditoría gratis', time: 'hace 3 min' },
    { icon: '⭐', name: 'María de Medellín', action: 'aumentó sus ventas 280%', time: 'hace 15 min' },
    { icon: '🔥', name: 'Carlos de Cali', action: 'activó su plan Professional', time: 'hace 22 min' },
    { icon: '📈', name: 'Laura de Barranquilla', action: 'triplicó su conversión', time: 'hace 1 hora' },
    { icon: '⭐', name: 'Andrés de Bucaramanga', action: 'dejó reseña 5 estrellas', time: 'hace 2 horas' },
  ];

  var current = 0;
  var textEl = widget.querySelector('.activity-text');
  var iconEl = widget.querySelector('.activity-icon');
  var timeEl = widget.querySelector('.activity-time');

  function showNotification(n) {
    widget.classList.remove('hidden');
    if (iconEl) iconEl.textContent = n.icon;
    if (textEl) textEl.innerHTML = '<strong>' + n.name + '</strong> ' + n.action;
    if (timeEl) timeEl.textContent = n.time;
  }

  setInterval(function () {
    widget.classList.add('hidden');
    setTimeout(function () {
      current = (current + 1) % notifications.length;
      showNotification(notifications[current]);
    }, 400);
  }, 6000);

  showNotification(notifications[0]);
})();

/* ---------- EXIT-INTENT POPUP ---------- */
(function () {
  var popup = document.getElementById('exit-popup');
  if (!popup) return;

  var overlay = popup.querySelector('.exit-popup-overlay');
  var closeBtn = popup.querySelector('.exit-popup-close');
  var form = document.getElementById('exit-popup-form');
  var shown = false;

  function showPopup() {
    if (shown) return;
    shown = true;
    popup.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    popup.classList.remove('visible');
    document.body.style.overflow = '';
  }

  document.addEventListener('mouseout', function (e) {
    if (e.clientY < 5 && !shown) {
      setTimeout(showPopup, 500);
    }
  });

  if (overlay) overlay.addEventListener('click', hidePopup);
  if (closeBtn) closeBtn.addEventListener('click', hidePopup);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && shown) hidePopup();
  });

  if (form) {
    form.addEventListener('submit', function () {
      setTimeout(hidePopup, 500);
    });
  }
})();

/* ---------- HERO FORM SUBMISSION ---------- */
(function () {
  var heroForm = document.getElementById('hero-form');
  if (!heroForm) return;

  heroForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = heroForm.querySelector('.hero-form-btn');
    var originalText = btn.textContent;
    btn.textContent = '✓ ¡Enviado! Revisa tu email';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    var formData = new FormData(heroForm);
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    }).then(function () {
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        heroForm.reset();
      }, 3000);
    }).catch(function () {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    });
  });
})();
