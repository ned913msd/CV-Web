/* ================================================================
   ALFA & OMEGA — THANK YOU PAGE (con soporte para pago manual pendiente)
================================================================ */

(function () {
  'use strict';

  var CONFIG = {
    LS_PLAN: 'ned_checkout_plan',
    LS_UPSELL: 'ned_upsell_accepted',
    LS_ORDER_ID: 'ned_order_id',
    UPSELL_DURATION: 15 * 60,
    UPSELL_PRICE: 49,
    UPSELL_OLD_PRICE: 150,
    LANDING_URL: 'index.html',
    BRIEFING_URL: '#',
    CALENDLY_URL: '#',
    SUPPORT_EMAIL: 'contacto.nedbustamante@gmail.com',
    SUPPORT_WHATSAPP: '573003491413'
  };

  var PLANS = {
    starter:    { name: 'Plan Starter',    details: 'Landing page de 1 sección · Copywriting · Formulario', priceUSD: 147, priceCOP: 600000 },
    professional: { name: 'Plan Professional', details: 'Landing page completa 8 secciones · Copywriting · SEO · Email', priceUSD: 357, priceCOP: 1450000 },
    enterprise: { name: 'Plan Enterprise', details: '3 Landings + A/B Testing + Dashboard + Consultoría', priceUSD: 635, priceCOP: 2600000 }
  };

  function moneyUSD(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
  function moneyCOP(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }

  function $(sel) { return document.querySelector(sel); }
  function getParam(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }

  /* ---------- LOAD PLAN ---------- */
  function loadPlan() {
    var plan = { id: '', name: '', details: '', priceUSD: 0, priceCOP: 0 };

    // 1) URL params: ?plan=professional&price=357
    var planRaw = getParam('plan');
    var priceRaw = parseFloat(getParam('price'));
    if (planRaw && PLANS[planRaw] && !isNaN(priceRaw) && priceRaw > 0) {
      var p = PLANS[planRaw];
      plan.id = planRaw; plan.name = p.name; plan.details = p.details;
      plan.priceUSD = priceRaw; plan.priceCOP = p.priceCOP;
      savePlan(plan);
      return plan;
    }

    // 2) localStorage fallback
    try {
      var saved = JSON.parse(localStorage.getItem('ned_checkout_plan') || 'null');
      if (saved && saved.name && saved.priceUSD > 0) {
        plan.id = saved.id || 'plan';
        plan.name = saved.name; plan.details = saved.details || '';
        plan.priceUSD = saved.priceUSD; plan.priceCOP = saved.priceCOP;
        return plan;
      }
    } catch (e) {}

    return null;
  }

  function savePlan(plan) {
    try { localStorage.setItem('ned_checkout_plan', JSON.stringify(plan)); } catch (e) {}
  }

  function generateOrderId() {
    var num = Math.floor(10000 + Math.random() * 89999);
    return 'LP-' + num;
  }

  function track(event, value, currency) {
    try { if (typeof gtag === 'function') gtag('event', event, { value: value || 0, currency: currency || 'USD', event_category: 'ecommerce' }); } catch (e) {}
    try { if (typeof fbq === 'function') fbq('track', event, { value: value || 0, currency: currency || 'USD' }); } catch (e) {}
  }

  function moneyUSD(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
  function moneyCOP(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }
  function getParam(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }

  /* ---------- RENDER ---------- */
  function renderPlan(plan, isManualPending) {
    var isCOP = getParam('currency') === 'COP' || !getParam('currency'); // default COP
    var priceMain = isCOP ? moneyCOP(plan.priceCOP) : moneyUSD(plan.priceUSD);

    $('#plan-name').textContent = plan.name;
    $('#plan-details').textContent = plan.details || 'Landing page de alta conversión';
    $('#plan-price').textContent = priceMain;
    $('#project-id').textContent = '#' + generateOrderId();

    // Precio upsell
    var upsellPrice = isCOP ? moneyCOP(200000) : moneyUSD(49); // $49 USD / $200k COP
    $('#upsell-price').textContent = isCOP ? 'Solo $200.000 COP' : 'Solo $49 USD';

    // Links
    $('#support-email').setAttribute('href', 'mailto:contacto.nedbustamante@gmail.com');
    $('#briefing-btn').setAttribute('href', '#');
    $('#calendly-link').setAttribute('href', '#');
    $('#support-whatsapp').setAttribute('href', 'https://wa.me/573003491413');

    // Si es pago manual pendiente: ajustar UI
    if (getParam('status') === 'pending_manual') {
      applyPendingManualUI();
    }
  }

  function applyPendingManualUI() {
    // 1. Cambiar hero
    var h1 = $('.confirm h1');
    if (h1) h1.textContent = '¡Pedido Recibido! ⏳';

    var sub = $('.confirm-sub');
    if (sub) sub.textContent = 'Tu pedido ha sido registrado. Falta confirmar el pago para iniciar.';

    var msg = $('.confirm-msg');
    if (msg) msg.textContent = 'Te contactaremos en menos de 2 horas hábiles para coordinar el pago y dar inicio a tu proyecto.';

    // Badge en hero
    var heroDiv = $('.confirm');
    if (heroDiv && !heroDiv.querySelector('.pending-badge')) {
      var badge = document.createElement('div');
      badge.className = 'pending-badge';
      badge.innerHTML = '⏳ <strong>Pago Pendiente</strong> — Te contactamos en < 2h hábiles';
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:10px 16px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);border-radius:8px;color:#F59E0B;font-size:14px;font-weight:600;';
      heroDiv.appendChild(badge);
    }

    // 2. Ocultar upsell (no aplica hasta confirmar pago)
    var upsell = $('#upsell');
    if (upsell) upsell.style.display = 'none';

    // 3. Actualizar timeline
    var timelineItems = $$('.timeline-item');
    if (timelineItems.length >= 1) {
      timelineItems[0].innerHTML = '<div class="timeline-ico">⏳</div><div class="timeline-body"><h3>Pago Pendiente</h3><p>Esperando confirmación de tu pago. Te contactamos en < 2h.</p></div>';
      timelineItems[0].classList.remove('done');
      timelineItems[0].classList.add('pending');
    }
    if (timelineItems.length >= 2) {
      timelineItems[1].classList.remove('done');
    }

    // 4. Agregar box de instrucciones de pago
    addPaymentInstructions();

    // 5. Deshabilitar upsell buttons
    var upsellBtn = $('#upsell-btn');
    if (upsellBtn) { upsellBtn.disabled = true; upsellBtn.style.opacity = '0.5'; upsellBtn.style.cursor = 'not-allowed'; }
    var upsellDecline = $('#upsell-decline');
    if (upsellDecline) upsellDecline.style.display = 'none';

    // 6. Cambiar texto del botón briefing
    var briefingBtn = $('#briefing-btn');
    if (briefingBtn) briefingBtn.textContent = 'Ver Instrucciones de Pago →';

    // 7. Mostrar métodos de pago en sección de valor
    addPaymentMethodsToValueSection();
  }

  function addPaymentInstructions() {
    var stepsSection = $('.steps');
    if (!stepsSection) return;

    var existing = stepsSection.querySelector('.payment-instructions-box');
    if (existing) return;

    var box = document.createElement('div');
    box.className = 'payment-instructions-box';
    box.style.cssText = 'background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:24px;margin:24px 0;';
    box.innerHTML = `
      <h3 style="font-family:'Space Grotesk',sans-serif;color:#F59E0B;margin-bottom:16px;display:flex;align-items:center;gap:8px;">💳 <span>Instrucciones para completar tu pago</span></h3>
      <p style="color:#9CA3AF;margin-bottom:16px;">Tu pedido está <strong>reservado</strong>. Para que iniciemos el diseño, completa el pago por uno de estos medios:</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px;">
        <div style="background:#1A1A1A;border:1px solid #374151;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;margin-bottom:8px;">🏦</div>
          <strong style="color:#FFF;">Transferencia / Nequi / Daviplata</strong>
          <p style="font-size:12px;color:#9CA3AF;margin:8px 0 0;">Bancolombia • Ahorros • ****1234<br>Titular: Alfa & Omega - David Bustamante</p>
          <button class="btn-download" style="margin-top:12px;padding:8px 16px;font-size:12px;" onclick="copyAccount()">📋 Copiar datos</p>
        </div>
        <div style="background:#1A1A1A;border:1px solid #374151;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;margin-bottom:8px;">🅿️</div>
          <strong style="color:#FFF;">PayPal (con comisión)</strong>
          <p style="font-size:12px;color:#9CA3AF;margin:8px 0 0;">Te enviamos link de pago a tu email<br>+ 4.5% comisión</p>
        </div>
        <div style="background:#1A1A1A;border:1px solid #374151;border-radius:10px;padding:16px;text-align:center;">
          <div style="font-size:28px;margin-bottom:8px;">₿</div>
          <strong style="color:#FFF;">USDT/USDC (Polygon/TRC20)</strong>
          <p style="font-size:12px;color:#9CA3AF;margin:8px 0 0;"><strong>5% descuento</strong> aplicado<br>Sin comisiones</p>
        </div>
      </div>
      <div style="background:rgba(16,185,129,0.1);border:1px solid #10B981;border-radius:8px;padding:16px;">
        <strong style="color:#10B981;">✅ Próximos pasos:</strong>
        <ol style="margin:12px 0 0;padding-left:20px;color:#9CA3AF;font-size:14px;line-height:1.8;">
          <li>Realiza el pago por tu medio preferido</li>
          <li>Envía comprobante a <a href="mailto:pagos@ned-landingpages.com" style="color:#10B981;">pagos@ned-landingpages.com</a> o WhatsApp <a href="https://wa.me/573003491413" target="_blank" style="color:#10B981;">+57 300 349 1413</a></li>
          <li>Asunto: <code>Pago Alfa & Omega - [Tu Nombre]</code></li>
          <li>Confirmamos en <strong>2h hábiles</strong> y empieza tu proyecto</li>
        </ol>
      </div>
    `;
    stepsSection.insertBefore(box, stepsSection.querySelector('.timeline'));
  }

  function generateOrderId() { var num = Math.floor(10000 + Math.random() * 89999); return 'LP-' + num; }

  function track(event, value, currency) {
    try { if (typeof gtag === 'function') gtag('event', event, { value: value || 0, currency: currency || 'USD', event_category: 'ecommerce' }); } catch (e) {}
    try { if (typeof fbq === 'function') fbq('track', event, { value: value || 0, currency: currency || 'USD' }); } catch (e) {}
  }

  function moneyUSD(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
  function moneyCOP(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }
  function getParam(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* ---------- UPSELL (disabled for pending_manual) ---------- */
  function revealUpsell() { /* disabled for pending */ }
  function acceptUpsell() { /* disabled */ }
  function declineUpsell() { /* disabled */ }

  /* ---------- CHECKLIST PDF ---------- */
  function generateChecklistPDF() {
    var items = [
      'Define tu oferta irresistible','Segmenta tu audiencia ideal','Crea 3 variantes de creativo',
      'Escribe hooks que enganchen en 2 segundos','Optimiza tu URL para conversión',
      'Configura tu pixel de conversión','Establece tu presupuesto diario inicial',
      'Programa horarios de mayor actividad','Configura el remarketing desde el día 1',
      'Mide, analiza y escala lo que funciona'
    ];
    var lines = ['CHECKLIST DE CAMPAÑAS DE ADS - ALFA & OMEGA','-------------------------------------------'];
    items.forEach(function (item, i) { lines.push((i + 1) + '. [ ] ' + item); });
    lines.push('','Alfa & Omega - Landing Pages de Alta Conversión');
    var blob = new Blob([lines.join('\r\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = 'checklist-campanas-ads-AlfaOmega.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function generateOrderId() { var num = Math.floor(10000 + Math.random() * 89999); return 'LP-' + num; }

  function track(event, value, currency) {
    try { if (typeof gtag === 'function') gtag('event', event, { value: value || 0, currency: currency || 'USD', event_category: 'ecommerce' }); } catch (e) {}
    try { if (typeof fbq === 'function') fbq('track', event, { value: value || 0, currency: currency || 'USD' }); } catch (e) {}
  }

  function moneyUSD(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n); }
  function moneyCOP(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n); }
  function getParam(name) { try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; } }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* ---------- INIT ---------- */
  function init() {
    var plan = loadPlan();
    try { localStorage.removeItem('ned_checkout_product'); localStorage.removeItem('ned_checkout_form'); } catch (e) {}

    if (!plan) { window.location.replace('index.html'); return; }

    renderPlan(plan);

    var orderId = null;
    try { orderId = localStorage.getItem('ned_order_id'); } catch (e) {}
    if (!orderId) { orderId = 'LP-'+ Math.floor(10000 + Math.random() * 89999); try { localStorage.setItem('ned_order_id', orderId); } catch (e) {} }
    $('#project-id').textContent = '#' + orderId;

    track('service_purchased', plan.priceUSD);

    // Countdown + reveal (solo si no es pending_manual)
    if (getParam('status') !== 'pending_manual') {
      startCountdown();
      revealUpsell();
    }

    // Eventos upsell (solo si no pending)
    if (getParam('status') !== 'pending_manual') {
      $('#upsell-btn').addEventListener('click', acceptUpsell);
      $('#upsell-decline').addEventListener('click', declineUpsell);
    }

    $('#download-checklist').addEventListener('click', generateChecklistPDF);
  }

  /* ---------- COUNTDOWN / UPSELL (disabled for pending) ---------- */
  function startCountdown() {
    var el = $('#countdown');
    var remaining = 15 * 60;
    var interval = setInterval(function () {
      remaining--;
      if (remaining <= 0) { clearInterval(interval); el.textContent = '00:00'; el.classList.add('danger'); return; }
      var mm = String(Math.floor(remaining / 60)).padStart(2, '0');
      var ss = String(remaining % 60).padStart(2, '0');
      el.textContent = mm + ':' + ss;
      if (remaining <= 120) el.classList.add('danger');
    }, 1000);
  }

  function revealUpsell() { var card = $('#upsell').querySelector('.upsell-card'); setTimeout(function () { card.classList.add('revealed'); }, 1500); }
  function acceptUpsell() { /* disabled */ }
  function declineUpsell() { var card = $('#upsell').querySelector('.upsell-card'); card.classList.add('rejected'); setTimeout(function () { card.classList.add('gone'); }, 500); }

  function generateChecklistPDF() {
    var items = ['Define tu oferta irresistible','Segmenta tu audiencia ideal','Crea 3 variantes de creativo','Escribe hooks que enganchen en 2 segundos','Optimiza tu URL para conversión','Configura tu pixel de conversión','Establece tu presupuesto diario inicial','Programa horarios de mayor actividad','Configura el remarketing desde el día 1','Mide, analiza y escala lo que funciona'];
    var lines = ['CHECKLIST DE CAMPAÑAS DE ADS - ALFA & OMEGA','-----------------------------------'];
    items.forEach(function (item, i) { lines.push((i + 1) + '. [ ] ' + item); });
    lines.push('','Alfa & Omega - Landing Pages de Alta Conversión');
    var blob = new Blob([lines.join('\r\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'checklist-campanas-ads-alfa-omega.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();