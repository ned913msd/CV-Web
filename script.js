/* ================================================================
   PORTAFOLIO DAVID BUSTAMANTE — LÓGICA DE INTERACCIÓN
================================================================ */

/* ============ 1. HEADER AL HACER SCROLL ============ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ============ 2. MENÚ MÓVIL ============ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('abierto');
  hamburger.classList.toggle('activo');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('abierto');
    hamburger.classList.remove('activo');
  });
});

/* ============ 3. SCROLLSPY ============ */
const secciones = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
const spy = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)
      );
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
secciones.forEach(s => spy.observe(s));

/* ============ 4. REVEAL ON SCROLL ============ */
const revelador = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revelador.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revelador.observe(el));

/* ============ 5. CONTADORES ANIMADOS ============ */
const animarContador = (el) => {
  const objetivo = +el.dataset.contador;
  const sufijo = el.dataset.sufijo || '';
  const duracion = 1600;
  const inicio = performance.now();
  const paso = (ahora) => {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    const eased = progreso === 1 ? 1 : 1 - Math.pow(2, -10 * progreso);
    el.textContent = Math.round(objetivo * eased) + sufijo;
    if (progreso < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
};
const obsContador = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) { animarContador(e.target); obsContador.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-contador]').forEach(el => obsContador.observe(el));

/* ============ 6. BARRAS DE HABILIDADES ============ */
const obsBarras = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.nivel + '%';
      obsBarras.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.barra-fill').forEach(el => obsBarras.observe(el));

/* ============ 7. MARQUEE ============ */
const track = document.getElementById('marqueeTrack');
track.innerHTML += track.innerHTML;

/* ============ 8. TOAST ============ */
const toast = document.getElementById('toast');
const toastMensaje = document.getElementById('toastMensaje');
let toastTimer;
const mostrarToast = (msg) => {
  toastMensaje.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
};

/* ============ 9. BOTÓN CV ============ */
/* Ya está conectado a assets/cv.pdf en el HTML. Este fallback solo
   se activa si por alguna razón el href es "#" (archivo faltante). */
const btnCV = document.getElementById('btnCV');
btnCV.addEventListener('click', (e) => {
  if (btnCV.getAttribute('href') === '#') {
    e.preventDefault();
    mostrarToast('Coloca tu CV en assets/cv.pdf para activar la descarga 📄');
  }
});

/* ============ 10. FORMULARIO DE CONTACTO (Web3Forms) ============ */
const form = document.getElementById('formContacto');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valido = true;

  const validar = (id, test) => {
    const input = document.getElementById(id);
    const grupo = input.closest('.form-group');
    const ok = test(input.value.trim());
    grupo.classList.toggle('invalido', !ok);
    if (!ok) valido = false;
  };

  validar('nombre', v => v.length >= 2);
  validar('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  validar('mensaje', v => v.length >= 10);

  if (!valido) { mostrarToast('Revisa los campos marcados'); return; }

  const btn = form.querySelector('.btn-form');
  const textoOriginal = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  try {
    const datos = new FormData(form);
    datos.append('subject', `Nuevo proyecto — ${datos.get('nombre')}`);
    datos.append('from_name', 'Portafolio David Ned');

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: datos
    });
    const json = await res.json();

    if (json.success) {
      form.reset();
      mostrarToast('¡Mensaje enviado! Te responderé en menos de 24 horas 🚀');
    } else {
      mostrarToast('No se pudo enviar. Escríbeme directo a ned913msd@gmail.com');
    }
  } catch {
    mostrarToast('Sin conexión. Intenta de nuevo o escríbeme por WhatsApp 💬');
  } finally {
    btn.textContent = textoOriginal;
    btn.disabled = false;
  }
});

form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () =>
    el.closest('.form-group').classList.remove('invalido')
  );
});

/* ============ AÑO DINÁMICO ============ */
document.getElementById('anio').textContent = new Date().getFullYear();
