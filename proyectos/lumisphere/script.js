/* ================================================================
   LUMISPHERE — script.js
   Standalone luxury lighting — no shared dependencies
   Scenes · Countdown · Reveal · Header · Parallax · Mobile Menu
================================================================ */

(function () {
  "use strict";

  /* ---------- Header Scroll ---------- */
  var header = document.getElementById("header");
  function handleHeaderScroll() {
    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ---------- Mobile Menu ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mobileMenu = document.getElementById("mobileMenu");
  var mobileClose = document.querySelector(".mobile-close");
  var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  function openMenu() { mobileMenu.classList.add("abierto"); document.body.style.overflow = "hidden"; }
  function closeMenu() { mobileMenu.classList.remove("abierto"); document.body.style.overflow = ""; }

  if (hamburger) hamburger.addEventListener("click", openMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMenu);
  mobileLinks.forEach(function (link) { link.addEventListener("click", closeMenu); });

  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- Scene Configurator ---------- */
  var sceneBtns = document.querySelectorAll(".scene-btn");
  var previewImg = document.getElementById("previewImg");
  var previewGlow = document.getElementById("previewGlow");
  var sceneName = document.getElementById("sceneName");
  var heroGlow = document.getElementById("heroGlow");
  var lampGlow = document.getElementById("lampGlow");

  var scenes = [
    {
      name: "Noche estrellada",
      color: "#3b82f6",
      glow: "rgba(59,130,246,0.55)",
      filter: "drop-shadow(0 0 30px rgba(59,130,246,0.7))",
      desc: "Cielo nocturno profundo con constelaciones"
    },
    {
      name: "Aurora boreal",
      color: "#06b6d4",
      glow: "rgba(6,182,212,0.55)",
      filter: "drop-shadow(0 0 30px rgba(6,182,212,0.7)) hue-rotate(15deg) saturate(1.3)",
      desc: "Verdes y azules etéreos en movimiento"
    },
    {
      name: "Atardecer cálido",
      color: "#f97316",
      glow: "rgba(249,115,22,0.55)",
      filter: "drop-shadow(0 0 30px rgba(249,115,22,0.7)) sepia(0.35) saturate(1.6)",
      desc: "Naranjas y ámbar envolventes"
    },
    {
      name: "Neblina profunda",
      color: "#8b5cf6",
      glow: "rgba(139,92,246,0.55)",
      filter: "drop-shadow(0 0 30px rgba(139,92,246,0.7)) hue-rotate(-25deg) saturate(1.2)",
      desc: "Púrpuras misteriosos y sutiles"
    },
    {
      name: "Bosque místico",
      color: "#10b981",
      glow: "rgba(16,185,129,0.55)",
      filter: "drop-shadow(0 0 30px rgba(16,185,129,0.7)) hue-rotate(50deg) saturate(1.2)",
      desc: "Verdes naturales y terrosos"
    }
  ];

  function aplicarEscena(btn) {
    var idx = parseInt(btn.dataset.scene, 10);
    var data = scenes[idx];
    if (!data) return;

    sceneBtns.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    document.documentElement.style.setProperty("--lamp-color", data.color);
    document.documentElement.style.setProperty("--lamp-glow", data.glow);

    if (previewGlow) previewGlow.style.background = data.color;
    if (sceneName) {
      sceneName.textContent = data.name;
      sceneName.style.color = data.color;
    }
    if (previewImg) previewImg.style.filter = data.filter;
    if (heroGlow) heroGlow.style.background = data.color;
    if (lampGlow) {
      lampGlow.style.background = "radial-gradient(circle, " + data.glow + ", transparent 70%)";
    }
  }

  sceneBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { aplicarEscena(btn); });
  });

  /* ---------- Countdown ---------- */
  function initCountdown() {
    var el = document.getElementById("countdown");
    var daysAhead = el ? parseInt(el.dataset.days || "2", 10) : 2;
    var deadline = new Date();
    deadline.setDate(deadline.getDate() + daysAhead);
    deadline.setHours(23, 59, 59, 0);

    function pad(n) { return String(n).padStart(2, "0"); }

    function tick() {
      var now = new Date();
      var diff = Math.max(0, deadline - now);

      var d = Math.floor(diff / 86400000); diff %= 86400000;
      var h = Math.floor(diff / 3600000);  diff %= 3600000;
      var m = Math.floor(diff / 60000);    diff %= 60000;
      var s = Math.floor(diff / 1000);

      var cdDays = document.getElementById("cd-days");
      var cdHours = document.getElementById("cd-hours");
      var cdMins = document.getElementById("cd-mins");
      var cdSecs = document.getElementById("cd-secs");

      if (cdDays) cdDays.textContent = pad(d);
      if (cdHours) cdHours.textContent = pad(h);
      if (cdMins) cdMins.textContent = pad(m);
      if (cdSecs) cdSecs.textContent = pad(s);

      if (d + h + m + s > 0) requestAnimationFrame(tick);
    }
    tick();
  }
  if (document.getElementById("countdown")) initCountdown();

  /* ---------- Scroll Reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".exp-card, .feature-row, .mat-card, .app-mockup, .app-text, .spec-block, .lifestyle-card, .offer-info, .offer-cta-card, .final-cta-content"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(function (el) { observer.observe(el); });

  /* ---------- Hero Parallax (subtle) ---------- */
  var heroImg = document.querySelector(".hero-img");
  var heroGlowEl = document.querySelector(".hero-glow");
  if (heroImg) {
    window.addEventListener("scroll", function () {
      var scroll = window.scrollY;
      if (scroll < 900) {
        heroImg.style.transform = "translateY(" + (scroll * 0.035) + "px)";
        if (heroGlowEl) heroGlowEl.style.transform = "translate(-50%, calc(-50% + " + (scroll * 0.02) + "px))";
      }
    }, { passive: true });
  }

})();
