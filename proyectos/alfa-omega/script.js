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

/* ---------- REVEAL ON SCROLL (AOS-like via IntersectionObserver) ---------- */
(function () {
  /* New system: [data-animate] elements */
  var animatedEls = document.querySelectorAll('[data-animate]');
  /* Legacy: .reveal elements */
  var revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    animatedEls.forEach(function (el) { el.classList.add('visible'); });
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(function (el) { observer.observe(el); });
  revealEls.forEach(function (el) { observer.observe(el); });
})();

/* ---------- VS SECTION COUNTERS ---------- */
(function () {
  var counters = document.querySelectorAll('.vs-counter');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
})();

/* ---------- ANIMATED COUNTERS (stats + case metrics) ---------- */
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
    var btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        var otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
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

/* ---------- BACK TO TOP ---------- */
(function () {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- NAV SHADOW ON SCROLL ---------- */
(function () {
  var nav = document.querySelector('.nav-bar');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
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
  var KEY = 'ao_exit_shown';
  if (sessionStorage.getItem(KEY)) return;

  var popup = document.getElementById('exit-popup');
  if (!popup) return;

  var overlay = popup.querySelector('.exit-popup-overlay');
  var closeBtn = popup.querySelector('.exit-popup-close');
  var dismissBtn = document.getElementById('exit-dismiss');
  var form = document.getElementById('exit-popup-form');
  var shown = false;

  function showPopup() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem(KEY, '1');
    popup.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function hidePopup() {
    popup.classList.remove('visible');
    document.body.style.overflow = '';
  }

  /* Desktop: exit intent (mouse leaves top) */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mouseout', function (e) {
      if (e.clientY < 5 && !shown) {
        setTimeout(showPopup, 500);
      }
    });
  }

  /* Mobile: scroll depth >= 70% */
  if (window.matchMedia('(pointer: coarse)').matches) {
    var fired = false;
    window.addEventListener('scroll', function () {
      if (fired) return;
      var scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled >= 0.7) {
        fired = true;
        setTimeout(showPopup, 600);
      }
    }, { passive: true });
  }

  if (overlay) overlay.addEventListener('click', hidePopup);
  if (closeBtn) closeBtn.addEventListener('click', hidePopup);
  if (dismissBtn) dismissBtn.addEventListener('click', hidePopup);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && shown) hidePopup();
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = document.getElementById('exit-email');
      var msgEl = document.getElementById('exit-email-msg');
      if (!validateEmailField(emailInput, msgEl)) return;
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = '✓ ¡Listo! Revisa tu correo.';
      btn.style.opacity = '0.7';
      var fd = new FormData(form);
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then(function () {
          msgEl.textContent = '¡Listo! Revisa tu correo en los próximos 5 minutos.';
          msgEl.className = 'form-msg success';
          setTimeout(hidePopup, 2500);
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'ENVIARMELO AHORA →';
          btn.style.opacity = '1';
          msgEl.textContent = 'Error de red. Intenta de nuevo.';
          msgEl.className = 'form-msg error';
        });
    });
  }
})();

/* ---------- FORM VALIDATION ENGINE ---------- */
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmailField(input, msgEl) {
  var val = input.value.trim();
  if (!val) {
    input.setAttribute('data-valid', 'false');
    if (msgEl) { msgEl.textContent = 'Ingresa tu email para continuar.'; msgEl.className = 'form-msg error'; }
    return false;
  }
  if (!EMAIL_RE.test(val)) {
    input.setAttribute('data-valid', 'false');
    if (msgEl) { msgEl.textContent = 'El email no es válido. Ejemplo: nombre@correo.com'; msgEl.className = 'form-msg error'; }
    return false;
  }
  input.setAttribute('data-valid', 'true');
  if (msgEl) { msgEl.textContent = ''; msgEl.className = 'form-msg'; }
  return true;
}

/* Real-time validation on blur + input */
document.querySelectorAll('input[type="email"]').forEach(function (input) {
  var msgId = input.getAttribute('aria-describedby');
  var msgEl = msgId ? document.getElementById(msgId) : null;

  input.addEventListener('blur', function () {
    if (input.value.trim()) validateEmailField(input, msgEl);
  });

  input.addEventListener('input', function () {
    if (input.getAttribute('data-valid') === 'false' && input.value.trim()) {
      validateEmailField(input, msgEl);
    }
  });
});

/* ---------- HERO FORM SUBMISSION ---------- */
(function () {
  var heroForm = document.getElementById('hero-form');
  if (!heroForm) return;

  heroForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailInput = document.getElementById('hero-email');
    var msgEl = document.getElementById('hero-email-msg');
    if (!validateEmailField(emailInput, msgEl)) return;

    var btn = heroForm.querySelector('.hero-form-btn');
    var originalText = btn.textContent;
    btn.textContent = '✓ ¡Enviado! Revisa tu email';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    msgEl.textContent = '¡Listo! Revisa tu correo en los próximos 5 minutos.';
    msgEl.className = 'form-msg success';

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
        emailInput.removeAttribute('data-valid');
        msgEl.textContent = '';
        msgEl.className = 'form-msg';
      }, 4000);
    }).catch(function () {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      msgEl.textContent = 'Error de red. Intenta de nuevo.';
      msgEl.className = 'form-msg error';
    });
  });
})();

/* ---------- NEWSLETTER FORM ---------- */
(function () {
  var form = document.getElementById('newsletter-form');
  var success = document.getElementById('newsletter-success');
  if (!form || !success) return;

  var emailInput = document.getElementById('newsletter-email');
  var msgEl = document.getElementById('newsletter-email-msg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateEmailField(emailInput, msgEl)) return;

    var gdpr = form.querySelector('input[name="gdpr"]');
    if (gdpr && !gdpr.checked) {
      msgEl.textContent = 'Debes aceptar la política de privacidad.';
      msgEl.className = 'form-msg error';
      return;
    }

    var btn = form.querySelector('.newsletter-btn');
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    btn.style.opacity = '0.7';
    msgEl.textContent = '';
    msgEl.className = 'form-msg';

    var replyto = form.querySelector('input[name="replyto"]');
    if (replyto) replyto.value = emailInput.value;

    var fd = new FormData(form);
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.hidden = true;
          success.hidden = false;
        } else {
          throw new Error('Submit failed');
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.opacity = '1';
        msgEl.textContent = 'Ups, algo salió mal. Intenta de nuevo o escríbenos a ned913msd@gmail.com';
        msgEl.className = 'form-msg error';
      });
  });
})();
