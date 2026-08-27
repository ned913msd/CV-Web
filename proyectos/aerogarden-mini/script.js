/* ================================================================
   AEROGARDEN MINI — Smart Agriculture Technology Script
   Particles, Counters, Plant Tabs, FAQ, Countdown, Dashboard, Reveal
=============================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============ SCROLL PROGRESS ============
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    }, { passive: true });
  }

  // ============ HEADER SCROLL ============
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ============ MOBILE MENU ============
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-close');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('abierto'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('abierto'));
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('abierto'));
    });
  }

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============ PARTICLES ============
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${8 + Math.random() * 12}s;
        animation-delay: ${Math.random() * 10}s;
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        opacity: ${0.2 + Math.random() * 0.4};
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ============ NUMBER COUNTER ============
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const startTime = performance.now();

        function animate(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          el.textContent = prefix + (target % 1 !== 0 ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(el => counterObserver.observe(el));

  // ============ PLANT CONFIGURATOR ============
  const plantTabs = document.querySelectorAll('.plant-tab');
  const plantName = document.querySelector('.plant-name');
  const plantDesc = document.querySelector('.plant-desc');
  const plantLight = document.querySelector('.plant-light');
  const plantGrowth = document.querySelector('.plant-growth');
  const plantImg = document.querySelector('.plant-content img');

  const plantsData = {
    herbs: {
      name: 'Hierbas Frescas',
      desc: 'Albahaca, cilantro, menta y perejil. Ideales para cocinar todos los días con sabor fresco.',
      light: '16h/día', growth: '21-28 días',
      img: 'aerogarden-mini.webp'
    },
    flowers: {
      name: 'Flores Decorativas',
      desc: 'Orquídeas, violetas y geranios. Color y fragancia en tu hogar todo el año.',
      light: '14h/día', growth: '30-45 días',
      img: 'aerogarden-mini.webp'
    },
    vegetables: {
      name: 'Vegetales Frescos',
      desc: 'Tomate cherry, pimiento y lechuga. Huerto en miniatura para ensaladas frescas.',
      light: '18h/día', growth: '45-60 días',
      img: 'aerogarden-mini.webp'
    },
    microgreens: {
      name: 'Microgreens',
      desc: 'Brotes nutritivos de alfalfa, brócoli y rábano. Superalimentos en 7-14 días.',
      light: '12h/día', growth: '7-14 días',
      img: 'aerogarden-mini.webp'
    }
  };

  plantTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      plantTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const data = plantsData[tab.dataset.plant];
      if (data && plantName) {
        plantName.textContent = data.name;
        plantDesc.textContent = data.desc;
        plantLight.textContent = data.light;
        plantGrowth.textContent = data.growth;
      }
    });
  });

  // ============ FAQ ============
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ============ COUNTDOWN ============
  const countdownDisplay = document.querySelector('.countdown-display');
  if (countdownDisplay) {
    const days = parseInt(countdownDisplay.dataset.days) || 7;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    function updateCountdown() {
      const now = new Date();
      const diff = endDate - now;
      if (diff <= 0) {
        ['dias','horas','minutos','segundos'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = '00';
        });
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      const dias = document.getElementById('dias');
      const horas = document.getElementById('horas');
      const minutos = document.getElementById('minutos');
      const segundos = document.getElementById('segundos');
      if (dias) dias.textContent = String(d).padStart(2, '0');
      if (horas) horas.textContent = String(h).padStart(2, '0');
      if (minutos) minutos.textContent = String(m).padStart(2, '0');
      if (segundos) segundos.textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ============ REVEAL ON SCROLL ============
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ============ MOBILE STICKY CTA ============
  const sticky = document.querySelector('.mobile-sticky');
  if (sticky) {
    window.addEventListener('scroll', () => {
      sticky.style.transform = window.scrollY > 600 ? 'translateY(0)' : 'translateY(100%)';
    }, { passive: true });
  }

  // ============ SCROLL TO TOP ============
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============ HERO GLOW MOUSE TRACKING ============
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      heroGlow.style.right = (10 + (x - 0.5) * 15) + '%';
      heroGlow.style.top = (30 + (y - 0.5) * 15) + '%';
    });
  }

  // ============ DASHBOARD FLOATING BAR ANIMATION ============
  const floatingBar = document.querySelector('.floating-bar-fill');
  if (floatingBar) {
    setTimeout(() => { floatingBar.style.width = '68%'; }, 800);
  }

});
