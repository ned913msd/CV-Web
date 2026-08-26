/* ================================================================
   FLEXBAND X — Sports Performance Technology
   Standalone premium sports tech JavaScript
   Features: Particles, Count-up, App Demo, FAQ, Countdown, Reveal
=============================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ============ HEADER SCROLL ============
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

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

  // ============ PARTICLES ============
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      particle.style.animationDelay = Math.random() * 4 + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
      
      setTimeout(() => particle.remove(), 12000);
    };

    for (let i = 0; i < 30; i++) {
      setTimeout(createParticle, i * 200);
    }
    setInterval(createParticle, 400);
  }

  // ============ COUNT-UP ANIMATION ============
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateStats = () => {
    if (statsAnimated) return;
    
    const statsSection = document.querySelector('.micro-stats');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
      statsAnimated = true;
      
      statNumbers.forEach(el => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          
          el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(update);
          }
        };
        
        requestAnimationFrame(update);
      });
    }
  };

  window.addEventListener('scroll', animateStats, { passive: true });

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

  // ============ TRAINING MODES (CONFIGURATOR) ============
  const modeButtons = document.querySelectorAll('.mode-btn');
  const phoneModes = document.querySelectorAll('.app-ui-mode');

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const mode = btn.dataset.mode;
      phoneModes.forEach(pm => {
        pm.classList.remove('active');
        if (pm.dataset.mode === mode) {
          pm.classList.add('active');
        }
      });
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
  const countdownEl = document.getElementById('countdown');
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
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 400) {
        mobileSticky.style.transform = 'translateY(0)';
      } else {
        mobileSticky.style.transform = 'translateY(100%)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============ PARALLAX EFFECT ============
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

  // ============ HERO GLOW EFFECT ============
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      heroGlow.style.left = (55 + (x - 0.5) * 20) + '%';
      heroGlow.style.top = (50 + (y - 0.5) * 20) + '%';
    });
  }
});