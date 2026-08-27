/* ================================================================
   VOLTPACK — Premium Anti-Theft Solar Backpack
   Standalone luxury product JavaScript
   Features: Charge Mode Configurator, FAQ, Countdown, Scroll Progress, Reveal
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

  // ============ CHARGE MODE CONFIGURATOR ============
  const modeTabs = document.querySelectorAll('.mode-tab');
  const modeName = document.querySelector('.mode-name');
  const modeDesc = document.querySelector('.mode-desc');
  const modePower = document.querySelector('.mode-power');
  const modeSpeed = document.querySelector('.mode-speed');
  const modeGlow = document.querySelector('.mode-glow');

  const modesData = {
    solar: {
      name: 'Solar',
      desc: 'Carga con energía del sol. Ideal para actividades al aire libre sin enchufes.',
      power: '10W',
      speed: '6-8h',
      glowColor: 'rgba(217, 119, 6, 0.15)'
    },
    usb: {
      name: 'USB Rápido',
      desc: 'Carga rápida por USB-C de 18W. De 0 a 50% en 30 minutos.',
      power: '18W',
      speed: '1.5h',
      glowColor: 'rgba(59, 130, 246, 0.15)'
    },
    hibrido: {
      name: 'Híbrido',
      desc: 'Combina solar + USB para la máxima velocidad de carga.',
      power: '28W',
      speed: '1h',
      glowColor: 'rgba(16, 185, 129, 0.15)'
    },
    eco: {
      name: 'Eco',
      desc: 'Modo de bajo consumo para máxima autonomía cuando más lo necesitas.',
      power: '5W',
      speed: '4h',
      glowColor: 'rgba(139, 92, 246, 0.15)'
    }
  };

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.dataset.mode;
      const data = modesData[mode];

      if (data && modeName && modeDesc && modePower && modeSpeed) {
        modeName.textContent = data.name;
        modeDesc.textContent = data.desc;
        modePower.textContent = data.power;
        modeSpeed.textContent = data.speed;
      }

      if (modeGlow) {
        modeGlow.style.background = `radial-gradient(circle, ${data.glowColor}, transparent 70%)`;
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
    const days = parseInt(countdownEl.dataset.days) || 4;
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