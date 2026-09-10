/* ================================================================
   ALFA & OMEGA — AUDITORÍA GRATIS — JS
   Form validation + Formspree + Honeypot
   ================================================================ */

(function () {
  var form = document.querySelector('.audit-form');
  if (!form) return;

  /* --- Helpers --- */
  function setField(input, valid) {
    input.closest('.form-group').classList.toggle('invalido', !valid);
  }

  function isURL(v) {
    if (!v) return false;
    try {
      var u = new URL(v);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
      try { new URL('https://' + v); return true; } catch (e2) { return false; }
    }
  }

  /* --- Real-time validation on blur --- */
  form.querySelectorAll('input[required]').forEach(function (input) {
    input.addEventListener('blur', function () {
      var v = input.value.trim();
      var valid = true;
      if (input.name === 'nombre') valid = v.length >= 2;
      else if (input.name === 'url_tienda') valid = isURL(v);
      else if (input.name === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      setField(input, valid);
    });
    input.addEventListener('input', function () {
      input.closest('.form-group').classList.remove('invalido');
    });
  });

  /* --- URL auto-fix: add https:// if missing --- */
  var urlInput = document.getElementById('url_tienda');
  if (urlInput) {
    urlInput.addEventListener('blur', function () {
      var v = urlInput.value.trim();
      if (v && !v.match(/^https?:\/\//)) {
        urlInput.value = 'https://' + v;
      }
    });
  }

  /* --- Auto-fill hidden date field on submit --- */
  form.addEventListener('submit', function () {
    var fechaField = document.getElementById('fecha_solicitud');
    if (fechaField && !fechaField.value) {
      var now = new Date();
      var options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' };
      fechaField.value = now.toLocaleString('es-CO', options);
    }
  });
})();
