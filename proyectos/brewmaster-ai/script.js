/* ================================================================
   BREWMASTER AI — Premium Coffee Technology
   Standalone luxury product JavaScript
   Features: Methods Configurator, FAQ, Countdown, Scroll Progress, Reveal
=============================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ============ SCROLL PROGRESS ============
  const progressBar = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (progressBar) progressBar.style.width = progress + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ============ HEADER SCROLL ============
  const header = document.querySelector('header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ============ MOBILE MENU ============
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('abierto');
      document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
      mobileMenu.classList.remove('abierto');
      document.body.style.overflow = '';
    };

    mobileClose?.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  // ============ REVEAL ON SCROLL ============
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============ METHODS CONFIGURATOR ============
  const methodTabs = document.querySelectorAll('.method-tab');
  const methodTitle = document.querySelector('.method-title');
  const methodDesc = document.querySelector('.method-desc');
  const methodTemp = document.querySelector('.method-temp');
  const methodTime = document.querySelector('.method-time');

  const methodsData = {
    espresso: {
      title: 'Espresso',
      desc: 'Extracción bajo presión que concentra los aceites esenciales del café. Denso, aromático y con una capa de crema perfecta.',
      temp: '93°C',
      time: '25s'
    },
    americano: {
      title: 'Americano',
      desc: 'Espresso diluido con agua caliente. Suave, equilibrado y perfecto para quienes prefieren un café más ligero.',
      temp: '90°C',
      time: '3min'
    },
    coldbrew: {
      title: 'Cold Brew',
      desc: 'Extracción en frío durante 12 horas. Resultado suave, dulce y con mínima acidez. Ideal para días calurosos.',
      temp: '20°C',
      time: '12h'
    },
    pourover: {
      title: 'Pour Over',
      desc: 'Filtrado gradual que resalta notas florales y frutales. Limpio, complejo y perfecto para origin singles.',
      temp: '92°C',
      time: '4min'
    },
    frenchpress: {
      title: 'French Press',
      desc: 'Inmersión completa que extrae todo el cuerpo del café. Rico, completo y con textura.',
      temp: '94°C',
      time: '4min'
    }
  };

  methodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      methodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const method = tab.dataset.method;
      const data = methodsData[method];

      if (data && methodTitle && methodDesc && methodTemp && methodTime) {
        methodTitle.textContent = data.title;
        methodDesc.textContent = data.desc;
        methodTemp.textContent = data.temp;
        methodTime.textContent = data.time;
      }
    });
  });

  // ============ FAQ ACCORDION ============
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(fi => {
        fi.classList.remove('active');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ============ COUNTDOWN TIMER ============
  const countdownEl = document.querySelector('.countdown-row');
  if (countdownEl) {
    const days = parseInt(countdownEl.dataset.days) || 3;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const updateCountdown = () => {
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        document.getElementById('dias').textContent = '00';
        document.getElementById('horas').textContent = '00';
        document.getElementById('minutos').textContent = '00';
        document.getElementById('segundos').textContent = '00';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('dias').textContent = d.toString().padStart(2, '0');
      document.getElementById('horas').textContent = h.toString().padStart(2, '0');
      document.getElementById('minutos').textContent = m.toString().padStart(2, '0');
      document.getElementById('segundos').textContent = s.toString().padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ MOBILE STICKY CTA ============
  const mobileSticky = document.querySelector('.mobile-sticky');
  if (mobileSticky) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        mobileSticky.style.transform = 'translateY(0)';
      } else {
        mobileSticky.style.transform = 'translateY(100%)';
      }
    }, { passive: true });
  }

  // ============ PARALLAX EFFECT ============
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    }, { passive: true });
  }

  // ============ HERO GLOW MOUSE TRACKING ============
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      heroGlow.style.left = (60 + (x - 0.5) * 20) + '%';
      heroGlow.style.top = (40 + (y - 0.5) * 20) + '%';
    });
  }
});