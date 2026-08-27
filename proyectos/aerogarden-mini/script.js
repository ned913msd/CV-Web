/* ================================================================
   AEROGARDEN MINI — Botanical Premium Smart Garden
   Standalone luxury product JavaScript
   Features: Plant Configurator, FAQ, Countdown, Scroll Progress, Reveal
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

  // ============ PLANT CONFIGURATOR ============
  const plantTabs = document.querySelectorAll('.plant-tab');
  const plantName = document.querySelector('.plant-name');
  const plantDesc = document.querySelector('.plant-desc');
  const plantLight = document.querySelector('.plant-light');
  const plantGrowth = document.querySelector('.plant-growth');
  const plantGlow = document.querySelector('.plant-glow');

  const plantsData = {
    hierbas: {
      name: 'Hierbas Frescas',
      desc: 'Albahaca, cilantro, menta y perejil. Ideales para cocinar todos los días con sabor fresco.',
      light: '16h/día',
      growth: '21-28 días',
      glowColor: 'rgba(45, 157, 78, 0.2)'
    },
    flores: {
      name: 'Flores Decorativas',
      desc: 'Orquídeas, violetas y geranios. Color y fragancia en tu hogar todo el año.',
      light: '14h/día',
      growth: '30-45 días',
      glowColor: 'rgba(236, 72, 153, 0.2)'
    },
    vegetales: {
      name: 'Vegetales Frescos',
      desc: 'Tomate cherry, pimiento y lechuga. Huerto en miniatura para ensaladas frescas.',
      light: '18h/día',
      growth: '45-60 días',
      glowColor: 'rgba(249, 115, 22, 0.2)'
    },
    microgreens: {
      name: 'Microgreens',
      desc: 'Brotes nutritivos de alfalfa, brócoli y rábano. Superalimentos en 7-14 días.',
      light: '12h/día',
      growth: '7-14 días',
      glowColor: 'rgba(6, 182, 212, 0.2)'
    }
  };

  plantTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      plantTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const plant = tab.dataset.plant;
      const data = plantsData[plant];

      if (data && plantName && plantDesc && plantLight && plantGrowth) {
        plantName.textContent = data.name;
        plantDesc.textContent = data.desc;
        plantLight.textContent = data.light;
        plantGrowth.textContent = data.growth;
      }

      if (plantGlow) {
        plantGlow.style.background = `radial-gradient(circle, ${data.glowColor}, transparent 70%)`;
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
    const days = parseInt(countdownEl.dataset.days) || 7;
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