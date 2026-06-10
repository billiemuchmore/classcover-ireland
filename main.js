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
  var WEBINAR_URL = 'https://classcover.webinargeek.com/classcover-ireland-launch-info-session-for-schools-subs-and-snas';
  // Event ends 25 Jun 2026 21:00 IST (IST = UTC+1) → 20:00 UTC
  var WEBINAR_EXPIRY = Date.UTC(2026, 5, 25, 20, 0, 0);

  if (!localStorage.getItem('webinar-popup-dismissed') &&
      new Date().getTime() < WEBINAR_EXPIRY) {
    setTimeout(showWebinarPopup, 10000);
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
          '<img src="images/webinar-launch-session.png" alt="ClassCover Ireland Launch Information Session" loading="lazy" />' +
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

    popup.querySelector('.webinar-popup-close').addEventListener('click', function () {
      dismissWebinarPopup(popup);
    });

    // Dismiss when the register link is clicked too
    popup.querySelectorAll('a[href^="https"]').forEach(function (link) {
      link.addEventListener('click', function () {
        dismissWebinarPopup(popup);
      });
    });

    popup.addEventListener('click', function (e) {
      if (e.target === popup) dismissWebinarPopup(popup);
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        dismissWebinarPopup(popup);
        document.removeEventListener('keydown', onKey);
      }
    });
  }

  function dismissWebinarPopup(popup) {
    popup.classList.remove('is-visible');
    localStorage.setItem('webinar-popup-dismissed', '1');
    setTimeout(function () { popup.remove(); }, 300);
  }

})();
