/* ================================================================
   DERMA GLOW PRO — script.js
   Standalone — no dependency on shared/app.js
   Configurador · Countdown · Reveal · Header · Parallax
================================================================ */

(function () {
  "use strict";

  /* ---------- Header Scroll ---------- */
  const header = document.querySelector("header");
  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileClose = document.querySelector(".mobile-close");
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

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

  /* ---------- Configurador de Intensidad ---------- */
  var nivelBtns = document.querySelectorAll(".nivel-btn");
  var nivelNombre = document.getElementById("nivelNombre");
  var nivelDescripcion = document.getElementById("nivelDescripcion");
  var nivelFill = document.getElementById("nivelFill");
  var configProduct = document.getElementById("configProduct");
  var configGlow = document.getElementById("configGlow");

  var niveles = {
    "1": {
      nombre: "Nivel 1 — Suave",
      descripcion: "Microcorriente delicada ideal para pieles sensibles o principiantes. Estimula la circulación sin irritar. Perfecta para tu primera semana de uso.",
      color: "#D92F68",
      scale: "1",
      translateY: "0px"
    },
    "2": {
      nombre: "Nivel 2 — Moderado",
      descripcion: "Intensidad diaria para mantenimiento. Fortalece la barrera cutánea y mejora la textura con uso continuado. Tu nivel de rutina.",
      color: "#D92F68",
      scale: "1.02",
      translateY: "-4px"
    },
    "3": {
      nombre: "Nivel 3 — Activo",
      descripcion: "Tratamiento orientado a resultados visibles. Estimula la producción de colágeno y elastina. Resultados notables en 2 semanas.",
      color: "#D92F68",
      scale: "1.04",
      translateY: "-8px"
    },
    "4": {
      nombre: "Nivel 4 — Intenso",
      descripcion: "Para usuarios avanzados que buscan transformación. Microcorriente potente que reafirma, levanta y redefine los contornos faciales.",
      color: "#D92F68",
      scale: "1.06",
      translateY: "-12px"
    },
    "5": {
      nombre: "Nivel 5 — Máximo",
      descripcion: "Experiencia de grado profesional. La máxima intensidad para resultados clínicos. Solo recomendado con experiencia previa en microcorriente.",
      color: "#D92F68",
      scale: "1.08",
      translateY: "-16px"
    }
  };

  function aplicarNivel(btn) {
    var nivel = btn.dataset.nivel;
    var data = niveles[nivel];
    if (!data) return;

    nivelBtns.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    if (nivelNombre) nivelNombre.textContent = data.nombre;
    if (nivelDescripcion) nivelDescripcion.textContent = data.descripcion;
    if (nivelFill) nivelFill.style.width = (nivel * 20) + "%";
    if (configProduct) {
      configProduct.style.transform = "scale(" + data.scale + ") translateY(" + data.translateY + ")";
    }
    if (configGlow) {
      configGlow.style.background = "radial-gradient(circle, " + data.color + "18, transparent 70%)";
    }
  }

  nivelBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { aplicarNivel(btn); });
  });

  /* ---------- Countdown ---------- */
  function initCountdown() {
    var el = document.getElementById("countdown");
    var daysAhead = el ? parseInt(el.dataset.days || "3", 10) : 3;
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

      var dias = document.getElementById("dias");
      var horas = document.getElementById("horas");
      var minutos = document.getElementById("minutos");
      var segundos = document.getElementById("segundos");

      if (dias) dias.textContent = pad(d);
      if (horas) horas.textContent = pad(h);
      if (minutos) minutos.textContent = pad(m);
      if (segundos) segundos.textContent = pad(s);

      if (d + h + m + s > 0) requestAnimationFrame(tick);
    }
    tick();
  }
  if (document.getElementById("countdown")) initCountdown();

  /* ---------- Scroll Reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".feature-card, .config-layout, .app-layout, .specs-layout, .offer-card, .trust-item, .tech-callout, .spec-card, .final-cta-title, .final-cta-sub, .final-cta-product"
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

  /* ---------- Hero Parallax (ligero) ---------- */
  var heroProduct = document.querySelector(".hero-product");
  if (heroProduct) {
    window.addEventListener("scroll", function () {
      var scroll = window.scrollY;
      if (scroll < 800) {
        heroProduct.style.transform = "translateY(" + (scroll * 0.04) + "px)";
      }
    }, { passive: true });
  }

})();
