// The Privacy Blueprint: menu, cookie notice and gentle scroll reveals. No tracking.
(function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Cookie notice: this site sets no tracking cookies. We only remember that you've seen this message.
  var KEY = 'tpb-cookie-notice';
  var notice = document.getElementById('cookie-notice');
  var seen = false;
  try { seen = window.localStorage.getItem(KEY) === 'ok'; } catch (e) {}
  if (notice && !seen) {
    notice.classList.add('show');
    var ok = notice.querySelector('[data-cookie-ok]');
    if (ok) ok.addEventListener('click', function () {
      try { window.localStorage.setItem(KEY, 'ok'); } catch (e) {}
      notice.classList.remove('show');
    });
  }

  // Reveal sections as they scroll into view
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
