/* Purelane Hero — product slide rotator (1 -> 2 -> 3), scoped per section instance */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHero(hstage) {
    var wrap = hstage.closest('.hero-prod');
    if (!wrap || hstage.dataset.purelaneInit) return;
    hstage.dataset.purelaneInit = 'true';

    var slides = [].slice.call(hstage.querySelectorAll('.hslide'));
    var dotsWrap = wrap.querySelector('.hdots');
    var dots = dotsWrap ? [].slice.call(dotsWrap.querySelectorAll('button')) : [];
    var i = 0;
    var timer = null;

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle('on', idx === i); });
      dots.forEach(function (d, idx) { d.classList.toggle('on', idx === i); });
    }

    function play() {
      if (!timer && !reduce && slides.length > 1) {
        timer = setInterval(function () { go(i + 1); }, 3800);
      }
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { stop(); go(idx); play(); });
    });

    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', play);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play() : stop(); });
      }, { threshold: 0.2 }).observe(wrap);
    } else {
      play();
    }
  }

  function initAll() {
    document.querySelectorAll('.purelane.hero .hstage').forEach(initHero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* Re-init when a hero block/section is added or reordered in the theme editor */
  document.addEventListener('shopify:section:load', function (e) {
    var hstage = e.target.querySelector && e.target.querySelector('.purelane.hero .hstage');
    if (hstage) initHero(hstage);
  });
})();
