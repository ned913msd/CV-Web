/* ================================================================
   APEX FITNESS — Premium Gym Script
   Particles, Parallax, Counters, Schedule, Form Steps,
   Testimonial Carousel, FAQ, Transformations Slider, Reveal,
   BMI Calculator, Booking Toast, Form Validation
================================================================ */

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
  const header = document.querySelector('.header');
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
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        const t = document.querySelector(href);
        if (t) {
          e.preventDefault();
          const y = t.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // ============ PARTICLES ============
  const pc = document.querySelector('.particles');
  if (pc) {
    for (let i = 0; i < 45; i++) {
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
      if (y < window.innerHeight) heroGlow.style.transform = `translate(${y * 0.02}px, ${y * 0.05}px)`;
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
  const applyScheduleFilter = (day) => {
    scheduleRows.forEach(row => {
      const show = day === 'todos' || row.dataset.day === day;
      row.style.display = show ? '' : 'none';
      if (show) {
        row.style.animation = 'none';
        row.offsetHeight;
        row.style.animation = 'fadeIn 0.3s ease';
      }
    });
  };
  if (scheduleFilters.length && scheduleRows.length) {
    scheduleFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        scheduleFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyScheduleFilter(btn.dataset.day);
      });
    });

    // Auto-highlight current day (only if no manual filter chosen yet)
    const dayNames = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
    const today = dayNames[new Date().getDay()];
    const todayFilter = document.querySelector(`.schedule-filter[data-day="${today}"]`);
    if (todayFilter) {
      scheduleFilters.forEach(b => b.classList.remove('active'));
      todayFilter.classList.add('active');
      applyScheduleFilter(today);
    }
  }

  // ============ CAPACITY BARS + BOOKING ============
  const toast = document.createElement('div');
  toast.className = 'booking-toast';
  document.body.appendChild(toast);
  let toastTimer;

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  };

  scheduleRows.forEach(row => {
    const spotsCell = row.querySelector('[data-spots]');
    if (!spotsCell) return;
    const spots = parseInt(spotsCell.dataset.spots);
    const capacity = parseInt(spotsCell.dataset.capacity) || 20;
    const pct = Math.round((spots / capacity) * 100);
    const fill = spotsCell.querySelector('.spots-fill');
    if (fill) {
      fill.style.width = pct + '%';
      if (pct <= 25) fill.classList.add('low');
      else if (pct <= 60) fill.classList.add('medium');
    }
    const count = spotsCell.querySelector('.spots-count');
    if (count) count.textContent = `${spots}/${capacity} cupos`;
    const bookBtn = row.querySelector('.btn-book');
    if (bookBtn) {
      if (spots === 0) bookBtn.setAttribute('disabled', 'true');
      bookBtn.addEventListener('click', () => {
        if (bookBtn.disabled) return;
        bookBtn.classList.add('booked');
        bookBtn.textContent = '✓ Reservado';
        showToast('Reserva confirmada. Te esperamos en APEX.');
      });
    }
  });

  // ============ PRICING TOGGLE ============
  const toggleBtns = document.querySelectorAll('.pricing-toggle-btn');
  const priceCards = document.querySelectorAll('.price-card');
  if (toggleBtns.length) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const isAnnual = btn.dataset.period === 'annual';
        priceCards.forEach(card => {
          const val = card.querySelector('.price-value');
          const period = card.querySelector('.price-period');
          if (val && period) {
            if (isAnnual) {
              val.textContent = card.dataset.annual;
              period.textContent = '/año';
            } else {
              val.textContent = card.dataset.monthly;
              period.textContent = '/mes';
            }
          }
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
  const stepDots = document.querySelectorAll('.step-dot');
  const formEl = document.querySelector('#membershipForm');
  let currentStep = 0;

  const showStep = (idx) => {
    formSteps.forEach((s, i) => s.classList.toggle('active', i === idx));
    stepDots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i === idx) d.classList.add('active');
      else if (i < idx) d.classList.add('done');
    });
    currentStep = idx;
    const nextBtn = document.querySelector('.form-next');
    const prevBtn = document.querySelector('.form-prev');
    if (nextBtn) nextBtn.style.display = idx === formSteps.length - 1 ? 'none' : '';
    if (prevBtn) prevBtn.style.display = idx === 0 ? 'none' : '';
  };

  const validateStep = (idx) => {
    const stepEl = formSteps[idx];
    let valid = true;
    stepEl.querySelectorAll('input[required], select[required]').forEach(input => {
      input.classList.remove('invalid');
      const group = input.closest('.form-group');
      if (group) group.classList.remove('invalid');
      if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
        valid = false;
        if (group) group.classList.add('invalid');
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        valid = false;
        if (group) group.classList.add('invalid');
      } else if (input.type === 'tel' && input.value.replace(/\D/g, '').length < 7) {
        valid = false;
        if (group) group.classList.add('invalid');
      }
    });
    return valid;
  };

  const nextBtn = document.querySelector('.form-next');
  const prevBtn = document.querySelector('.form-prev');
  const termsCheck = document.querySelector('#terms');

  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      showToast('Por favor completa todos los campos correctamente.');
      return;
    }
    if (currentStep < formSteps.length - 1) showStep(currentStep + 1);
  });
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (currentStep > 0) showStep(currentStep - 1);
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
      const summaryPeriod = document.querySelector('#summaryPeriod');
      if (summaryPlan) summaryPlan.textContent = plan;
      if (summaryPrice) summaryPrice.textContent = price;
      if (summaryPeriod) {
        const activePeriod = document.querySelector('.pricing-toggle-btn.active');
        summaryPeriod.textContent = activePeriod && activePeriod.dataset.period === 'annual' ? 'Anual' : 'Mensual';
      }
      const hiddenPlan = document.querySelector('input[name="selected_plan"]');
      const hiddenPrice = document.querySelector('input[name="plan_price"]');
      if (hiddenPlan) hiddenPlan.value = plan;
      if (hiddenPrice) hiddenPrice.value = price;
    });
  });

  showStep(0);

  // ============ FORM SUBMISSION (Web3Forms) ============
  if (formEl) {
    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep(currentStep) || !termsCheck || !termsCheck.checked) {
        showToast('Por favor completa todos los campos y acepta los términos.');
        return;
      }
      const submitBtn = formEl.querySelector('button[type="submit"]');
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
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
          document.querySelector('.form-nav').style.display = 'none';
          const success = document.querySelector('.form-success');
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          showToast('Ocurrió un error al enviar. Inténtalo de nuevo.');
        }
      } catch (err) {
        console.error('Error:', err);
        showToast('Error de conexión. Inténtalo de nuevo.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
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

  // ============ BMI CALCULATOR ============
  const bmiBtn = document.querySelector('.bmi-calc-btn');
  if (bmiBtn) {
    const calcBMI = () => {
      const hInput = document.querySelector('#bmiHeight');
      const wInput = document.querySelector('#bmiWeight');
      const resultVal = document.querySelector('.bmi-value');
      const resultCat = document.querySelector('.bmi-category');
      const marker = document.querySelector('.bmi-marker');
      const height = parseFloat(hInput.value) / 100;
      const weight = parseFloat(wInput.value);
      if (!height || !weight || height <= 0.5 || height > 2.5 || weight <= 10 || weight > 300) {
        showToast('Ingresa una altura y peso válidos.');
        return;
      }
      const bmi = weight / (height * height);
      const rounded = bmi.toFixed(1);
      let cat, catColor;
      if (bmi < 18.5) { cat = 'Bajo peso'; catColor = '#3B82F6'; }
      else if (bmi < 25) { cat = 'Peso normal'; catColor = '#22C55E'; }
      else if (bmi < 30) { cat = 'Sobrepeso'; catColor = '#F59E0B'; }
      else { cat = 'Obesidad'; catColor = '#DC2626'; }
      if (resultVal) resultVal.textContent = rounded;
      if (resultCat) { resultCat.textContent = cat; resultCat.style.color = catColor; }
      if (marker) {
        const min = 14, max = 40;
        const pct = Math.max(0, Math.min(96, ((bmi - min) / (max - min)) * 96));
        marker.style.marginLeft = `calc(${pct}% - 2px)`;
      }
    };
    bmiBtn.addEventListener('click', calcBMI);
    ['#bmiHeight','#bmiWeight'].forEach(sel => {
      const input = document.querySelector(sel);
      if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); calcBMI(); } });
    });
  }

  // ============ NEWSLETTER ============
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        showToast('¡Gracias por suscribirte!');
        newsletterForm.reset();
      } else {
        showToast('Ingresa un email válido.');
      }
    });
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
    const onScroll = () => {
      const show = window.scrollY > 600 && window.innerWidth <= 768;
      sticky.style.transform = show ? 'translateY(0)' : 'translateY(100%)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

});