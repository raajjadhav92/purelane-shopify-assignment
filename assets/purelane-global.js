/* Purelane — shared scroll-reveal for .rv elements across all sections */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(root) {
    var revs = (root || document).querySelectorAll('.rv:not(.in)');
    if (!revs.length) return;

    if ('IntersectionObserver' in window && !reduce) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            ro.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
      revs.forEach(function (el) { ro.observe(el); });
    } else {
      revs.forEach(function (el) { el.classList.add('in'); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { reveal(document); });
  } else {
    reveal(document);
  }

  /* Reveal content inside sections added/edited live in the theme editor */
  document.addEventListener('shopify:section:load', function (e) { reveal(e.target); });
})();
