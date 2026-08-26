/* ================================================================
   SHARED — app.js
   Configurador interactivo · Countdown configurable · Reveal
   Cada landing define sus escenas via data-attributes en HTML.
   Countdown se configura con data-days en #countdown.
================================================================ */

(function () {
  "use strict";

  /* ---------- Configurador de Escenas ---------- */
  const escenaBtns = document.querySelectorAll(".escena-btn");
  const previewImg = document.getElementById("previewImg");
  const previewGlow = document.getElementById("previewGlow");
  const escenaNombre = document.getElementById("escenaNombre");
  const heroGlow = document.getElementById("heroGlow");
  const lampGlow = document.getElementById("lampGlow");

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function aplicarEscena(btn) {
    const color = btn.dataset.color;
    const glow = btn.dataset.glow;
    const nombre = btn.dataset.nombre;

    escenaBtns.forEach((b) => b.classList.remove("activa"));
    btn.classList.add("activa");

    document.documentElement.style.setProperty("--lamp-color", color);
    document.documentElement.style.setProperty("--lamp-glow", hexToRgba(glow, 0.55));

    if (previewGlow) previewGlow.style.background = color;
    if (escenaNombre) {
      escenaNombre.textContent = nombre;
      escenaNombre.style.color = glow;
    }
    if (previewImg) {
      previewImg.style.filter =
        "drop-shadow(0 0 30px " + hexToRgba(glow, 0.7) + ")";
    }
    if (heroGlow) heroGlow.style.background = color;
    if (lampGlow) {
      lampGlow.style.background =
        "radial-gradient(circle, " + hexToRgba(glow, 0.53) + ", transparent 70%)";
    }
  }

  escenaBtns.forEach((btn) => {
    btn.addEventListener("click", () => aplicarEscena(btn));
  });

  /* ---------- Countdown ---------- */
  function initCountdown() {
    const el = document.getElementById("countdown");
    const daysAhead = el ? parseInt(el.dataset.days || "2", 10) : 2;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + daysAhead);
    deadline.setHours(23, 59, 59, 0);

    function tick() {
      const now = new Date();
      let diff = Math.max(0, deadline - now);

      const d = Math.floor(diff / 86400000);
      diff %= 86400000;
      const h = Math.floor(diff / 3600000);
      diff %= 3600000;
      const m = Math.floor(diff / 60000);
      diff %= 60000;
      const s = Math.floor(diff / 1000);

      const dias = document.getElementById("dias");
      const horas = document.getElementById("horas");
      const minutos = document.getElementById("minutos");
      const segundos = document.getElementById("segundos");

      if (dias) dias.textContent = String(d).padStart(2, "0");
      if (horas) horas.textContent = String(h).padStart(2, "0");
      if (minutos) minutos.textContent = String(m).padStart(2, "0");
      if (segundos) segundos.textContent = String(s).padStart(2, "0");

      if (d + h + m + s > 0) requestAnimationFrame(tick);
    }
    tick();
  }
  if (document.getElementById("countdown")) initCountdown();

  /* ---------- Scroll Reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".feature-card, .escenas, .config-preview, .specs-texto, .specs-lista, .preventa-info, .preventa-cta"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
})();
