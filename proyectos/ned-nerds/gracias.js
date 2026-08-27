/* ================================================================
   NED — THANK YOU PAGE
   Lógica: validación de plan → confirmación → upsell → tracking
================================================================ */

(function () {
  'use strict';

  var CONFIG = {
    LS_PLAN: 'ned_checkout_plan',       // Plan comprado (lo escribe checkout/servicio)
    LS_UPSELL: 'ned_upsell_accepted',
    LS_ORDER_ID: 'ned_order_id',
    UPSELL_DURATION: 15 * 60,         // 15 minutos en segundos
    UPSELL_PRICE: 49,
    UPSELL_OLD_PRICE: 150,
    LANDING_URL: 'index.html',
    BRIEFING_URL: '#',                  // Reemplazar por URL del formulario real
    CALENDLY_URL: '#',                 // Reemplazar por URL de Calendly real
    SUPPORT_EMAIL: 'info@ned.co',
    SUPPORT_WHATSAPP: '573001234567'
  };

  /* ---------- HELPERS ---------- */
  function $(sel) { return document.querySelector(sel); }

  /* ---------- PLANS CATÁLOGO ---------- */
  var PLANS = {
    starter: {
      name: 'Plan Starter',
      details: 'Landing page de 1 sección · Diseño responsive · Formulario de contacto',
      price: 297
    },
    professional: {
      name: 'Plan Professional',
      details: 'Landing page completa de 8 secciones · Copywriting · SEO técnico',
      price: 597
    },
    enterprise: {
      name: 'Plan Enterprise',
      details: '3 landing pages · A/B Testing · Analytics avanzado · Consultoría',
      price: 997
    }
  };

  function money(n) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(n);
  }

  function getParam(name) {
    try { return new URLSearchParams(window.location.search).get(name); }
    catch (e) { return null; }
  }

  /* ---------- VALIDACIÓN DE SERVICIO ---------- */
  function loadPlan() {
    var plan = {
      id: '', name: '', details: '', price: 0
    };

    // 1) Parámetro directo: ?plan=professional&price=597
    var planRaw = getParam('plan');
    var priceRaw = parseFloat(getParam('price'));
    if (planRaw && PLANS[planRaw]) {
      plan.id = planRaw;
      plan.name = PLANS[planRaw].name;
      plan.details = PLANS[planRaw].details;
      plan.price = !isNaN(priceRaw) && priceRaw > 0 ? priceRaw : PLANS[planRaw].price;
    }

    if (plan.id) {
      savePlan(plan);
      return plan;
    }

    // 2) Respaldo en localStorage
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(CONFIG.LS_PLAN) || 'null'); } catch (e) {}
    if (saved && saved.name && saved.price > 0) {
      plan.id = saved.id || 'plan';
      plan.name = saved.name;
      plan.details = saved.details || (PLANS[saved.id] ? PLANS[saved.id].details : '');
      plan.price = saved.price;
      return plan;
    }

    return null;
  }

  function savePlan(plan) {
    try { localStorage.setItem(CONFIG.LS_PLAN, JSON.stringify(plan)); } catch (e) {}
  }

  /* ---------- GENERAR PROJECT ID ---------- */
  function generateOrderId() {
    var num = Math.floor(10000 + Math.random() * 89999);
    return 'LP-' + num;
  }

  /* ---------- TRACKING (GA4 + Meta Pixel) ---------- */
  function track(event, value, currency) {
    try {
      if (typeof gtag === 'function') {
        gtag('event', event, {
          value: value || 0,
          currency: currency || 'USD',
          event_category: 'ecommerce',
          non_interaction: false
        });
      }
    } catch (e) {}

    try {
      if (typeof fbq === 'function') {
        fbq('track', event, {
          value: value || 0,
          currency: currency || 'USD'
        });
      }
    } catch (e) {}
  }

  /* ---------- RENDER ---------- */
  function renderPlan(plan) {
    $('#plan-name').textContent = plan.name;
    $('#plan-details').textContent = plan.details || 'Landing page de alta conversión';
    $('#plan-price').textContent = money(plan.price);
    $('#project-id').textContent = '#' + generateOrderId();

    $('#upsell-price').textContent = 'Solo ' + money(CONFIG.UPSELL_PRICE);
    $('#support-email').setAttribute('href', 'mailto:' + CONFIG.SUPPORT_EMAIL);
    $('#briefing-btn').setAttribute('href', CONFIG.BRIEFING_URL);
    $('#calendly-link').setAttribute('href', CONFIG.CALENDLY_URL);
    $('#support-whatsapp').setAttribute('href', 'https://wa.me/' + CONFIG.SUPPORT_WHATSAPP);
  }

  /* ---------- COUNTDOWN ---------- */
  function startCountdown() {
    var el = $('#countdown');
    var remaining = CONFIG.UPSELL_DURATION;
    var interval = setInterval(function () {
      remaining--;
      if (remaining <= 0) {
        clearInterval(interval);
        el.textContent = '00:00';
        el.classList.add('danger');
        return;
      }
      var mm = String(Math.floor(remaining / 60)).padStart(2, '0');
      var ss = String(remaining % 60).padStart(2, '0');
      el.textContent = mm + ':' + ss;
      if (remaining <= 120) el.classList.add('danger');
    }, 1000);
  }

  /* ---------- UPSELL ---------- */
  function revealUpsell() {
    var card = $('#upsell').querySelector('.upsell-card');
    setTimeout(function () { card.classList.add('revealed'); }, 1500);
  }

  function acceptUpsell() {
    var btn = $('#upsell-btn');
    var text = btn.querySelector('.btn-text');
    var loading = btn.querySelector('.btn-loading');

    btn.disabled = true;
    text.classList.add('hidden');
    loading.classList.remove('hidden');

    setTimeout(function () {
      try {
        localStorage.setItem(CONFIG.LS_UPSELL, JSON.stringify({
          accepted: true,
          price: CONFIG.UPSELL_PRICE,
          ts: Date.now()
        }));
      } catch (e) {}

      track('upsell_accepted', CONFIG.UPSELL_PRICE);

      // Mostrar confirmación inline (o aquí se dispararía el cobro)
      var added = $('#upsell-added');
      added.classList.remove('hidden');
      $('#upsell-added-line').textContent = '+' + money(CONFIG.UPSELL_PRICE) + ' USD serán agregados a tu factura pendiente.';
      $('#upsell-btn').classList.add('hidden');
      $('#upsell-decline').classList.add('hidden');
    }, 1600);
  }

  function declineUpsell() {
    var card = $('#upsell').querySelector('.upsell-card');
    card.classList.add('rejected');
    setTimeout(function () { card.classList.add('gone'); }, 500);
    try { localStorage.setItem(CONFIG.LS_UPSELL, JSON.stringify({ accepted: false, ts: Date.now() })); } catch (e) {}
  }

  /* ---------- CHECKLIST PDF (generado en cliente) ---------- */
  function generateChecklistPDF() {
    var items = [
      'Define tu oferta irresistible',
      'Segmenta tu audiencia ideal',
      'Crea 3 variantes de creativo',
      'Escribe hooks que enganchen en 2 segundos',
      'Optimiza tu URL para conversión',
      'Configura tu pixel de conversión',
      'Establece tu presupuesto diario inicial',
      'Programa horarios de mayor actividad',
      'Configura el remarketing desde el día 1',
      'Mide, analiza y escala lo que funciona'
    ];
    var totalPrice = money(CONFIG.UPSELL_PRICE);

    var lines = [];
    lines.push('CHECKLIST DE CAMPAÑAS DE ADS - NED');
    lines.push('-----------------------------------');
    items.forEach(function (item, i) {
      lines.push((i + 1) + '. [ ] ' + item);
    });
    lines.push('');
    lines.push('Mejora tus resultados con el setup profesional GA4 + Pixel: ' + totalPrice);
    lines.push('NED - Landing Pages de Alta Conversión');

    var blob = new Blob([lines.join('\r\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'checklist-campanas-ads-NED.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- INIT ---------- */
  function init() {
    var plan = loadPlan();

    // SIEMPRE limpiar el plan comprado del localStorage del checkout (requisito)
    try {
      localStorage.removeItem('ned_checkout_product');
      localStorage.removeItem('ned_checkout_form');
    } catch (e) {}

    if (!plan) {
      // Sin servicio contratado → redirigir a la landing
      window.location.replace(CONFIG.LANDING_URL);
      return;
    }

    renderPlan(plan);

    // Order ID persistente (no regenerar al recargar)
    var orderId = null;
    try { orderId = localStorage.getItem(CONFIG.LS_ORDER_ID); } catch (e) {}
    if (!orderId) {
      orderId = 'LP-'+ Math.floor(10000 + Math.random() * 89999);
      try { localStorage.setItem(CONFIG.LS_ORDER_ID, orderId); } catch (e) {}
    }
    $('#project-id').textContent = '#' + orderId;

    // Tracking del servicio comprado (para restart tras upsell meta)
    track('service_purchased', plan.price);

    // Countdown + reveal
    startCountdown();
    revealUpsell();

    // Eventos upsell
    $('#upsell-btn').addEventListener('click', acceptUpsell);
    $('#upsell-decline').addEventListener('click', declineUpsell);

    // Checklist
    $('#download-checklist').addEventListener('click', generateChecklistPDF);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();