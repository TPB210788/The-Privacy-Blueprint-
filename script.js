/* ==========================================================================
   TomorrowKit — minimal vanilla JavaScript
   No analytics, no trackers, no cookies, no third-party scripts.
   Everything below is progressive enhancement: the page works without it.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     >>> THE ONLY LINE YOU NEED TO EDIT <<<

     Paste the endpoint your form provider gives you between the quotes.

       Formspree   FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
       Tally       FORM_ENDPOINT = 'https://tally.so/r/abcdwxyz';
       Buttondown  FORM_ENDPOINT = 'https://buttondown.email/api/emails/embed-subscribe/yourname';

     Using Netlify Forms instead? Leave this empty and follow the note in
     index.html above the form tag.

     While this is empty the form refuses to submit and says so on the page,
     so no sign-up is ever sent to a broken or unintended address.
     ====================================================================== */
  var FORM_ENDPOINT = '';

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

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setNav(false); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    var wide = window.matchMedia('(min-width: 60rem)');
    var onChange = function (event) { if (event.matches) { setNav(false); } };
    if (wide.addEventListener) { wide.addEventListener('change', onChange); }
    else if (wide.addListener) { wide.addListener(onChange); }
  }

  /* ---- Footer year ------------------------------------------------------ */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---- Waitlist form ---------------------------------------------------- */
  var form = document.getElementById('waitlistForm');
  var status = document.getElementById('formStatus');
  var email = document.getElementById('email');

  if (form && status && email) {
    if (FORM_ENDPOINT) { form.setAttribute('action', FORM_ENDPOINT); }

    var say = function (message, state) {
      status.textContent = message;
      status.className = 'form-status is-' + state;
    };

    var emailLooksValid = function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
    };

    var showSuccess = function () {
      var done = document.createElement('div');
      done.className = 'form-done';
      done.setAttribute('role', 'status');
      done.innerHTML =
        '<p class="form-done-title">Thanks — you are on the list.</p>' +
        '<p>We will email you about beta access, testing and launch. ' +
        'Nothing else, and you can leave the list from any email we send.</p>';
      form.replaceWith(done);
      done.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    form.addEventListener('submit', function (event) {
      // Honeypot: real people leave this empty, most bots fill it in.
      var trap = form.querySelector('input[name="_gotcha"]');
      if (trap && trap.value) { event.preventDefault(); return; }

      if (!emailLooksValid(email.value)) {
        event.preventDefault();
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        say('Please enter an email address we can reach you on.', 'error');
        return;
      }
      email.removeAttribute('aria-invalid');

      var action = form.getAttribute('action');
      var connected = action && action.indexOf('REPLACE_WITH_FORM_ENDPOINT') === -1;

      if (!connected) {
        event.preventDefault();
        say('The waitlist is not connected to a provider yet, so nothing has been sent. ' +
            'Add your form endpoint in script.js to start collecting sign-ups.', 'info');
        return;
      }

      // Netlify Forms posts the page itself, so let the browser handle it.
      if (form.hasAttribute('data-netlify')) { return; }

      // Everyone else: post in the background so the page does not navigate away.
      event.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      if (button) { button.disabled = true; }
      say('Sending…', 'info');

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (response.ok) { showSuccess(); return; }
        throw new Error('Request failed');
      }).catch(function () {
        if (button) { button.disabled = false; }
        say('Something went wrong sending that. Please try again, or email hello@tomorrowkit.co.uk.', 'error');
      });
    });

    email.addEventListener('input', function () {
      if (email.getAttribute('aria-invalid') === 'true' && emailLooksValid(email.value)) {
        email.removeAttribute('aria-invalid');
        say('', 'info');
      }
    });
  }
}());
