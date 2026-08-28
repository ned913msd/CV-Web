/* ================================================================
   NED — CHECKOUT MERCADO PAGO
   Integración Wallet Widget + Validación + Preferencias
================================================================ */

(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  var CONFIG = {
    // ⚠️ REEMPLAZA CON TU PUBLIC KEY REAL DE MERCADO PAGO
    // La obtienes en: https://www.mercadopago.com.co/developers/panel/applications
    MP_PUBLIC_KEY: 'TEST-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', // Sandbox
    // MP_PUBLIC_KEY: 'APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', // Producción

    // Endpoint para crear preferencia (DEBE SER BACKEND/SERVERLESS)
    // Ejemplo: Netlify Function, Vercel API, Cloudflare Worker, tu propio backend
    PREFERENCE_ENDPOINT: '/api/create-preference', // O '/.netlify/functions/create-preference'

    // URLs de retorno
    SUCCESS_URL: 'gracias.html?status=approved',
    FAILURE_URL: 'checkout.html?error=failed',
    PENDING_URL: 'gracias.html?status=pending',

    // Planes
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
    paymentMethod: 'card' // card, pse, cash
  };

  var mp = null;
  var wallet = null;
  var preferenceId = null;

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
    // Fallback localStorage
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

    $('#plan-price').textContent = priceMain; // if exists elsewhere
    renderTotals();
  }

  function renderTotals() {
    var isCOP = state.pais === 'CO';
    var sub = isCOP ? state.planPriceCOP : state.planPriceUSD;
    var bump = state.bump ? (isCOP ? CONFIG.UPSELL.priceCOP : CONFIG.UPSELL.priceUSD) : 0;
    var total = sub + bump;

    var fmt = isCOP ? fmtCOP : fmtUSD;
    $('#t-subtotal').textContent = fmt(sub);
    $('#t-bump').textContent = fmt(bump);
    $('#t-total').textContent = fmt(total);
    $('#summary-toggle-total').textContent = fmt(total);
    $('#mobile-total').textContent = fmt(total);

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
    // Re-inicializar widget si ya cargó (para que cambie moneda/métodos)
    if (wallet) initMercadoPagoWidget();
  }

  /* ---------- MERCADO PAGO INTEGRATION ---------- */
  function initMercadoPago() {
    if (typeof MercadoPago === 'undefined') {
      console.error('MercadoPago SDK no cargado');
      showMPError('SDK de Mercado Pago no disponible');
      return;
    }

    // Validar Public Key
    if (!CONFIG.MP_PUBLIC_KEY || CONFIG.MP_PUBLIC_KEY.includes('XXXXXXXX')) {
      console.warn('MP_PUBLIC_KEY no configurada. Usando modo demo.');
      showMPError('Configura tu MP_PUBLIC_KEY en checkout.js');
      return;
    }

    mp = new MercadoPago(CONFIG.MP_PUBLIC_KEY, { locale: 'es-CO' });

    // Renderizar wallet
    initMercadoPagoWidget();
  }

  function initMercadoPagoWidget() {
    if (!mp) return;

    var container = $('#wallet_container');
    var loading = $('#mp-loading');
    var errorEl = $('#mp-error');

    // Limpiar contenedor previo
    container.innerHTML = '';
    loading.classList.remove('hidden');
    errorEl.classList.add('hidden');

    // Crear preferencia ANTES de renderizar
    createPreference()
      .then(function(prefId) {
        preferenceId = prefId;
        wallet = mp.wallet({
          container: '#wallet_container',
          preferenceId: prefId,
          autoReturn: 'approved',
          theme: {
            elementsColor: '#F97316', // Naranja NED
            headerColor: '#0A0A0A'
          }
        });

        loading.classList.add('hidden');

        // Wallet events
        wallet.on('ready', function() { console.log('MP Wallet ready'); });
        wallet.on('error', function(err) { console.error('MP Wallet error:', err); showMPError('Error cargando métodos de pago'); });
      })
      .catch(function(err) {
        console.error('Error creando preferencia:', err);
        loading.classList.add('hidden');
        showMPError('Error creando orden de pago. ' + (err.message || 'Intenta de nuevo.'));
      });
  }

  function createPreference() {
    var items = [{
        id: state.planId,
        title: state.planName,
        description: state.planDetails,
        quantity: 1,
        unit_price: state.pais === 'CO' ? state.planPriceCOP : state.planPriceUSD,
        currency_id: state.pais === 'CO' ? 'COP' : 'USD'
      }];

      if (state.bump) {
        items.push({
          id: 'upsell_analytics',
          title: CONFIG.UPSELL.name,
          description: 'GA4 + Pixel FB + A/B Testing inicial',
          quantity: 1,
          unit_price: state.pais === 'CO' ? CONFIG.UPSELL.priceCOP : CONFIG.UPSELL.priceUSD,
          currency_id: state.pais === 'CO' ? 'COP' : 'USD'
        });
      }

      var payer = {
        email: state.email,
        name: state.nombre,
        surname: state.apellido,
        phone: { area_code: '', number: state.telefono.replace(/\D/g, '') },
        identification: state.nit ? { type: state.nit.length > 10 ? 'NIT' : 'CC', number: state.nit } : undefined
      };

      var preferenceData = {
        items: items,
        payer: payer,
        back_urls: {
          success: CONFIG.SUCCESS_URL,
          failure: CONFIG.FAILURE_URL,
          pending: CONFIG.PENDING_URL
        },
        auto_return: 'approved',
        binary_mode: true,
        statement_descriptor: 'NED Landing Pages',
        external_reference: 'ned_' + Date.now(),
        notification_url: getParam('webhook') || '' // Opcional: URL de tu webhook
      };

      // ⚠️ AQUÍ DEBES LLAMAR TU BACKEND PARA CREAR LA PREFERENCIA
      // El Access Token NO debe exponerse en frontend
      // Ejemplo con fetch a serverless function:
      return fetch(CONFIG.PREFERENCE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferenceData)
      })
      .then(function(res) {
        if (!res.ok) throw new Error('Error servidor: ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (!data.id) throw new Error('Respuesta inválida del servidor');
        return data.id; // preference_id
      })
      .catch(function(err) {
        // MODO DEMO: si falla el backend, crear preferencia mock para testing visual
        // ⚠️ SOLO PARA DESARROLLO - EN PRODUCCIÓN DEBE FALLAR
        if (CONFIG.MP_PUBLIC_KEY.includes('TEST') || CONFIG.MP_PUBLIC_KEY.includes('XXXX')) {
          console.warn('⚠️ MODO DEMO: Backend no disponible, usando preferencia simulada');
          // En modo demo, no podemos crear preferencia real sin backend
          // El widget no funcionará completamente sin preference_id real
          // Mostramos estado visual pero botón de pago no funcionará
          enablePayButtonDemo();
          return 'demo-preference-id';
        }
        throw err;
      });
  }

  function enablePayButtonDemo() {
    var btns = $$('.btn-pay');
    btns.forEach(function(b) { b.disabled = false; });
    $('#mp-loading').classList.add('hidden');
    // Mensaje visual de demo
    var container = $('#wallet_container');
    container.innerHTML = '<div style="padding:40px;text-align:center;color:#9CA3AF;"><p>🔧 <strong>Modo Demo</strong></p><p>Configura tu <code>MP_PUBLIC_KEY</code> y endpoint <code>/api/create-preference</code> para activar Mercado Pago real.</p><p style="margin-top:16px;font-size:13px;">Tarjetas test: 4509 9535 6623 3704 (Visa) / 5031 7557 3453 0604 (MC)</p></div>';
  }

  function showMPError(msg) {
    $('#mp-loading').classList.add('hidden');
    var err = $('#mp-error');
    err.querySelector('p').innerHTML = msg + ' <button type="button" id="mp-retry">Reintentar</button>';
    err.classList.remove('hidden');
  }

  /* ---------- PAY BUTTON ---------- */
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
    try { localStorage.setItem(CONFIG.LS_ORDER, JSON.stringify({ plan: state.planId, bump: state.bump, total: state.pais === 'CO' ? state.planPriceCOP + (state.bump ? CONFIG.UPSELL.priceCOP : 0) : state.planPriceUSD + (state.bump ? CONFIG.UPSELL.priceUSD : 0), currency: state.pais === 'CO' ? 'COP' : 'USD', ts: Date.now() })); } catch (e) {}

    setPayLoading(true);

    // Si hay wallet real, el usuario paga en el widget y MP redirige automáticamente
    // Si es demo, simulamos
    if (preferenceId && preferenceId !== 'demo-preference-id' && wallet) {
      // El usuario completa el pago en el widget, MP redirige a success_url
      // Aquí solo mostramos feedback
      setTimeout(function() { setPayLoading(false); }, 3000);
    } else {
      // Modo demo: simular redirección
      setTimeout(function() {
        setPayLoading(false);
        window.location.href = CONFIG.SUCCESS_URL + '&payment_id=demo_' + Date.now() + '&demo=true';
      }, 1500);
    }
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

    // Method selector visual (solo UI, MP maneja métodos reales)
    $$('.mp-method-card').forEach(function(card) {
      card.addEventListener('click', function() {
        $$('.mp-method-card').forEach(function(c) { c.classList.remove('active'); });
        card.classList.add('active');
        state.paymentMethod = card.dataset.method;
      });
    });

    // Pay buttons
    $$('.btn-pay').forEach(function(btn) { btn.addEventListener('click', onPayClick); });

    // MP retry
    $('#mp-retry').addEventListener('click', initMercadoPagoWidget);

    // Resumen toggle mobile
    $('#summary-toggle').addEventListener('click', function() {
      var card = $('.summary-card');
      card.classList.toggle('collapsed');
      this.setAttribute('aria-expanded', !card.classList.contains('collapsed'));
    });

    // Inicializar Mercado Pago
    initMercadoPago();
    attachFormListeners();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();