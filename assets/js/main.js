/* TomorrowKit — minimal progressive enhancement.
   No analytics, no trackers, no third-party requests. Two jobs only:
   1. the mobile navigation toggle
   2. the placeholder waitlist form's success state
*/
(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('mobileNav');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });

    // Close after following an in-page link.
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        toggle.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        toggle.focus();
      }
    });
  }

  /* ---- Waitlist placeholder --------------------------------------------- */
  /* Replaced by the Tally embed before launch. Nothing is sent anywhere from
     here: the submission is stopped and the success message is shown so the
     completed state can be reviewed during design. */
  var form = document.getElementById('betaForm');
  var success = document.getElementById('betaSuccess');

  if (form && success) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = document.getElementById('email');
      if (!email.value || email.validity.typeMismatch) {
        email.setAttribute('aria-invalid', 'true');
        email.focus();
        return;
      }
      email.removeAttribute('aria-invalid');

      form.hidden = true;
      success.hidden = false;
      success.setAttribute('tabindex', '-1');
      success.focus();
    });
  }
})();
