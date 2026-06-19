/* ============================================================
   ClassCover Ireland — main.js
   Vanilla JS only. No jQuery.
   ============================================================ */

// ----------------------------------------------------------
// Google Tag Manager — auto-inject if not already in page
// ----------------------------------------------------------
(function () {
  if (!document.querySelector('script[src*="gtm.js?id=GTM-N4NPQXVQ"]')) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = document.getElementsByTagName('script')[0];
    var j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-N4NPQXVQ';
    f.parentNode.insertBefore(j, f);
  }
})();

// ----------------------------------------------------------
// CookieYes consent — auto-inject if not already in page (fallback).
// The hardcoded head snippet is preferred (it loads earlier and gates
// GTM/GA from first paint); this is a safety net so a page that forgets
// it still surfaces a consent banner.
// ----------------------------------------------------------
(function () {
  if (!document.getElementById('cookieyes')) {
    var s = document.createElement('script');
    s.id = 'cookieyes';
    s.type = 'text/javascript';
    s.src = 'https://cdn-cookieyes.com/client_data/10929c6c8f533925aae98aa2a8da772b/script.js';
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(s, first);
  }
})();

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Hamburger menu
  // ----------------------------------------------------------
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      const isOpen = drawer.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close drawer when a link inside it is clicked
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close drawer on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------------------------------------
  // FAQ accordion
  // ----------------------------------------------------------
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');

      // Close all open items
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open the clicked item if it was closed
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ----------------------------------------------------------
  // Smooth scroll for anchor links (supplements CSS scroll-behavior
  // for browsers that don't support it, and handles nav offset)
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  // ----------------------------------------------------------
  // Australia geolocation popup
  // Country is set as a cookie by Vercel Edge Middleware (middleware.ts)
  // from the x-vercel-ip-country header. No external fetch needed.
  // ----------------------------------------------------------
  if (!localStorage.getItem('au-popup-dismissed')) {
    var match = document.cookie.match(/(?:^|;\s*)visitor-country=([^;]+)/);
    if (match && match[1] === 'AU') {
      setTimeout(showAuPopup, 3000);
    }
  }

  function showAuPopup() {
    var popup = document.createElement('div');
    popup.className = 'au-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Visit ClassCover Australia');
    popup.innerHTML =
      '<div class="au-popup-box">' +
        '<button class="au-popup-close" aria-label="Close">&#x2715;</button>' +
        '<div class="au-popup-flag">🇦🇺</div>' +
        '<h3>Looks like you\'re in Australia</h3>' +
        '<p>You\'re on the ClassCover Ireland site. The Australian site might be what you\'re looking for.</p>' +
        '<a href="https://www.classcover.com.au/" target="_blank" rel="noopener" class="btn">Go to ClassCover Australia</a>' +
      '</div>';
    document.body.appendChild(popup);

    requestAnimationFrame(function () {
      popup.classList.add('is-visible');
    });

    popup.querySelector('.au-popup-close').addEventListener('click', function () {
      dismissAuPopup(popup);
    });

    popup.addEventListener('click', function (e) {
      if (e.target === popup) dismissAuPopup(popup);
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        dismissAuPopup(popup);
        document.removeEventListener('keydown', onKey);
      }
    });
  }

  function dismissAuPopup(popup) {
    popup.classList.remove('is-visible');
    localStorage.setItem('au-popup-dismissed', '1');
    setTimeout(function () { popup.remove(); }, 300);
  }

  // ----------------------------------------------------------
  // Webinar promo popup — Ireland Launch Information Session
  // Thurs 25 June 2026, 8pm IST. Fires 10s after load, once per
  // visitor (until dismissed), and stops showing after the event.
  // ----------------------------------------------------------
  var WEBINAR_URL = 'https://www.classcoverapp.ie/info-session/';
  // Event ends 25 Jun 2026 21:00 IST (IST = UTC+1) → 20:00 UTC
  var WEBINAR_EXPIRY = Date.UTC(2026, 5, 25, 20, 0, 0);

  if (!localStorage.getItem('webinar-popup-dismissed') &&
      !document.querySelector('.ty-webinar-card') &&
      !/^\/info-session(\/|$)/.test(location.pathname) &&
      new Date().getTime() < WEBINAR_EXPIRY) {
    if (localStorage.getItem('webinar-popup-minimized')) {
      showWebinarBanner();
    } else {
      setTimeout(showWebinarPopup, 10000);
    }
  }

  function showWebinarPopup() {
    // Don't stack on top of the Australia popup if it's showing
    if (document.querySelector('.au-popup')) return;

    var popup = document.createElement('div');
    popup.className = 'webinar-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'ClassCover Ireland launch information session');
    popup.innerHTML =
      '<div class="webinar-popup-box">' +
        '<button class="webinar-popup-close" aria-label="Close">&#x2715;</button>' +
        '<a href="' + WEBINAR_URL + '" target="_blank" rel="noopener" class="webinar-popup-img">' +
          '<img src="/images/webinar-launch-session.png" alt="ClassCover Ireland Launch Information Session" loading="lazy" />' +
        '</a>' +
        '<div class="webinar-popup-body">' +
          '<p class="webinar-popup-eyebrow">Free live session</p>' +
          '<h3>Join us live: a first look at ClassCover for Ireland</h3>' +
          '<p>Peek inside ClassCover, see what we\'re building for Irish schools, subs and SNAs, and ask us anything live.</p>' +
          '<p class="webinar-popup-when"><strong>Thursday 25 June, 8pm IST</strong></p>' +
          '<a href="' + WEBINAR_URL + '" target="_blank" rel="noopener" class="btn">Register free</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(popup);

    requestAnimationFrame(function () {
      popup.classList.add('is-visible');
    });

    // Closing the popup (X, backdrop, Escape, or clicking through to register)
    // minimises it to a small banner rather than dismissing it for good.
    popup.querySelector('.webinar-popup-close').addEventListener('click', function () {
      minimizeWebinarPopup(popup);
    });

    popup.querySelectorAll('a[href^="https"]').forEach(function (link) {
      link.addEventListener('click', function () {
        minimizeWebinarPopup(popup);
      });
    });

    popup.addEventListener('click', function (e) {
      if (e.target === popup) minimizeWebinarPopup(popup);
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        minimizeWebinarPopup(popup);
        document.removeEventListener('keydown', onKey);
      }
    });
  }

  function minimizeWebinarPopup(popup) {
    popup.classList.remove('is-visible');
    localStorage.setItem('webinar-popup-minimized', '1');
    setTimeout(function () {
      popup.remove();
      showWebinarBanner();
    }, 300);
  }

  function showWebinarBanner() {
    if (document.querySelector('.webinar-banner')) return;

    var banner = document.createElement('div');
    banner.className = 'webinar-banner';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'ClassCover Ireland launch information session');
    banner.innerHTML =
      '<div class="webinar-banner-text">' +
        '<strong>Free live session &middot; Thu 25 June, 8pm</strong>' +
        '<span>A first look at ClassCover for Ireland</span>' +
      '</div>' +
      '<a href="' + WEBINAR_URL + '" target="_blank" rel="noopener" class="webinar-banner-btn">Register free</a>' +
      '<button class="webinar-banner-close" aria-label="Dismiss">&#x2715;</button>';
    document.body.appendChild(banner);

    setTimeout(function () {
      banner.classList.add('is-visible');
    }, 50);

    banner.querySelector('.webinar-banner-close').addEventListener('click', function () {
      dismissWebinarBanner(banner);
    });
    banner.querySelector('.webinar-banner-btn').addEventListener('click', function () {
      dismissWebinarBanner(banner);
    });
  }

  function dismissWebinarBanner(banner) {
    banner.classList.remove('is-visible');
    localStorage.setItem('webinar-popup-dismissed', '1');
    localStorage.removeItem('webinar-popup-minimized');
    setTimeout(function () { banner.remove(); }, 400);
  }

})();

// ----------------------------------------------------------
// Conversion tracking — EOI Typeform popups + GA4 + Meta Pixel
// Fires ONE conversion per genuine EOI completion, on the page
// where the visitor (and their ad UTMs) actually are — not on a
// thank-you-page view. Meta Pixel is consent-gated via CookieYes;
// GA4 rides the existing CookieYes Consent Mode setup.
// ----------------------------------------------------------
(function () {
  'use strict';

  var META_PIXEL_ID = '2735393030169285';

  // Live Typeform vanity IDs (as linked in the HTML) -> embed form id + segment.
  // Only these two EOI forms are turned into popups; other Typeforms
  // (contact message, data-rights, infopack, calculator) are left alone.
  // NOTE: createPopup() needs the FORM id (the vanity id in the form URL,
  // rtcon.typeform.com/to/<id>), NOT the long data-tf-live embed id — the
  // latter loads Typeform's marketing page instead of the form.
  var FORMS = {
    EHewmpE4: { id: 'EHewmpE4', type: 'school_pilot', name: 'Ireland Schools Pilot' },
    ipkaJI47: { id: 'ipkaJI47', type: 'waitlist',     name: 'Ireland Waitlist' }
  };

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  // --- Capture UTMs, persist across internal navigation (sessionStorage) ---
  function captureUtms() {
    var params = new URLSearchParams(window.location.search);
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem('cc_utms') || '{}'); } catch (e) {}
    var out = {}, found = false;
    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { out[k] = v; found = true; }
    });
    if (found) {
      try { sessionStorage.setItem('cc_utms', JSON.stringify(out)); } catch (e) {}
      return out;
    }
    return stored;
  }
  var UTMS = captureUtms();

  // --- Consent: has the visitor accepted the "advertisement" category? ---
  function adConsentGranted() {
    var m = document.cookie.match(/cookieyes-consent=([^;]+)/);
    return !!m && /advertisement:yes/.test(decodeURIComponent(m[1]));
  }

  // --- Meta Pixel: load + base PageView only once ad consent exists ---
  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded || !adConsentGranted()) return;
    pixelLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  if (adConsentGranted()) loadPixel();
  document.addEventListener('cookieyes_consent_update', loadPixel);

  // --- Fire the conversion once, to GA4 + Meta, with a shared event id ---
  function newEventId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'eoi-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
  }
  function fireConversion(cfg) {
    var eventId = newEventId();

    // GA4 — keep the event name "conversion" (the dashboard keys on it).
    // CookieYes Consent Mode adjusts cookie use automatically.
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        event_category: 'form',
        event_label: 'eoi_' + cfg.type,
        signup_type: cfg.type,
        event_id: eventId
      });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'eoi_conversion', signup_type: cfg.type, event_id: eventId });

    // Meta — only when the advertisement category is consented.
    if (adConsentGranted()) {
      loadPixel();
      if (window.fbq) {
        window.fbq('track', 'CompleteRegistration',
          { content_name: cfg.name },
          { eventID: eventId });
      }
    }
  }

  // --- Typeform popup CSS. The next/embed SDK does NOT auto-inject its
  //     popup stylesheet when invoked programmatically (createPopup). Without
  //     it the popup opens as a tiny unstyled iframe while still locking page
  //     scroll — i.e. an invisible form on a frozen page. Load it explicitly. ---
  function ensurePopupCss() {
    if (document.querySelector('link[href*="embed.typeform.com/next/css/popup.css"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://embed.typeform.com/next/css/popup.css';
    document.head.appendChild(l);
  }

  // --- Typeform embed SDK loader (don't double-load: infopack/calculator already use it) ---
  function withEmbedSdk(cb) {
    ensurePopupCss();
    if (window.tf && window.tf.createPopup) return cb();
    var existing = document.querySelector('script[src*="embed.typeform.com/next/embed.js"]');
    if (existing) {
      var poll = setInterval(function () {
        if (window.tf && window.tf.createPopup) { clearInterval(poll); cb(); }
      }, 100);
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://embed.typeform.com/next/embed.js';
    s.async = true;
    s.onload = cb;
    document.head.appendChild(s);
  }

  // --- Rewire EOI links into popups that fire the conversion on submit ---
  function wirePopups() {
    var links = document.querySelectorAll('a[href*="typeform.com/to/"]');
    Array.prototype.forEach.call(links, function (a) {
      var m = (a.getAttribute('href') || '').match(/typeform\.com\/to\/([A-Za-z0-9]+)/);
      var cfg = m && FORMS[m[1]];
      if (!cfg) return; // only our two EOI forms
      a.addEventListener('click', function (e) {
        e.preventDefault();
        withEmbedSdk(function () {
          if (!a._ccPopup) {
            a._ccPopup = window.tf.createPopup(cfg.id, {
              hidden: UTMS,
              onSubmit: function () { fireConversion(cfg); }
            });
          }
          a._ccPopup.open();
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wirePopups);
  } else {
    wirePopups();
  }

  // --- Webinar registration conversion ---
  // The /info-session/registered/ page is reached only via WebinarGeek's
  // post-sign-up redirect, so landing there = a completed registration.
  // DELIBERATELY uses its OWN event names (GA4 "webinar_registration", Meta
  // "Schedule") so webinar regs are NOT lumped into the main EOI sign-up
  // conversion ("conversion" / "CompleteRegistration"). Fires once per session
  // so a refresh doesn't double-count. Base Meta PageView already builds the
  // retargeting audience on this page.
  function fireWebinarConversion() {
    if (!/^\/info-session\/registered(\/|$)/.test(location.pathname)) return;
    try {
      if (sessionStorage.getItem('cc_webinar_conv')) return;
      sessionStorage.setItem('cc_webinar_conv', '1');
    } catch (e) {}
    var eventId = newEventId();
    // GA4 — distinct event name; mark "webinar_registration" as a key event
    // in GA4 if you want it counted as a conversion.
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'webinar_registration', {
        event_category: 'webinar',
        event_label: 'ireland_info_session',
        signup_type: 'webinar',
        event_id: eventId
      });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'webinar_registration', signup_type: 'webinar', event_id: eventId });
    // Meta — "Schedule" (registered for a timed event), distinct from the EOI
    // "CompleteRegistration". Consent-gated; shares event_id with GA4.
    if (adConsentGranted()) {
      loadPixel();
      if (window.fbq) {
        window.fbq('track', 'Schedule',
          { content_name: 'Ireland Info Session' },
          { eventID: eventId });
      }
    }
  }
  fireWebinarConversion();
})();
