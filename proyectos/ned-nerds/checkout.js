/* ================================================================
   NED — CHECKOUT PAGE
   Lógica: URL Parameters → producto → totales → validación → pago
================================================================ */

(function () {
  'use strict';

/* ---------- CONFIG ---------- */
  var CONFIG = {
    LS_PRODUCT: 'ned_checkout_product',
    LS_FORM: 'ned_checkout_form',
    LS_PLAN: 'ned_checkout_plan',
    GRACIAS_URL: 'gracias.html',
    EXPRESS_FEE: 15000,
    BUMP_PERCENT: 0.12,
    COUPONS: { 'NED10': 0.10 },
    LANDING_URL: 'index.html',
    CURRENCY: 'COP',
    LOCALE: 'es-CO'
  };

  var currencyFormatter = new Intl.NumberFormat(CONFIG.LOCALE, {
    style: 'currency',
    currency: CONFIG.CURRENCY,
    maximumFractionDigits: 0
  });

  function formatMoney(n) {
    return currencyFormatter.format(n);
  }

  /* ---------- HELPERS ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    var div = document.createElement('div');
    div.textContent = String(s);
    return div.innerHTML;
  }
  function getParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  /* ---------- PRODUCT STATE ---------- */
  var state = {
    name: '',
    price: 0,
    color: '',
    size: '',
    image: '',
    ship: 'std',
    bump: false,
    discount: 0,
    couponUsed: ''
  };

  var orderToken = 0;

  function parseAndCheck() {
    // 1) Detectar compra de plan de servicio NED (parámetro 'plan')
    var planRaw = getParam('plan');
    var priceRaw = getParam('price');
    var price = parseFloat(priceRaw);
    var planValid = planRaw && !!priceRaw && !isNaN(price) && price > 0;

    if (planValid) {
      // Guardar plan en localStorage para la página de gracias
      try {
        localStorage.setItem(CONFIG.LS_PLAN, JSON.stringify({
          id: planRaw,
          name: planRaw.charAt(0).toUpperCase() + planRaw.slice(1), // Starter/Professional/Enterprise
          price: price,
          ts: Date.now()
        }));
      } catch (e) {}
      // Continuar como producto normal para el checkout
      state.name = 'Plan ' + (planRaw.charAt(0).toUpperCase() + planRaw.slice(1));
      state.price = price;
      state.color = '';
      state.size = '';
      state.image = 'assets/producto.svg';
      saveProduct();
      return true;
    }

    // 2) Flujo normal: producto con parámetro 'product'
    var p = getParam('product');
    priceRaw = getParam('price');
    price = parseFloat(priceRaw);
    var valid = p && !!priceRaw && !isNaN(price) && price > 0;

    if (valid) {
      state.name = decodeURIComponent(p);
      state.price = price;
      state.color = getParam('color') ? decodeURIComponent(getParam('color')) : 'Único';
      state.size = getParam('size') ? decodeURIComponent(getParam('size')) : '';
      state.image = getParam('image') || 'assets/producto.svg';
      saveProduct();
      return true;
    }

    // Fallback: respaldo en localStorage
    var backup = loadProduct();
    if (backup && backup.name && backup.price > 0) {
      state.name = backup.name;
      state.price = backup.price;
      state.color = backup.color || 'Único';
      state.size = backup.size || '';
      state.image = backup.image || 'assets/producto.svg';
      return true;
    }

    return false;
  }

  function saveProduct() {
    try {
      localStorage.setItem(CONFIG.LS_PRODUCT, JSON.stringify({
        name: state.name, price: state.price, color: state.color,
        size: state.size, image: state.image, ts: Date.now()
      }));
    } catch (e) { /* privado/sin espacio */ }
  }

  function loadProduct() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.LS_PRODUCT) || 'null');
    } catch (e) { return null; }
  }

  /* ---------- FORM PERSISTENCE ---------- */
  function restoreForm() {
    try {
      var data = JSON.parse(localStorage.getItem(CONFIG.LS_FORM) || 'null');
      if (!data) return;
      var map = {
        email: '#email', nombre: '#nombre', apellido: '#apellido',
        telefono: '#telefono', direccion: '#direccion', ciudad: '#ciudad',
        cp: '#cp', pais: '#pais'
      };
      Object.keys(map).forEach(function (k) {
        if (data[k] !== undefined) {
          var el = $(map[k]);
          if (el && !getParam('reset')) el.value = data[k];
        }
      });
      if (data.ship) toggleShip(data.ship);
    } catch (e) { /* ignore */ }
  }

  function persistForm() {
    try {
      var data = {
        email: $('#email').value, nombre: $('#nombre').value,
        apellido: $('#apellido').value, telefono: $('#telefono').value,
        direccion: $('#direccion').value, ciudad: $('#ciudad').value,
        cp: $('#cp').value, pais: $('#pais').value,
        ship: state.ship
      };
      localStorage.setItem(CONFIG.LS_FORM, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  /* ---------- RENDER PRODUCT ---------- */
  function renderProduct() {
    var box = $('#order-product');
    var variant = 'Color: <b>' + esc(state.color) + '</b>';
    if (state.size) variant += ' · Talla: <b>' + esc(state.size) + '</b>';
    box.innerHTML =
      '<div class="order-thumb"><img src="' + esc(state.image) + '" alt="' + esc(state.name) + '"></div>' +
      '<div class="order-info">' +
      '  <span class="order-name">' + esc(state.name) + '</span>' +
      '  <span class="order-variant">' + variant + '</span>' +
      '  <span class="order-price">' + formatMoney(state.price) + '</span>' +
      '</div>';
    document.title = 'Pago Seguro | ' + state.name;
  }

  /* ---------- ORDER BUMP ---------- */

  /* ---------- TOTALS ---------- */
  function calcTotals() {
    var subtotal = state.price;
    var bump = hasBump() ? Math.round(subtotal * CONFIG.BUMP_PERCENT) : 0;
    var express = state.ship === 'exp' ? CONFIG.EXPRESS_FEE : 0;
    var discount = state.discount > 0 ? Math.round(subtotal * state.discount) : 0;
    var total = subtotal + bump + express - discount;
    if (total < 0) total = 0;
    return { subtotal: subtotal, bump: bump, express: express, discount: discount, total: total };
  }

  function renderTotals() {
    var t = calcTotals();

    $('#t-subtotal').textContent = formatMoney(t.subtotal);

    // Bump row
    var rowBump = $('#row-bump');
    if (t.bump > 0) {
      rowBump.classList.remove('hidden');
      $('#t-bump').textContent = formatMoney(t.bump);
    } else {
      rowBump.classList.add('hidden');
    }

    // Envío
    var shipEl = $('#t-ship');
    if (t.express > 0) {
      shipEl.textContent = formatMoney(t.express);
      shipEl.classList.remove('free-ship');
    } else {
      shipEl.textContent = 'GRATIS';
      shipEl.classList.add('free-ship');
    }

    // Descuento
    var rowDisc = $('#row-discount');
    if (t.discount > 0) {
      rowDisc.classList.remove('hidden');
      $('#t-discount').textContent = '−' + formatMoney(t.discount);
    } else {
      rowDisc.classList.add('hidden');
    }

    // Total
    var totalStr = formatMoney(t.total);
    $('#t-total').textContent = totalStr;
    $('#summary-toggle-total').textContent = totalStr;
    $('#mobile-total').textContent = totalStr;
  }

  /* ---------- SHIPPING TOGGLE ---------- */
  function toggleShip(value) {
    state.ship = value === 'exp' ? 'exp' : 'std';
    $$('.ship-option').forEach(function (opt) {
      var input = opt.querySelector('input');
      opt.classList.toggle('selected', input.value === state.ship);
      input.checked = input.value === state.ship;
    });
    renderTotals();
  }

  /* ---------- DISCOUNT ---------- */
  function applyDiscount() {
    var input = $('#discount-input');
    var msg = $('#discount-msg');
    var code = input.value.trim().toUpperCase();
    if (!code) { return; }

    if (CONFIG.COUPONS[code] !== undefined) {
      state.discount = CONFIG.COUPONS[code];
      state.couponUsed = code;
      msg.textContent = '¡Cupón ' + code + ' aplicado!';
      msg.className = 'discount-msg ok';
      input.disabled = true;
      $('#discount-btn').disabled = true;
      renderTotals();
    } else {
      msg.textContent = 'Código inválido. Verifica e intenta de nuevo.';
      msg.className = 'discount-msg err';
    }
  }

  /* ---------- CARD MASKS + BRAND ---------- */
  function detectBrand(number) {
    var n = number.replace(/\D/g, '');
    if (/^4/.test(n)) return 'visa';
    if (/^3[47]/.test(n)) return 'amex';
    if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(n)) return 'mc';
    return '';
  }

  function updateBrand(input) {
    var brand = detectBrand(input.value);
    $$('.brand-icon').forEach(function (icon) {
      icon.classList.toggle('active', icon.getAttribute('data-brand') === brand);
    });
  }

  function maskCardNumber(input) {
    var digits = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    updateBrand(input);
  }

  function maskExpiry(input) {
    var digits = input.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      input.value = digits.slice(0, 2) + '/' + digits.slice(2);
    } else {
      input.value = digits;
    }
  }

  function maskCVV(input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
  }

  /* ================================================================
     VALIDACIÓN
  ================================================================ */
  var validators = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    tel: function (v) { return v.replace(/\D/g, '').length >= 7; },
    cp: function (v) { return v.trim().length >= 3; },
    ccNumber: function (v) { return v.replace(/\D/g, '').length >= 15; },
    ccExp: function (v) { return /^\d{2}\/\d{2}$/.test(v.trim()); },
    ccCvv: function (v) { return /^\d{3,4}$/.test(v.trim()); },
    ccName: function (v) { return v.trim().length >= 3; },
    required: function (v) { return v.trim().length > 0; }
  };

  function validateField(field) {
    var input = field.querySelector('input, select');
    var errEl = field.querySelector('.field-error');
    if (!input) return true;

    var valid = true;
    var label = field.querySelector('label');
    var nameLabel = label ? label.textContent.trim().replace(/:\s*$/, '') : 'Campo';

    if (input.type === 'email') valid = validators.email(input.value);
    else if (input.id === 'telefono') valid = validators.tel(input.value);
    else if (input.id === 'cp') valid = validators.cp(input.value);
    else if (input.id === 'cc-number') valid = validators.ccNumber(input.value);
    else if (input.id === 'cc-exp') valid = validators.ccExp(input.value);
    else if (input.id === 'cc-cvv') valid = validators.ccCvv(input.value);
    else if (input.id === 'cc-name') valid = validators.ccName(input.value);
    else valid = validators.required(input.value);

    field.classList.toggle('invalid', !valid);
    if (errEl) {
      errEl.textContent = valid
        ? ''
        : (input.value.trim() === '' ? 'Este campo es obligatorio.' : 'Dato no válido. Revisa e intenta de nuevo.');
    }
    return valid;
  }

  function fieldsFor(scope) {
    return $$('.field', scope || document);
  }

  function attachFieldListeners() {
    if (window.localStorage) {
      $$('input, select').forEach(function (el) {
        el.addEventListener('input', function () { persistForm(); });
      });
    }
  }

  function validateAll() {
    var all = fieldsFor();
    var firstInvalid = null;
    all.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });
    return { ok: !firstInvalid, first: firstInvalid };
  }

  /* ================================================================
     PAGO (simulado)
  ================================================================ */
  function setLoading(loading) {
    $$('.btn-buy').forEach(function (btn) {
      btn.disabled = loading;
      var text = btn.querySelector('.btn-buy-text');
      var spin = btn.querySelector('.btn-buy-loading');
      if (loading) { text.classList.add('hidden'); spin.classList.remove('hidden'); }
      else { text.classList.remove('hidden'); spin.classList.add('hidden'); }
    });
  }

  function purchase() {
    var v = validateAll();
    if (!v.ok) {
      if (v.first) {
        v.first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var input = v.first.querySelector('input, select');
        if (input) input.focus();
      }
      return;
    }

    setLoading(true);
    setTimeout(function () {
      setLoading(false);

      // Si es compra de plan NED → redirigir a página de gracias
      var isPlanPurchase = false;
      try { isPlanPurchase = !!localStorage.getItem(CONFIG.LS_PLAN); } catch (e) {}

      if (isPlanPurchase) {
        window.location.href = CONFIG.GRACIAS_URL;
        return;
      }

      // Flujo normal: modal de éxito
      orderToken = Math.floor(100000 + Math.random() * 900000);
      $('#modal-order-num').textContent = '#' + orderToken;
      $('#success-modal').classList.remove('hidden');
      try {
        localStorage.removeItem(CONFIG.LS_FORM);
        localStorage.removeItem(CONFIG.LS_PRODUCT);
      } catch (e) { /* ignore */ }
    }, 2000);
  }

  /* ================================================================
     INIT
  ================================================================ */
  function init() {
    if (!parseAndCheck()) {
      // Sin producto válido → redirigir a la landing
      window.location.replace(CONFIG.LANDING_URL);
      return;
    }
    var el = $('.summary-card');
    if (el) el.classList.remove('collapsed');

    // Producto + bump price
    renderProduct();
    $('#bump-price').textContent = formatMoney(Math.round(state.price * CONFIG.BUMP_PERCENT));

    // Envío (default estándar)
    toggleShip('std');

    // Restaurar formulario persistido (solo si el usuario recarga la misma página)
    restoreForm();

    // Envío
    $$('.ship-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        toggleShip(opt.querySelector('input').value);
      });
    });

    // Order bump
    var bumpCheck = $('#bump-check');
    if (bumpCheck) {
      bumpCheck.addEventListener('change', function () {
        state.bump = bumpCheck.checked;
        renderTotals();
      });
    }

    // Descuento
    $('#discount-btn').addEventListener('click', applyDiscount);
    $('#discount-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); applyDiscount(); }
    });

    // Máscaras + brand
    var ccNumber = $('#cc-number');
    var ccExp = $('#cc-exp');
    var ccCvv = $('#cc-cvv');
    ccNumber.addEventListener('input', function () { maskCardNumber(ccNumber); });
    ccExp.addEventListener('input', function () { maskExpiry(ccExp); });
    ccCvv.addEventListener('input', function () { maskCVV(ccCvv); });

    // Validación en blur
    fieldsFor().forEach(function (field) {
      var input = field.querySelector('input, select');
      if (input) input.addEventListener('blur', function () { validateField(field); });
    });

    // Tabs de pago
    $$('.pay-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        $$('.pay-tab').forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
        $$('.pay-panel').forEach(function (p) { p.classList.add('hidden'); });
        $('#panel-' + tab.getAttribute('data-tab')).classList.remove('hidden');
      });
    });

    // Summary toggle (mobile)
    var toggle = $('#summary-toggle');
    toggle.addEventListener('click', function () {
      var card = $('.summary-card');
      card.classList.toggle('collapsed');
      var isCollapsed = card.classList.contains('collapsed');
      toggle.setAttribute('aria-expanded', String(!isCollapsed));
    });

    // Comprar
    $$('.btn-buy').forEach(function (btn) {
      if (btn.id === 'buy-btn' || btn.id === 'buy-sticky') {
        btn.addEventListener('click', purchase);
      }
    });

    // Modal
    $('#modal-close').addEventListener('click', function () {
      window.location.href = CONFIG.LANDING_URL;
    });

    persistForm();
    renderTotals();
    attachFieldListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();