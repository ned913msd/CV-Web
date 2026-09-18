(function () {
  'use strict';

  /* =============================================
     1. PORTFOLIO DATA
     ============================================= */
  var portfolioData = [
    {
      id: '001',
      title: 'Void Mandala',
      category: 'blackwork',
      style: 'Blackwork',
      placement: 'Chest',
      sessions: '2 sessions / 8h total',
      image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80',
      description: 'A large-scale mandala piece radiating from the sternum. Deep black saturation with negative-space geometry creating a dimensional void effect across the pectorals.',
      concept: 'The mandala represents wholeness and the cyclical nature of existence. The negative space at the center symbolizes the void from which all creation emerges.',
      status: 'Completed'
    },
    {
      id: '002',
      title: 'Serpent Spine',
      category: 'blackwork',
      style: 'Blackwork',
      placement: 'Full Back',
      sessions: '4 sessions / 20h total',
      image: 'https://images.unsplash.com/photo-1590246814883-57f2a1e26767?w=800&q=80',
      description: 'A serpent winding the full length of the spine, rendered in heavy blackwork with scale detail. The tail tapers into geometric fragmentation at the base.',
      concept: 'The serpent as a symbol of transformation and renewal. Placed on the spine to represent the axis mundi — the central column connecting earth and sky.',
      status: 'Completed'
    },
    {
      id: '003',
      title: 'Urban Decay',
      category: 'realism',
      style: 'Realism',
      placement: 'Inner Forearm',
      sessions: '1 session / 4h',
      image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&q=80',
      description: 'Hyper-realistic depiction of crumbling architecture with dramatic light and shadow. The piece captures the beauty found in deterioration and entropy.',
      concept: 'An exploration of impermanence — how even concrete and steel surrender to time. The beauty lies in the process of dissolution.',
      status: 'Completed'
    },
    {
      id: '004',
      title: 'Sacred Geometry',
      category: 'geometric',
      style: 'Geometric',
      placement: 'Shoulder Cap',
      sessions: '2 sessions / 6h total',
      image: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800&q=80',
      description: 'Flower of Life pattern transitioning into Metatron\'s Cube. Clean linework with mathematical precision. Dotwork shading creates depth in the interlocking circles.',
      concept: 'Sacred geometry as the blueprint of creation. The Flower of Life represents the fundamental forms of space and time — the matrix through which all things connect.',
      status: 'Completed'
    },
    {
      id: '005',
      title: 'Ghost Orchid',
      category: 'fineline',
      style: 'Fine Line',
      placement: 'Collarbone',
      sessions: '1 session / 2h',
      image: 'https://images.unsplash.com/photo-1612459284270-27f0ae3e9f8d?w=800&q=80',
      description: 'Delicate botanical illustration of a ghost orchid rendered in ultra-fine single-needle work. Subtle dotwork creates depth in the translucent petals.',
      concept: 'The ghost orchid as a symbol of rarity and resilience — thriving in impossible conditions, invisible to those who don\'t know where to look.',
      status: 'Completed'
    },
    {
      id: '006',
      title: 'Fractal Nebula',
      category: 'custom',
      style: 'Custom / Hybrid',
      placement: 'Upper Arm',
      sessions: '3 sessions / 12h total',
      image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&q=80',
      description: 'A cosmic scene blending geometric frameworks with organic nebula forms. Blackwork structure dissolves into realistic gas clouds and stellar nurseries.',
      concept: 'The tension between order and chaos at the cosmic scale. Where geometry meets the organic, structure meets the infinite.',
      status: 'Completed'
    },
    {
      id: '007',
      title: 'Minimal Portrait',
      category: 'fineline',
      style: 'Fine Line',
      placement: 'Inner Bicep',
      sessions: '1 session / 1.5h',
      image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80',
      description: 'Single-line portrait study capturing essence with minimal strokes. The face emerges from continuous linework without lifting the needle.',
      concept: 'Exploring how little information the eye needs to construct a face. The minimum viable portrait — every line essential.',
      status: 'Completed'
    },
    {
      id: '008',
      title: 'Blackout Sleeve',
      category: 'blackwork',
      style: 'Blackwork',
      placement: 'Full Sleeve',
      sessions: '5 sessions / 25h total',
      image: 'https://images.unsplash.com/photo-1590246814883-57f2a1e26767?w=800&q=80',
      description: 'Full blackout sleeve with negative-space channeling. The solid black field is interrupted by precise geometric voids revealing skin beneath.',
      concept: 'The blackout as the ultimate commitment to darkness. The negative space channels act as light breaking through — hope within the void.',
      status: 'Completed'
    },
    {
      id: '009',
      title: 'Clockwork Heart',
      category: 'realism',
      style: 'Realism',
      placement: 'Sternum',
      sessions: '2 sessions / 6h total',
      image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&q=80',
      description: 'Hyper-realistic mechanical heart with exposed gears, valves, and pistons. Every component rendered in meticulous detail with dramatic chiaroscuro.',
      concept: 'The heart as a machine — both fragile and relentless. We are all running on mechanical processes we never chose.',
      status: 'Completed'
    },
    {
      id: '010',
      title: 'Tessellation Wave',
      category: 'geometric',
      style: 'Geometric',
      placement: 'Outer Thigh',
      sessions: '2 sessions / 7h total',
      image: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800&q=80',
      description: 'M.C. Escher-inspired tessellation of interlocking forms morphing from geometric precision to organic fluidity across the piece.',
      concept: 'The boundary between order and chaos is not a line but a gradient. Every rigid structure contains the seed of its own dissolution.',
      status: 'Completed'
    },
    {
      id: '011',
      title: 'Botanical Archive',
      category: 'fineline',
      style: 'Fine Line',
      placement: 'Ribcage',
      sessions: '2 sessions / 5h total',
      image: 'https://images.unsplash.com/photo-1612459284270-27f0ae3e9f8d?w=800&q=80',
      description: 'Scientific illustration style botanical study — three specimens arranged as if from a Victorian naturalist\'s field journal. Cross-hatching and stipple shading.',
      concept: 'A tribute to the era of discovery, when drawing was the only way to document the unknown. Each petal cataloged, each leaf named.',
      status: 'Completed'
    },
    {
      id: '012',
      title: 'Dark Surrealism',
      category: 'custom',
      style: 'Custom / Hybrid',
      placement: 'Full Back',
      sessions: '6 sessions / 30h total',
      image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&q=80',
      description: 'A surrealist composition blending realism, blackwork, and geometric fragmentation. A figure dissolves into abstract forms — the body becoming architecture.',
      concept: 'The self as construction and demolition simultaneously. We are always becoming and unbecoming — never one fixed thing.',
      status: 'In Progress'
    }
  ];

  /* =============================================
     2. DOM REFERENCES
     ============================================= */
  var loader = document.getElementById('loader');
  var loaderFill = document.getElementById('loader-fill');
  var loaderPercent = document.getElementById('loader-percent');
  var navbar = document.getElementById('navbar');
  var navLinks = document.getElementById('nav-links');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var portfolioGrid = document.getElementById('portfolio-grid');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var modal = document.getElementById('modal');
  var modalOverlay = document.getElementById('modal-overlay');
  var modalClose = document.getElementById('modal-close');
  var modalImg = document.getElementById('modal-img');
  var modalId = document.getElementById('modal-id');
  var modalTitle = document.getElementById('modal-title');
  var modalStyle = document.getElementById('modal-style');
  var modalConcept = document.getElementById('modal-concept');
  var modalPlacement = document.getElementById('modal-placement');
  var modalSession = document.getElementById('modal-session');
  var modalStatus = document.getElementById('modal-status');
  var modalDesc = document.getElementById('modal-desc');
  var modalCta = document.getElementById('modal-cta');
  var modalPrev = document.getElementById('modal-prev');
  var modalNext = document.getElementById('modal-next');
  var testPrev = document.getElementById('test-prev');
  var testNext = document.getElementById('test-next');
  var testCounter = document.getElementById('test-counter');
  var bookForm = document.getElementById('book-form');
  var bookSubmit = document.getElementById('book-submit');
  var bookMsg = document.getElementById('book-msg');
  var cursor = document.getElementById('cursor');
  var cursorLabel = document.getElementById('cursor-label');

  var currentFilter = 'all';
  var currentModalIndex = -1;
  var filteredItems = portfolioData.slice();
  var currentTestimonial = 0;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =============================================
     3. LOADER
     ============================================= */
  function initLoader() {
    if (prefersReducedMotion) {
      loader.classList.add('hidden');
      return;
    }

    var progress = 0;
    var duration = 1500;
    var interval = 30;
    var steps = duration / interval;
    var increment = 100 / steps;

    var timer = setInterval(function () {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(function () {
          loader.classList.add('hidden');
        }, 300);
      }
      loaderFill.style.width = progress + '%';
      loaderPercent.textContent = String(Math.floor(progress)).padStart(3, '0') + '%';
    }, interval);
  }

  /* =============================================
     4. NAVBAR — SCROLL STATE + ACTIVE LINK
     ============================================= */
  function initNavbar() {
    var sections = document.querySelectorAll('section[id]');
    var navHeight = navbar.offsetHeight;

    function onScroll() {
      var scrollY = window.scrollY;

      if (scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      var activeId = '';
      sections.forEach(function (section) {
        var top = section.offsetTop - navHeight - 200;
        if (scrollY >= top) {
          activeId = section.getAttribute('id');
        }
      });

      var links = navLinks.querySelectorAll('.nav-link');
      links.forEach(function (link) {
        var href = link.getAttribute('href').replace('#', '');
        if (href === activeId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* =============================================
     5. MOBILE MENU
     ============================================= */
  function initMobileMenu() {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    var mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });
  }

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* =============================================
     6. PORTFOLIO RENDERING
     ============================================= */
  function renderPortfolio() {
    portfolioGrid.innerHTML = '';
    filteredItems.forEach(function (item, index) {
      var el = document.createElement('div');
      el.className = 'portfolio-item';
      el.setAttribute('data-category', item.category);
      el.setAttribute('data-index', index);
      el.setAttribute('data-cursor', 'EXPLORE');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'View ' + item.title);

      el.innerHTML =
        '<div class="portfolio-item-image">' +
          '<img src="' + item.image + '" alt="' + item.title + ' — ' + item.style + '" loading="lazy">' +
        '</div>' +
        '<div class="portfolio-item-overlay">' +
          '<span class="portfolio-item-tag">' + item.style.toUpperCase() + '</span>' +
          '<h3 class="portfolio-item-title">' + item.title + '</h3>' +
          '<span class="portfolio-item-meta">PIECE ' + item.id + ' / ' + item.category.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="portfolio-item-corner">+</div>';

      el.addEventListener('click', function () {
        openModal(index);
      });

      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(index);
        }
      });

      portfolioGrid.appendChild(el);
    });
  }

  /* =============================================
     7. PORTFOLIO FILTERS
     ============================================= */
  function initFilters() {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        setActiveFilter(filter);
      });
    });
  }

  function setActiveFilter(filter) {
    currentFilter = filter;

    filterBtns.forEach(function (btn) {
      var isActive = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (filter === 'all') {
      filteredItems = portfolioData.slice();
    } else {
      filteredItems = portfolioData.filter(function (item) {
        return item.category === filter;
      });
    }

    var items = portfolioGrid.querySelectorAll('.portfolio-item');
    items.forEach(function (item, i) {
      var category = item.getAttribute('data-category');
      var shouldShow = filter === 'all' || category === filter;

      if (prefersReducedMotion) {
        item.style.display = shouldShow ? '' : 'none';
      } else {
        if (shouldShow) {
          item.style.opacity = '0';
          item.style.display = '';
          setTimeout(function () {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.4s ease';
          }, i * 50);
        } else {
          item.style.opacity = '0';
          setTimeout(function () {
            item.style.display = 'none';
          }, 300);
        }
      }
    });

    renderPortfolio();
  }

  /* =============================================
     8. PORTFOLIO MODAL
     ============================================= */
  function openModal(index) {
    currentModalIndex = index;
    var item = filteredItems[index];
    if (!item) return;

    modalImg.src = item.image;
    modalImg.alt = item.title + ' — ' + item.style;
    modalId.textContent = 'PIECE ' + item.id;
    modalTitle.textContent = item.title;
    modalStyle.textContent = item.style.toUpperCase();
    modalConcept.textContent = item.concept;
    modalPlacement.textContent = item.placement;
    modalSession.textContent = item.sessions;
    modalStatus.textContent = item.status;
    modalDesc.textContent = item.description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalIndex = -1;
  }

  function navigateModal(direction) {
    var newIndex = currentModalIndex + direction;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;
    openModal(newIndex);
  }

  function initModal() {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', function () { navigateModal(-1); });
    modalNext.addEventListener('click', function () { navigateModal(1); });
    modalCta.addEventListener('click', function () { closeModal(); });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    });
  }

  /* =============================================
     9. CUSTOM CURSOR
     ============================================= */
  function initCursor() {
    if (!cursor) return;

    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isTouchDevice || !hasFinePointer) {
      cursor.style.display = 'none';
      return;
    }

    cursor.classList.add('custom-cursor');

    var mouseX = 0;
    var mouseY = 0;
    var cursorX = 0;
    var cursorY = 0;
    var currentLabel = '';
    var lerpFactor = 0.15;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onMouseDown() {
      cursor.classList.add('clicking');
    }

    function onMouseUp() {
      cursor.classList.remove('clicking');
    }

    function updateCursor() {
      cursorX = lerp(cursorX, mouseX, lerpFactor);
      cursorY = lerp(cursorY, mouseY, lerpFactor);
      cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';

      if (!prefersReducedMotion) {
        requestAnimationFrame(updateCursor);
      }
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    if (!prefersReducedMotion) {
      requestAnimationFrame(updateCursor);
    }

    var hoverTargets = document.querySelectorAll('a, button, .portfolio-item, [data-cursor]');

    hoverTargets.forEach(function (target) {
      target.addEventListener('mouseenter', function () {
        cursor.classList.add('hovering');
        var label = target.getAttribute('data-cursor') || '';

        if (target.matches('.portfolio-item')) {
          label = 'VIEW';
        } else if (target.matches('.btn-book, .nav-cta, .modal-cta, .btn-submit, .mobile-cta, .footer-cta, .whatsapp-float')) {
          label = 'BOOK';
        } else if (target.matches('.style-card')) {
          label = 'EXPLORE';
        }

        if (label) {
          cursorLabel.textContent = label;
          currentLabel = label;
        }
      });

      target.addEventListener('mouseleave', function () {
        cursor.classList.remove('hovering');
        cursorLabel.textContent = '';
        currentLabel = '';
      });
    });
  }

  /* =============================================
     10. TESTIMONIALS SLIDER
     ============================================= */
  function initTestimonials() {
    var testimonials = document.querySelectorAll('.testimonial');
    var total = testimonials.length;

    function showTestimonial(index) {
      testimonials.forEach(function (t) { t.classList.remove('active'); });
      testimonials[index].classList.add('active');
      currentTestimonial = index;

      var num = String(index + 1).padStart(2, '0');
      var tot = String(total).padStart(2, '0');
      testCounter.textContent = num + ' / ' + tot;
    }

    testPrev.addEventListener('click', function () {
      var newIndex = currentTestimonial - 1;
      if (newIndex < 0) newIndex = total - 1;
      showTestimonial(newIndex);
    });

    testNext.addEventListener('click', function () {
      var newIndex = currentTestimonial + 1;
      if (newIndex >= total) newIndex = 0;
      showTestimonial(newIndex);
    });

    showTestimonial(0);
  }

  /* =============================================
     11. FAQ ACCORDION
     ============================================= */
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var answer = item.querySelector('.faq-a');

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('active');

        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('active');
            other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            other.querySelector('.faq-a').style.maxHeight = '0';
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* =============================================
     12. BOOKING FORM
     ============================================= */
  function initBookingForm() {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('book-name');
      var contactInput = document.getElementById('book-contact');
      var name = nameInput.value.trim();
      var contact = contactInput.value.trim();
      var valid = true;

      var nameError = nameInput.closest('.form-group').querySelector('.form-error');
      var contactError = contactInput.closest('.form-group').querySelector('.form-error');

      if (name.length < 2) {
        nameInput.classList.add('error');
        if (nameError) nameError.style.display = 'block';
        valid = false;
      } else {
        nameInput.classList.remove('error');
        if (nameError) nameError.style.display = 'none';
      }

      if (contact.length < 5) {
        contactInput.classList.add('error');
        if (contactError) contactError.style.display = 'block';
        valid = false;
      } else {
        contactInput.classList.remove('error');
        if (contactError) contactError.style.display = 'none';
      }

      if (!valid) return;

      var btnText = bookSubmit.querySelector('.btn-text');
      var btnLoading = bookSubmit.querySelector('.btn-loading');

      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
      bookSubmit.disabled = true;

      var formData = new FormData(bookForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            bookMsg.textContent = 'Request sent successfully. We\'ll get back to you soon.';
            bookMsg.className = 'form-msg form-msg--success';
            bookForm.reset();
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          bookMsg.textContent = 'Something went wrong. Please try again or contact us via WhatsApp.';
          bookMsg.className = 'form-msg form-msg--error';
        })
        .finally(function () {
          btnText.style.display = 'inline';
          btnLoading.style.display = 'none';
          bookSubmit.disabled = false;
        });
    });
  }

  /* =============================================
     13. SCROLL REVEAL
     ============================================= */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      var els = document.querySelectorAll('[data-reveal]');
      els.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var revealElements = document.querySelectorAll('[data-reveal]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-reveal-delay') || 0;
          setTimeout(function () {
            entry.target.classList.add('revealed');
          }, Number(delay) * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* =============================================
     14. SMOOTH SCROLLING
     ============================================= */
  function initSmoothScroll() {
    var navHeight = navbar.offsetHeight;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  /* =============================================
     15. STYLE LINKS — FILTER PORTFOLIO
     ============================================= */
  function initStyleLinks() {
    document.querySelectorAll('[data-filter-target]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var filter = link.getAttribute('data-filter-target');
        setActiveFilter(filter);

        var workSection = document.getElementById('work');
        if (workSection) {
          var navHeight = navbar.offsetHeight;
          var offsetTop = workSection.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      });
    });
  }

  /* =============================================
     16. WHATSAPP CLICK TRACKING
     ============================================= */
  function initWhatsAppTracking() {
    document.querySelectorAll('.whatsapp-float, a[href*="wa.me"]').forEach(function (link) {
      link.addEventListener('click', function () {
        console.log('[Analytics] WhatsApp click:', {
          timestamp: new Date().toISOString(),
          source: link.closest('section') ? link.closest('section').id || 'unknown' : 'float',
          url: link.href
        });
      });
    });
  }

  /* =============================================
     INIT ALL
     ============================================= */
  function init() {
    initLoader();
    renderPortfolio();
    initNavbar();
    initMobileMenu();
    initFilters();
    initModal();
    initCursor();
    initTestimonials();
    initFAQ();
    initBookingForm();
    initScrollReveal();
    initSmoothScroll();
    initStyleLinks();
    initWhatsAppTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
