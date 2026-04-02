/* ============================================================
   ClassCover Ireland — main.js
   Vanilla JS only. No jQuery.
   ============================================================ */

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
  // ----------------------------------------------------------
  if (!localStorage.getItem('au-popup-dismissed')) {
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.country_code === 'AU') {
          setTimeout(showAuPopup, 3000);
        }
      })
      .catch(function () {}); // fail silently — never block the page
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

})();
