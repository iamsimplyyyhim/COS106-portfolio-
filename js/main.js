/* ============================================
   MAIN.JS — Shared site functionality
   COS 106 | Isaiah Jr. | MIVA Open University
   ============================================ */

/* ---- NAVIGATION ---- */
(function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active nav link
  const allLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  allLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }
})();

/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el, target, suffix, duration) {
  var start = 0;
  var step = target / (duration / 16);
  var decimals = target < 10 ? 2 : 0;

  var timer = setInterval(function () {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    var display = start < 1 ? start.toFixed(2) : Math.floor(start).toLocaleString();
    el.innerHTML = display + '<span class="stat-suffix">' + suffix + '</span>';
  }, 16);
}

(function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseFloat(el.dataset.count);
          var suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix, 1800);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ---- NAVBAR SCROLL SHADOW ---- */
(function initNavScroll() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
})();

