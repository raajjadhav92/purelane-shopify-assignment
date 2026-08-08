/* Purelane Shop grid — AJAX add-to-cart with graceful fallback to normal form submit */
(function () {
  function handleSubmit(e) {
    var form = e.target.closest('.shop-add-form');
    if (!form) return;
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    if (!btn || btn.classList.contains('is-loading')) return;

    btn.classList.add('is-loading');
    btn.classList.remove('is-added');

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: form.querySelector('input[name="id"]').value, quantity: 1 }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Add to cart failed');
        return res.json();
      })
      .then(function () {
        btn.classList.remove('is-loading');
        btn.classList.add('is-added');
        document.dispatchEvent(new CustomEvent('purelane:cart:added'));
        setTimeout(function () { btn.classList.remove('is-added'); }, 2200);
      })
      .catch(function () {
        /* Fall back to a real navigation so the add still goes through */
        btn.classList.remove('is-loading');
        form.submit();
      });
  }

  document.addEventListener('submit', handleSubmit);
})();
