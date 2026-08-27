/* ================================================================
   VOLTPACK — Cyberpunk Tech Showcase Script
   Particles, Charging Configurator, Battery Animation, FAQ, Countdown
=============================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============ PARTICLES ============
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    const colors = ['#00F5FF', '#FF00FF', '#39FF14', '#9D00FF'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${color};
        box-shadow: 0 0 6px ${color};
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        animation-duration: ${8 + Math.random() * 12}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      particlesContainer.appendChild(p);
    }
  }

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

  // ============ CHARGING MODE CONFIGURATOR ============
  const chargeTabs = document.querySelectorAll('.session-tab');
  const chargeName = document.getElementById('chargeName');
  const chargeDesc = document.getElementById('chargeDesc');
  const chargePower = document.getElementById('chargePower');
  const chargeTime = document.getElementById('chargeTime');
  const chargeFeature = document.getElementById('chargeFeature');
  const chargeEmoji = document.getElementById('chargeEmoji');

  const modes = {
    solar: {
      name: 'Solar Mode',
      desc: 'Pure energy from the sun. Zero cost, zero emissions. Just place your pack in sunlight and let the 10W monocrystalline panel do the rest.',
      power: '10W Output', time: '6-8h Full', feature: 'Eco-Friendly',
      emoji: '☀️'
    },
    fast: {
      name: 'Fast Charge Mode',
      desc: '18W USB-C rapid charging when you need power NOW. From 0 to 50% in just 30 minutes with smart device detection.',
      power: '18W USB-C', time: '30min 0-50%', feature: 'Smart Detection',
      emoji: '⚡'
    },
    hybrid: {
      name: 'Hybrid Mode',
      desc: 'Solar + battery combined for maximum efficiency. Adaptive charging algorithm extends battery life while keeping you powered.',
      power: 'Max Output', time: 'Adaptive', feature: 'Extended Life',
      emoji: '🔄'
    },
    eco: {
      name: 'Eco Mode',
      desc: 'Maximum battery conservation for when you need to stretch every last drop. Smart sleep mode keeps essentials alive for days.',
      power: 'Low Draw', time: '72h Standby', feature: 'Smart Sleep',
      emoji: '🌿'
    }
  };

  chargeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      chargeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.mode;
      const m = modes[key];
      if (chargeName) chargeName.textContent = m.name;
      if (chargeDesc) chargeDesc.textContent = m.desc;
      if (chargePower) chargePower.textContent = m.power;
      if (chargeTime) chargeTime.textContent = m.time;
      if (chargeFeature) chargeFeature.textContent = m.feature;
      if (chargeEmoji) chargeEmoji.textContent = m.emoji;
    });
  });

  // ============ BATTERY ANIMATION ============
  const batteryFill = document.querySelector('.battery-fill');
  const batteryPercent = document.getElementById('batteryPercent');
  if (batteryFill) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          batteryFill.classList.add('animate');
          if (batteryPercent) {
            let current = 0;
            const target = 100;
            const duration = 2000;
            const startTime = performance.now();
            function animatePercent(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              current = Math.floor(eased * target);
              batteryPercent.textContent = current + '%';
              if (progress < 1) requestAnimationFrame(animatePercent);
            }
            requestAnimationFrame(animatePercent);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(batteryFill.closest('.battery-visual'));
  }

  // ============ COUNTDOWN ============
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const daysEl = document.getElementById('dias');
    const hoursEl = document.getElementById('horas');
    const minsEl = document.getElementById('minutos');
    const secsEl = document.getElementById('segundos');
    const days = parseInt(countdownEl.dataset.days) || 6;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    function updateCountdown() {
      const now = new Date();
      const diff = endDate - now;
      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      daysEl.textContent = String(d).padStart(2, '0');
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

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

  // ============ REVEAL ON SCROLL ============
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));

  // ============ SCROLL TO TOP ============
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============ MOBILE STICKY CTA ============
  const sticky = document.querySelector('.mobile-sticky');
  if (sticky) {
    window.addEventListener('scroll', () => {
      sticky.style.transform = window.scrollY > 600 ? 'translateY(0)' : 'translateY(100%)';
    }, { passive: true });
  }

  // ============ GLITCH ON LOAD ============
  const glitchEls = document.querySelectorAll('.glitch');
  glitchEls.forEach(el => {
    el.style.animation = 'none';
    setTimeout(() => { el.style.animation = ''; }, 100);
  });

});