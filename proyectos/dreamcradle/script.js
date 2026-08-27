/* ================================================================
   DREAMCRADLE — Smart Baby Cradle Script
   FAQ, Countdown, Scroll Reveal, Number Counters, Stars
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

  // ============ GENERATE STARS ============
  const starsContainers = document.querySelectorAll('.stars');
  starsContainers.forEach(container => {
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${1 + Math.random() * 3}px;
        height: ${1 + Math.random() * 3}px;
        animation-duration: ${2 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(star);
    }
  });

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
        const isDecimal = target % 1 !== 0;

        function animate(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          el.textContent = prefix + (isDecimal ? current.toFixed(0) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(el => counterObserver.observe(el));

  // ============ NOISE BARS ANIMATION ============
  const noiseBars = document.querySelectorAll('.noise-bar-fill');
  const noiseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        setTimeout(() => { fill.style.width = width; }, 200);
        noiseObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  noiseBars.forEach(bar => {
    bar.style.width = '0%';
    noiseObserver.observe(bar);
  });

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

  // ============ MOBILE STICKY CTA ============
  const sticky = document.querySelector('.mobile-sticky');
  if (sticky) {
    window.addEventListener('scroll', () => {
      sticky.style.transform = window.scrollY > 600 ? 'translateY(0)' : 'translateY(100%)';
    }, { passive: true });
  }

});