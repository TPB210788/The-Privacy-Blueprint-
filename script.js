/* ==========================================================================
   TomorrowKit — minimal vanilla JavaScript
   No analytics, no trackers, no cookies, no third-party scripts.
   Everything below is progressive enhancement: the page works without it.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a link on small screens.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setNav(false); }
    });

    // Escape closes the menu and returns focus to the button.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Reset state when the layout moves back to the desktop navigation.
    var wide = window.matchMedia('(min-width: 60rem)');
    var onChange = function (event) { if (event.matches) { setNav(false); } };
    if (wide.addEventListener) { wide.addEventListener('change', onChange); }
    else if (wide.addListener) { wide.addListener(onChange); }
  }

  /* ---- Footer year ------------------------------------------------------ */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---- Waitlist form ----------------------------------------------------
     The form posts straight to whatever endpoint is set in the HTML action
     attribute, so it also works with JavaScript switched off.

     >>> TO CONNECT THE FORM <<<
     Open index.html, find the form with id="waitlistForm" and replace
         action="REPLACE_WITH_FORM_ENDPOINT"
     with the endpoint from your provider, for example:
         action="https://formspree.io/f/xxxxxxx"     (Formspree)
         action="https://tally.so/r/xxxxxxx"         (Tally)
     Netlify Forms users: add  netlify  and  name="waitlist"  to the form tag
     instead, and remove the action attribute.

     While the placeholder is still in place, the code below blocks submission
     so that no data is ever sent to a broken or unintended endpoint.
     --------------------------------------------------------------------- */
  var PLACEHOLDER_ACTION = 'REPLACE_WITH_FORM_ENDPOINT';

  var form = document.getElementById('waitlistForm');
  var status = document.getElementById('formStatus');
  var email = document.getElementById('email');

  if (form && status && email) {
    var say = function (message, state) {
      status.textContent = message;
      status.className = 'form-status is-' + state;
    };

    var emailLooksValid = function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
    };

    form.addEventListener('submit', function (event) {
      var notConnected = form.getAttribute('action') === PLACEHOLDER_ACTION;

      if (!emailLooksValid(email.value)) {
        event.preventDefault();
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        say('Please enter an email address we can reach you on.', 'error');
        return;
      }

      email.removeAttribute('aria-invalid');

      if (notConnected) {
        event.preventDefault();
        say('Thanks — the waitlist form is not connected to a provider yet, so nothing has been sent. Add your form endpoint in index.html to start collecting sign-ups.', 'info');
        return;
      }

      say('Sending…', 'info');
    });

    email.addEventListener('input', function () {
      if (email.getAttribute('aria-invalid') === 'true' && emailLooksValid(email.value)) {
        email.removeAttribute('aria-invalid');
        say('', 'info');
      }
    });
  }
}());
