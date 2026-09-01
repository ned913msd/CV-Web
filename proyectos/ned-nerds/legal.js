/* ================================================================
   ALFA & OMEGA — PÁGINAS LEGALES JS
   TOC highlight, smooth scroll, back-to-top, mobile TOC toggle
================================================================ */

(function () {
  'use strict';

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* ---------- BACK TO TOP ---------- */
  var backToTop = $('#back-to-top');
  var scrollThreshold = 300;

  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    updateActiveTOC();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- SMOOTH SCROLL FOR INTERNAL LINKS ---------- */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = $(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', href);
        updateActiveTOC();
        // Close mobile TOC if open
        var tocList = $('.legal-toc-list');
        if (tocList) tocList.classList.remove('open');
      }
    });
  });

  /* ---------- TOC ACTIVE HIGHLIGHT (Intersection Observer) ---------- */
  var sections = $$('.legal-section');
  var tocLinks = $$('.legal-toc-link');
  var tocLinkMap = {};

  tocLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      tocLinkMap[href.slice(1)] = link;
    }
  });

  function updateActiveTOC() {
    var scrollPos = window.scrollY + 150; // offset for header
    var activeId = null;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeId = section.id;
      }
    });

    tocLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var isActive = href === '#' + activeId;
      link.classList.toggle('active', isActive);
    });
  }

  /* ---------- MOBILE TOC TOGGLE ---------- */
  var tocToggle = $('.legal-toc-toggle');
  var tocList = $('.legal-toc-list');

  if (tocToggle && tocList) {
    tocToggle.addEventListener('click', function () {
      var isOpen = tocList.classList.toggle('open');
      tocToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close TOC when clicking a link on mobile
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 1024) {
          tocList.classList.remove('open');
        }
      });
    });
  }

  /* ---------- ACTIVE NAV LINK (based on current page) ---------- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = $$('.legal-nav-link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- KEYBOARD NAVIGATION ---------- */
  document.addEventListener('keydown', function (e) {
    // ESC to close mobile TOC
    if (e.key === 'Escape' && tocList && tocList.classList.contains('open')) {
      tocList.classList.remove('open');
      tocToggle.setAttribute('aria-expanded', 'false');
      tocToggle.focus();
    }
  });

  /* ---------- INIT ---------- */
  // Initial active TOC
  updateActiveTOC();

  // Update on hash change
  window.addEventListener('hashchange', updateActiveTOC);
})();