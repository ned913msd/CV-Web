/* ================================================================
   ALFA & OMEGA — CHECKOUT MODO MANUAL (Lead Capture)
   Sin Mercado Pago — captura lead y redirige a gracias con status=pending_manual
================================================================ */

(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  var CONFIG = {
    // ⚠️ REEMPLAZA CON TU PUBLIC KEY REAL DE MERCADO PAGO CUANDO LO ACTIVES
    // MP_PUBLIC_KEY: 'TEST-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    // PREFERENCE_ENDPOINT: '/api/create-preference',
    // SUCCESS_URL: 'gracias.html?status=approved',
    // FAILURE_URL: 'checkout.html?error=failed',
    // PENDING_URL: 'gracias.html?status=pending',

    // Modo actual: MANUAL
    PAYMENT_MODE: 'manual', // 'mercadopago' | 'manual'
    MANUAL_SUCCESS_URL: 'gracias.html?status=pending_manual',

    PLANS: {
      starter:    { name: 'Plan Starter',    priceUSD: 147, priceCOP: 600000,  details: 'Landing 1 sección + Copy + Formulario' },
      professional: { name: 'Plan Professional', priceUSD: 357, priceCOP: 1450000, details: 'Landing 8 secciones + Copy + Email + SEO' },
      enterprise: { name: 'Plan Enterprise', priceUSD: 635, priceCOP: 2600000, details: '3 Landings + A/B Testing + Dashboard + Consultoría' }
    },

    UPSELL: { priceUSD: 49, priceCOP: 200000, name: 'Setup Analytics + Pixel' },

    LS_PLAN: 'ned_checkout_plan',
    LS_FORM: 'ned_checkout_form',
    LS_ORDER: 'ned_checkout_order',

    LANDING_URL: 'index.html'
  };

  var currencyUSDFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  var currencyCOPFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  function fmtUSD(n) { return currencyUSDFmt.format(n); }
  function fmtCOP(n) { return currencyCOPFmt.format(n); }

  /* ---------- HELPERS ---------- */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getParam(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }

  /* ---------- STATE ---------- */
  var state = {
    planId: '',
    planName: '',
    planPriceUSD: 0,
    planPriceCOP: 0,
    planDetails: '',
    bump: false,
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    ciudad: '',
    pais: 'CO',
    nit: '',
    newsletter: true,
    paymentMethod: 'transfer' // 'transfer' | 'paypal' | 'crypto'
  };

  var selectedMethod = 'transfer';

  /* ---------- PLAN LOADING ---------- */
  function loadPlanFromURL() {
    var plan = getParam('plan');
    var price = parseFloat(getParam('price'));
    if (plan && CONFIG.PLANS[plan] && !isNaN(price) && price > 0) {
      var p = CONFIG.PLANS[plan];
      state.planId = plan;
      state.planName = p.name;
      state.planPriceUSD = price;
      state.planPriceCOP = p.priceCOP;
      state.planDetails = p.details;
      return true;
    }
    try {
      var saved = JSON.parse(localStorage.getItem(CONFIG.LS_PLAN) || 'null');
      if (saved && saved.id && CONFIG.PLANS[saved.id]) {
        var p = CONFIG.PLANS[saved.id];
        state.planId = saved.id;
        state.planName = p.name;
        state.planPriceUSD = p.priceUSD;
        state.planPriceCOP = p.priceCOP;
        state.planDetails = p.details;
        return true;
      }
    } catch (e) {}
    return false;
  }

  function savePlanToLS() {
    try { localStorage.setItem(CONFIG.LS_PLAN, JSON.stringify({ id: state.planId, name: state.planName, priceUSD: state.planPriceUSD, priceCOP: state.planPriceCOP, details: state.planDetails, ts: Date.now() })); } catch (e) {}
  }

  function clearCheckoutLS() {
    try { localStorage.removeItem('ned_checkout_product'); localStorage.removeItem('ned_checkout_form'); } catch (e) {}
  }

  /* ---------- FORM PERSISTENCE ---------- */
  function persistForm() {
    try {
      localStorage.setItem(CONFIG.LS_FORM, JSON.stringify({
        email: $('#email').value, nombre: $('#nombre').value, apellido: $('#apellido').value,
        telefono: $('#telefono').value, ciudad: $('#ciudad').value, pais: $('#pais').value,
        nit: $('#nit').value, newsletter: $('#newsletter').checked
      }));
    } catch (e) {}
  }

  function restoreForm() {
    try {
      var data = JSON.parse(localStorage.getItem(CONFIG.LS_FORM) || 'null');
      if (!data) return;
      var map = { email: '#email', nombre: '#nombre', apellido: '#apellido', telefono: '#telefono', ciudad: '#ciudad', pais: '#pais', nit: '#nit' };
      Object.keys(map).forEach(function(k) { var el = $(map[k]); if (el && data[k] !== undefined) el.value = data[k]; });
      if (data.newsletter !== undefined) $('#newsletter').checked = data.newsletter;
    } catch (e) {}
  }

  /* ---------- RENDER ---------- */
  function renderPlan() {
    var isCOP = state.pais === 'CO';
    var priceMain = isCOP ? fmtCOP(state.planPriceCOP) : fmtUSD(state.planPriceUSD);

    $('#order-product').innerHTML =
      '<div class="order-thumb">🚀</div>' +
      '<div class="order-info">' +
      '  <span class="order-name">' + state.planName + '</span>' +
      '  <span class="order-desc">' + state.planDetails + '</span>' +
      '  <span class="order-qty">Cantidad: <strong>1</strong></span>' +
      '</div>';

    var bumpPrice = isCOP ? fmtCOP(CONFIG.UPSELL.priceCOP) : fmtUSD(CONFIG.UPSELL.priceUSD);
    $('#bump-price').textContent = bumpPrice;
    renderTotals();
  }

  function renderTotals() {
    var isCOP = state.pais === 'CO';
    var sub = isCOP ? state.planPriceCOP : state.planPriceUSD;
    var bump = state.bump ? (isCOP ? CONFIG.UPSELL.priceCOP : CONFIG.UPSELL.priceUSD) : 0;
    var total = sub + bump;

    // Aplicar descuento crypto si ese método está seleccionado
    if (selectedMethod === 'crypto') {
      total = Math.round(total * 0.95); // 5% descuento
    }

    var fmt = isCOP ? fmtCOP : fmtUSD;
    $('#t-subtotal').textContent = fmt(sub);
    $('#t-bump').textContent = fmt(bump);
    $('#t-total').textContent = fmt(total);
    $('#summary-toggle-total').textContent = fmt(total);
    $('#mobile-total').textContent = fmt(total);

    // Actualizar monto crypto si aplica
    var cryptoAmountEl = $('#crypto-amount');
    if (cryptoAmountEl) {
      var cryptoTotal = isCOP ? Math.round(state.planPriceCOP / 4100) : state.planPriceUSD; // aprox USD
      if (state.bump) cryptoTotal += (isCOP ? Math.round(CONFIG.UPSELL.priceCOP / 4100) : CONFIG.UPSELL.priceUSD);
      if (selectedMethod === 'crypto') cryptoTotal = Math.round(cryptoTotal * 0.95);
      cryptoAmountEl.textContent = '$' + cryptoTotal.toFixed(2);
    }

    var rowBump = $('#row-bump');
    if (bump > 0) rowBump.classList.remove('hidden'); else rowBump.classList.add('hidden');
  }

  /* ---------- VALIDATION ---------- */
  var validators = {
    email: function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    tel: function(v) { return v.replace(/\D/g, '').length >= 7; },
    required: function(v) { return v.trim().length > 0; }
  };

  function validateField(field) {
    var input = field.querySelector('input, select');
    if (!input) return true;
    var valid = true;
    if (input.type === 'email') valid = validators.email(input.value);
    else if (input.id === 'telefono') valid = validators.tel(input.value);
    else valid = validators.required(input.value);
    field.classList.toggle('invalid', !valid);
    return valid;
  }

  function validateAll() {
    var all = $$('.form-section .field');
    var firstInvalid = null;
    all.forEach(function(f) { if (!validateField(f) && !firstInvalid) firstInvalid = f; });
    return { ok: !firstInvalid, first: firstInvalid };
  }

  function attachFormListeners() {
    $$('input, select').forEach(function(el) { el.addEventListener('input', persistForm); el.addEventListener('change', persistForm); });
    $$('.form-section .field').forEach(function(f) { var i = f.querySelector('input, select'); if (i) i.addEventListener('blur', function() { validateField(f); }); });
  }

  /* ---------- PAIS / MONEDA ---------- */
  function onPaisChange() {
    var pais = $('#pais').value;
    state.pais = pais || 'CO';
    renderPlan();
  }

  /* ---------- MANUAL PAYMENT METHOD SELECTION ---------- */
  function initManualPayment() {
    $$('.manual-option-card').forEach(function(card) {
      card.addEventListener('click', function() {
        $$('.manual-option-card').forEach(function(c) { c.classList.remove('active'); });
        card.classList.add('active');
        selectedMethod = card.dataset.method;

        // Mostrar/ocultar detalles según método
        $$('.manual-payment-details').forEach(function(d) { d.classList.add('hidden'); });
        var detailId = card.dataset.method + '-details';
        var detailEl = $('#' + detailId);
        if (detailEl) detailEl.classList.remove('hidden');

        state.paymentMethod = card.dataset.method;
        renderTotals(); // recalcular por descuento crypto
      });
    });

    // Copy buttons
    $$('.copy-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetSel = this.getAttribute('data-copy');
        var target = $(targetSel);
        if (target) {
          var text = target.textContent.trim();
          navigator.clipboard.writeText(text).then(function() {
            var original = this.textContent;
            this.textContent = '✓ Copiado';
            this.style.background = 'var(--primary)';
            this.style.color = '#fff';
            var self = this;
            setTimeout(function() { self.textContent = original; self.style.background = ''; self.style.color = ''; }, 1500);
          }.bind(this));
        }
      });
    });
  }

  /* ---------- PAY BUTTON (MANUAL) ---------- */
  function setPayLoading(loading) {
    $$('.btn-pay').forEach(function(btn) {
      btn.disabled = loading;
      var t = btn.querySelector('.btn-pay-text');
      var l = btn.querySelector('.btn-pay-loading');
      if (loading) { t.classList.add('hidden'); l.classList.remove('hidden'); }
      else { t.classList.remove('hidden'); l.classList.add('hidden'); }
    });
  }

  function onPayClick() {
    var v = validateAll();
    if (!v.ok) {
      if (v.first) { v.first.scrollIntoView({ behavior: 'smooth', block: 'center' }); var i = v.first.querySelector('input, select'); if (i) i.focus(); }
      return;
    }

    // Guardar datos finales
    state.email = $('#email').value;
    state.nombre = $('#nombre').value;
    state.apellido = $('#apellido').value;
    state.telefono = $('#telefono').value;
    state.ciudad = $('#ciudad').value;
    state.pais = $('#pais').value;
    state.nit = $('#nit').value;
    state.newsletter = $('#newsletter').checked;

    // Guardar orden local
    var isCOP = state.pais === 'CO';
    var sub = isCOP ? state.planPriceCOP : state.planPriceUSD;
    var bump = state.bump ? (isCOP ? CONFIG.UPSELL.priceCOP : CONFIG.UPSELL.priceUSD) : 0;
    var total = sub + bump;
    if (selectedMethod === 'crypto') total = Math.round(total * 0.95);

    try {
      localStorage.setItem(CONFIG.LS_ORDER, JSON.stringify({
        plan: state.planId,
        bump: state.bump,
        paymentMethod: selectedMethod,
        total: total,
        currency: isCOP ? 'COP' : 'USD',
        status: 'pending_manual',
        ts: Date.now()
      }));
    } catch (e) {}

    // Simular envío de lead (en producción: fetch a tu backend/email service)
    console.log('📋 LEAD CAPTURADO:', {
      plan: state.planId,
      total: total,
      currency: isCOP ? 'COP' : 'USD',
      method: selectedMethod,
      client: { email: state.email, nombre: state.nombre, apellido: state.apellido, telefono: state.telefono, ciudad: state.ciudad, pais: state.pais, nit: state.nit }
    });

    setPayLoading(true);

    // Redirigir a página de gracias con estado pending_manual
    setTimeout(function() {
      setPayLoading(false);
      window.location.href = CONFIG.MANUAL_SUCCESS_URL +
        '&plan=' + encodeURIComponent(state.planId) +
        '&method=' + encodeURIComponent(selectedMethod) +
        '&total=' + total +
        '&currency=' + (isCOP ? 'COP' : 'USD');
    }, 1000);
  }

  /* ---------- INIT ---------- */
  function init() {
    clearCheckoutLS();

    if (!loadPlanFromURL()) {
      window.location.replace(CONFIG.LANDING_URL);
      return;
    }

    savePlanToLS();
    restoreForm();
    renderPlan();

    // Eventos
    $('#pais').addEventListener('change', onPaisChange);
    $('#bump-check').addEventListener('change', function() { state.bump = this.checked; renderTotals(); });

    // Manual payment init
    initManualPayment();

    // Pay buttons
    $$('.btn-pay').forEach(function(btn) { btn.addEventListener('click', onPayClick); });

    // Resumen toggle mobile
    $('#summary-toggle').addEventListener('click', function() {
      var card = $('.summary-card');
      card.classList.toggle('collapsed');
      this.setAttribute('aria-expanded', !card.classList.contains('collapsed'));
    });

    attachFormListeners();
    // Habilitar botón de pago (modo manual no requiere widget)
    $$('.btn-pay').forEach(function(b) { b.disabled = false; });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();