/* ================================================================
   PAWPALACE — Premium Pet Wellness Experience
   Standalone warm/emotional JavaScript
   Features: Temperature Configurator, Size Selector, FAQ, Countdown, Reveal
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

  // ============ TEMPERATURE CONFIGURATOR ============
  const tempPresets = document.querySelectorAll('.temp-preset');
  const tempValue = document.querySelector('.temp-value');
  const tempLabel = document.querySelector('.temp-label');
  const tempDesc = document.querySelector('.temp-desc');
  const tempGlow = document.querySelector('.temp-glow');
  const tempSliderThumb = document.querySelector('.temp-slider-thumb');

  const tempData = {
    22: { label: 'FRESCA', desc: 'Para días cálidos', color: '#A9C7B0', glowColor: 'rgba(169,199,176,0.3)' },
    30: { label: 'TIBIA', desc: 'Para el descanso diario', color: '#F4C928', glowColor: 'rgba(244,201,40,0.3)' },
    37: { label: 'CÁLIDA', desc: 'Para noches frías', color: '#E89A83', glowColor: 'rgba(232,154,131,0.3)' }
  };

  let currentTemp = 30;

  const updateTemperature = (temp) => {
    currentTemp = temp;
    const data = tempData[temp];
    if (!data) return;

    tempValue.textContent = temp + '°C';
    tempLabel.textContent = data.label;
    tempDesc.textContent = data.desc;
    tempValue.style.color = data.color;

    if (tempGlow) {
      tempGlow.style.background = `radial-gradient(circle, ${data.glowColor}, transparent 70%)`;
    }

    if (tempSliderThumb) {
      const percent = ((temp - 20) / 20) * 100;
      tempSliderThumb.style.left = percent + '%';
    }

    tempPresets.forEach(p => {
      p.classList.remove('active');
      if (parseInt(p.dataset.temp) === temp) {
        p.classList.add('active');
      }
    });
  };

  tempPresets.forEach(preset => {
    preset.addEventListener('click', () => {
      const temp = parseInt(preset.dataset.temp);
      updateTemperature(temp);
    });
  });

  // Slider interaction
  const tempSlider = document.querySelector('.temp-slider');
  if (tempSlider && tempSliderThumb) {
    let isDragging = false;

    const updateFromSlider = (e) => {
      const rect = tempSlider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let percent = (clientX - rect.left) / rect.width;
      percent = Math.max(0, Math.min(1, percent));
      const temp = Math.round(20 + percent * 20);

      if (tempData[temp]) {
        updateTemperature(temp);
      }
    };

    tempSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateFromSlider(e);
    });

    tempSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateFromSlider(e);
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateFromSlider(e);
    });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) updateFromSlider(e);
    }, { passive: true });

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });
  }

  // Initialize temperature
  updateTemperature(30);

  // ============ SIZE SELECTOR ============
  const sizeCards = document.querySelectorAll('.size-card');

  sizeCards.forEach(card => {
    card.addEventListener('click', () => {
      sizeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
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
    const days = parseInt(countdownEl.dataset.days) || 5;
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

  // ============ PARALLAX EFFECT ============
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    }, { passive: true });
  }

  // ============ APP UI TEMPERATURE SYNC ============
  const appTempVal = document.querySelector('.app-ui-temp-val');
  const appTempStatus = document.querySelector('.app-ui-temp-status');

  if (appTempVal && appTempStatus) {
    const updateAppUI = () => {
      appTempVal.textContent = currentTemp + '°C';
      const data = tempData[currentTemp];
      if (data) {
        appTempStatus.textContent = data.label;
      }
    };

    // Sync app UI with temperature changes
    const originalUpdate = updateTemperature;
    const patchedUpdate = (temp) => {
      originalUpdate(temp);
      updateAppUI();
    };

    tempPresets.forEach(preset => {
      preset.removeEventListener('click', preset._handler);
      preset._handler = () => {
        const temp = parseInt(preset.dataset.temp);
        patchedUpdate(temp);
      };
      preset.addEventListener('click', preset._handler);
    });
  }
});