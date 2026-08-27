/* ================================================================
   SONICPODS ULTRA — MoonFly Premium Audio Script
   Particles, FAQ, Color Selector, Battery Animation, Scroll Reveal
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
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${10 + Math.random() * 15}s;
        animation-delay: ${Math.random() * 12}s;
        width: ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        opacity: ${0.15 + Math.random() * 0.4};
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ============ COLOR SELECTOR ============
  const colorCards = document.querySelectorAll('.color-card');
  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      colorCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // ============ QUANTITY SELECTOR ============
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus = document.querySelector('.qty-plus');
  const qtyVal = document.querySelector('.qty-val');
  let qty = 1;
  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
      if (qty > 1) { qty--; qtyVal.textContent = qty; }
    });
    qtyPlus.addEventListener('click', () => {
      if (qty < 10) { qty++; qtyVal.textContent = qty; }
    });
  }

  // ============ BATTERY BAR ANIMATION ============
  const batteryFill = document.querySelector('.battery-fill');
  if (batteryFill) {
    const batteryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => { batteryFill.style.width = '100%'; }, 300);
          batteryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    batteryObserver.observe(batteryFill.parentElement);
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
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ============ MOBILE STICKY CTA ============
  const sticky = document.querySelector('.mobile-sticky');
  if (sticky) {
    window.addEventListener('scroll', () => {
      sticky.style.transform = window.scrollY > 600 ? 'translateY(0)' : 'translateY(100%)';
    }, { passive: true });
  }

  // ============ HERO GLOW MOUSE TRACKING ============
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      heroGlow.style.right = (15 + (x - 0.5) * 15) + '%';
      heroGlow.style.top = (35 + (y - 0.5) * 15) + '%';
    });
  }

});
