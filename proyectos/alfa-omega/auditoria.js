/* ================================================================
   ALFA & OMEGA — AUDITORÍA GRATIS — JS
   Form validation + Web3Forms + Honeypot
   ================================================================ */

(function () {
  var form = document.getElementById('audForm');
  if (!form) return;

  var btn = document.getElementById('audSubmit');
  var btnText = btn.querySelector('.aud-btn-text');
  var btnLoading = btn.querySelector('.aud-btn-loading');

  /* --- Helpers --- */
  var validate = {
    nombre: function (v) { return v.length >= 2; },
    url: function (v) {
      if (!v) return false;
      try {
        var u = new URL(v);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch (e) {
        // Try prepending https://
        try {
          var u2 = new URL('https://' + v);
          return true;
        } catch (e2) {
          return false;
        }
      }
    },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  };

  function setField(id, valid) {
    var input = document.getElementById(id);
    var group = input.closest('.aud-field');
    group.classList.toggle('invalido', !valid);
  }

  /* --- Real-time validation on blur --- */
  form.querySelectorAll('input[required]').forEach(function (input) {
    input.addEventListener('blur', function () {
      var id = input.id.replace('aud-', '');
      var testFn = validate[id];
      if (testFn) setField(input.id, testFn(input.value.trim()));
    });
    input.addEventListener('input', function () {
      input.closest('.aud-field').classList.remove('invalido');
    });
  });

  /* --- URL auto-fix: add https:// if missing --- */
  var urlInput = document.getElementById('aud-url');
  if (urlInput) {
    urlInput.addEventListener('blur', function () {
      var v = urlInput.value.trim();
      if (v && !v.match(/^https?:\/\//)) {
        urlInput.value = 'https://' + v;
      }
    });
  }

  /* --- Submit --- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check
    var gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value) return;

    // Validate all
    var nombreVal = document.getElementById('aud-nombre').value.trim();
    var urlVal = document.getElementById('aud-url').value.trim();
    var emailVal = document.getElementById('aud-email').value.trim();

    var validNombre = validate.nombre(nombreVal);
    var validUrl = validate.url(urlVal);
    var validEmail = validate.email(emailVal);

    setField('aud-nombre', validNombre);
    setField('aud-url', validUrl);
    setField('aud-email', validEmail);

    if (!validNombre || !validUrl || !validEmail) {
      // Scroll to first error
      var firstError = form.querySelector('.invalido');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Show loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    btn.disabled = true;

    try {
      var data = new FormData(form);
      var res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      var json = await res.json();

      if (json.success) {
        // Redirect to thank you page
        window.location.href = 'gracias-auditoria.html';
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      btn.disabled = false;
      alert('Hubo un error al enviar. Por favor, intenta de nuevo o escríbenos a contacto.nedbustamante@gmail.com');
    }
  });
})();
