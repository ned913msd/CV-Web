/* ================================================================
   ZENMAT — Premium Acupressure Mat Script
   Standalone: FAQ, Session Configurator, Countdown, Reveal, etc.
=============================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============ SCROLL PROGRESS ============
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    });
  }

  // ============ HEADER SCROLL ============
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
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

  // ============ HERO GLOW ============
  const heroGlow = document.getElementById('heroGlow');
  if (heroGlow) {
    document.addEventListener('mousemove', e => {
      const rect = heroGlow.parentElement.getBoundingClientRect();
      heroGlow.style.left = ((e.clientX - rect.left) / rect.width * 100) + '%';
      heroGlow.style.top = ((e.clientY - rect.top) / rect.height * 100) + '%';
    });
  }

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ============ SESSION CONFIGURATOR ============
  const tabs = document.querySelectorAll('.session-tab');
  const sessionName = document.getElementById('sessionName');
  const sessionDesc = document.getElementById('sessionDesc');
  const sessionDur = document.getElementById('sessionDur');
  const sessionPuntos = document.getElementById('sessionPuntos');
  const sessionIntensidad = document.getElementById('sessionIntensidad');
  const sessionGlow = document.querySelector('.session-glow');

  const sessions = {
    relajacion: {
      name: 'Relajación Profunda',
      desc: 'Libera tensión acumulada con patrones rítmicos suaves y respiración guiada de 4-7-8.',
      dur: '15 min', puntos: '8820', intensidad: 'Suave',
      color: '#10b981', colorRGB: '16,185,129'
    },
    energia: {
      name: 'Energía y Vitalidad',
      desc: 'Activa tu sistema con estimulación dinámica y respiración holotrópica.',
      dur: '10 min', puntos: '8820', intensidad: 'Media',
      color: '#f59e0b', colorRGB: '245,158,11'
    },
    sueno: {
      name: 'Sueño Reparador',
      desc: 'Prepara tu cuerpo para un descanso profundo con frecuencias bajas y meditación.',
      dur: '20 min', puntos: '8820', intensidad: 'Muy suave',
      color: '#6366f1', colorRGB: '99,102,241'
    },
    meditacion: {
      name: 'Meditación Activa',
      desc: 'Enfoca tu mente con puntos de anclaje y respiración cuadrada.',
      dur: '15 min', puntos: '8820', intensidad: 'Moderada',
      color: '#06b6d4', colorRGB: '6,182,212'
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
      if (sessionGlow) sessionGlow.style.background = `radial-gradient(circle, rgba(${s.colorRGB},0.15), transparent 70%)`;
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
    });
  }

});