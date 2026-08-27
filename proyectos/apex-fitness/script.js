/* ================================================================
   APEX FITNESS — Premium Gym Script
   Particles, Parallax, Counters, Schedule, Form Steps,
   Testimonial Carousel, FAQ, Transformations Slider, Reveal
=============================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============ SCROLL PROGRESS ============
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      progressBar.style.width = pct + '%';
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
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('abierto'));
    });
  }

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(anchor.getAttribute('href'));
      if (t) {
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // ============ PARTICLES ============
  const pc = document.querySelector('.particles');
  if (pc) {
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${8 + Math.random() * 14}s;
        animation-delay: ${Math.random() * 10}s;
        width: ${1 + Math.random() * 2.5}px;
        height: ${1 + Math.random() * 2.5}px;
      `;
      pc.appendChild(p);
    }
  }

  // ============ PARALLAX HERO GLOW ============
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroGlow.style.transform = `translate(${y * 0.02}px, ${y * 0.05}px)`;
    }, { passive: true });
  }

  // ============ COUNTERS ============
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 2000;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ============ SCHEDULE FILTER ============
  const scheduleFilters = document.querySelectorAll('.schedule-filter');
  const scheduleRows = document.querySelectorAll('.schedule-row');
  if (scheduleFilters.length && scheduleRows.length) {
    scheduleFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        scheduleFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const day = btn.dataset.day;
        scheduleRows.forEach(row => {
          if (day === 'all' || row.dataset.day === day) {
            row.style.display = '';
            row.style.animation = 'fadeIn 0.3s ease forwards';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  // ============ PRICING TOGGLE ============
  const toggleBtns = document.querySelectorAll('.pricing-toggle-btn');
  const monthlyPrices = document.querySelectorAll('[data-monthly]');
  const annualPrices = document.querySelectorAll('[data-annual]');
  if (toggleBtns.length) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const isAnnual = btn.dataset.period === 'annual';
        monthlyPrices.forEach(el => {
          el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
        });
      });
    });
  }

  // ============ TESTIMONIAL CAROUSEL ============
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (slides.length) {
    let current = 0;
    let autoPlay;
    const show = (idx) => {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
      current = idx;
    };
    const next = () => show((current + 1) % slides.length);
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); resetAuto(); }));
    const resetAuto = () => { clearInterval(autoPlay); autoPlay = setInterval(next, 5000); };
    resetAuto();
  }

  // ============ TRANSFORMATION SLIDER ============
  document.querySelectorAll('.transform-slider').forEach(slider => {
    const handle = slider.querySelector('.transform-handle');
    const before = slider.querySelector('.transform-before');
    if (!handle || !before) return;
    let dragging = false;
    const update = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      handle.style.left = pct + '%';
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    };
    slider.addEventListener('mousedown', (e) => { dragging = true; update(e.clientX); });
    slider.addEventListener('touchstart', (e) => { dragging = true; update(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove', (e) => { if (dragging) update(e.clientX); });
    window.addEventListener('touchmove', (e) => { if (dragging) update(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('touchend', () => dragging = false);
  });

  // ============ MEMBERSHIP FORM STEPS ============
  const formSteps = document.querySelectorAll('.form-step');
  const stepDots = document.querySelectorAll('.form-step-dot');
  const nextBtns = document.querySelectorAll('.form-next');
  const prevBtns = document.querySelectorAll('.form-prev');
  const formEl = document.querySelector('#membershipForm');
  let currentStep = 0;

  const showStep = (idx) => {
    formSteps.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    stepDots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i === idx) d.classList.add('active');
      else if (i < idx) d.classList.add('done');
    });
    currentStep = idx;
  };

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < formSteps.length - 1) showStep(currentStep + 1);
    });
  });
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  // Plan card selection
  document.querySelectorAll('.form-plan-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.form-plan-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const plan = card.dataset.plan;
      const price = card.dataset.price;
      const summaryPlan = document.querySelector('#summaryPlan');
      const summaryPrice = document.querySelector('#summaryPrice');
      if (summaryPlan) summaryPlan.textContent = plan;
      if (summaryPrice) summaryPrice.textContent = '$' + price + ' / mes';
      // Update hidden field
      const hiddenPlan = document.querySelector('input[name="selected_plan"]');
      const hiddenPrice = document.querySelector('input[name="plan_price"]');
      if (hiddenPlan) hiddenPlan.value = plan;
      if (hiddenPrice) hiddenPrice.value = price;
    });
  });

  // Form submission via Web3Forms
  if (formEl) {
    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(formEl);
      formData.append('subject', `Nueva membresía APEX - ${formData.get('full_name')} - ${formData.get('selected_plan')}`);
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          document.querySelector('.form-steps').style.display = 'none';
          document.querySelector('.form-steps-indicator').style.display = 'none';
          document.querySelector('.form-success').style.display = 'block';
        }
      } catch (err) {
        console.error('Error:', err);
      }
    });
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

  // ============ HIGHLIGHT TODAY IN SCHEDULE ============
  const dayNames = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
  const today = dayNames[new Date().getDay()];
  const todayFilter = document.querySelector(`.schedule-filter[data-day="${today}"]`);
  if (todayFilter) {
    scheduleFilters.forEach(b => b.classList.remove('active'));
    todayFilter.classList.add('active');
    scheduleRows.forEach(row => {
      row.style.display = row.dataset.day === today ? '' : 'none';
    });
  }

});
