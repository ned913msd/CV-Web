/* ================================================================
   ZENMAT — Premium Wellness Script
   Session configurator, countdown, scroll reveal, mobile menu
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

  // ============ SESSION CONFIGURATOR ============
  const tabs = document.querySelectorAll('.session-tab');
  const sessionName = document.getElementById('sessionName');
  const sessionDesc = document.getElementById('sessionDesc');
  const sessionDur = document.getElementById('sessionDur');
  const sessionPuntos = document.getElementById('sessionPuntos');
  const sessionIntensidad = document.getElementById('sessionIntensidad');
  const sessionEmoji = document.getElementById('sessionEmoji');
  const breathRing = document.querySelector('.session-breath-ring');

  const sessions = {
    relajacion: {
      name: 'Relajación Profunda',
      desc: 'Libera tensión acumulada con patrones rítmicos suaves y respiración guiada 4-7-8. Ideal para terminar el día con calma.',
      dur: '15 min', puntos: '8820', intensidad: 'Suave',
      emoji: '🧘', animDuration: '6s'
    },
    energia: {
      name: 'Energía y Vitalidad',
      desc: 'Activa tu sistema con estimulación dinámica y respiración holotrópica. Perfecta para empezar la mañana con fuerza.',
      dur: '15 min', puntos: '8820', intensidad: 'Media',
      emoji: '☀️', animDuration: '3s'
    },
    sueno: {
      name: 'Sueño Reparador',
      desc: 'Prepara tu cuerpo para un descanso profundo con frecuencias bajas y meditación guiada de relajación progresiva.',
      dur: '20 min', puntos: '8820', intensidad: 'Muy suave',
      emoji: '🌙', animDuration: '8s'
    },
    meditacion: {
      name: 'Meditación Activa',
      desc: 'Enfoca tu mente con puntos de anclaje y respiración cuadrada. Desarrolla presencia y claridad mental.',
      dur: '10 min', puntos: '8820', intensidad: 'Moderada',
      emoji: '🧘‍♂️', animDuration: '5s'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.session;
      const s = sessions[key];
      if (sessionName) sessionName.textContent = s.name;
      if (sessionDesc) sessionDesc.textContent = s.desc;
      if (sessionDur) sessionDur.textContent = s.dur;
      if (sessionPuntos) sessionPuntos.textContent = s.puntos;
      if (sessionIntensidad) sessionIntensidad.textContent = s.intensidad;
      if (sessionEmoji) sessionEmoji.textContent = s.emoji;
      if (breathRing) breathRing.style.animationDuration = s.animDuration;
    });
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

  // ============ PARALLAX SUBTLE ============
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length) {
    window.addEventListener('scroll', () => {
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        if (visible) {
          const offset = (rect.top - window.innerHeight / 2) * speed;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
    }, { passive: true });
  }

});