/* ================================================================
   LUMISPHERE — script.js
   Configurador de escenas · Countdown · Reveal
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

  const filtrosMap = {
    "#3b82f6": "drop-shadow(0 0 30px rgba(59,130,246,0.7))",
    "#06b6d4": "drop-shadow(0 0 30px rgba(6,182,212,0.7)) hue-rotate(15deg) saturate(1.3)",
    "#f97316": "drop-shadow(0 0 30px rgba(249,115,22,0.7)) sepia(0.35) saturate(1.6)",
    "#8b5cf6": "drop-shadow(0 0 30px rgba(139,92,246,0.7)) hue-rotate(-25deg) saturate(1.2)",
    "#10b981": "drop-shadow(0 0 30px rgba(16,185,129,0.7)) hue-rotate(50deg) saturate(1.2)",
  };

  function aplicarEscena(btn) {
    const color = btn.dataset.color;
    const glow = btn.dataset.glow;
    const nombre = btn.dataset.nombre;

    escenaBtns.forEach((b) => b.classList.remove("activa"));
    btn.classList.add("activa");

    document.documentElement.style.setProperty("--lamp-color", color);
    document.documentElement.style.setProperty(
      "--lamp-glow",
      glow.replace(")", ",0.55)")
    );

    if (previewGlow) previewGlow.style.background = color;
    if (escenaNombre) {
      escenaNombre.textContent = nombre;
      escenaNombre.style.color = glow;
    }
    if (previewImg) previewImg.style.filter = filtrosMap[color] || "none";
    if (heroGlow) heroGlow.style.background = color;
    if (lampGlow) {
      lampGlow.style.background = `radial-gradient(circle, ${glow}88, transparent 70%)`;
    }
  }

  escenaBtns.forEach((btn) => {
    btn.addEventListener("click", () => aplicarEscena(btn));
  });

  /* ---------- Countdown ---------- */
  function initCountdown() {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2);
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

      document.getElementById("dias").textContent = String(d).padStart(2, "0");
      document.getElementById("horas").textContent = String(h).padStart(2, "0");
      document.getElementById("minutos").textContent = String(m).padStart(2, "0");
      document.getElementById("segundos").textContent = String(s).padStart(2, "0");

      if (d + h + m + s > 0) requestAnimationFrame(tick);
    }
    tick();
  }
  initCountdown();

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
