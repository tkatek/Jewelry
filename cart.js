/* ═══════════════════════════════════════════
   LUXÉ JEWELRY — cart.js
   Cart rendering, quantity controls, WhatsApp checkout
═══════════════════════════════════════════ */

'use strict';

const WHATSAPP_NUMBER = '212600000000'; // Replace with real number

/* ══════════════════════════════════════
   RENDER CART
══════════════════════════════════════ */
function renderCart() {
  const cart   = getCart();
  const body   = document.getElementById('cartBody');
  const empty  = document.getElementById('cartEmpty');

  if (!body) return;

  if (cart.length === 0) {
    body.style.display  = 'none';
    empty.style.display = 'flex';
    gsap.fromTo(empty,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    return;
  }

  body.style.display  = '';
  empty.style.display = 'none';

  body.innerHTML = `
    <div class="cart-items-col">
      <h2 class="cart-items-title">Selected Pieces</h2>
      <p class="cart-items-sub">${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart</p>
      <div class="cart-item-list" id="cartItemList"></div>
    </div>
    <div class="cart-checkout-col">
      <div class="checkout-card">
        <h3 class="checkout-card__title">Customer Information</h3>
        <form class="checkout-form" id="checkoutForm" onsubmit="return false;">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="cusName" placeholder="Your full name" required />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number *</label>
            <input type="tel" class="form-input" id="cusPhone" placeholder="e.g. +1 555 000 0000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Additional Notes (optional)</label>
            <textarea class="form-input form-textarea" id="cusNotes" placeholder="Gift wrapping, engraving requests, etc."></textarea>
          </div>
          <div class="order-summary">
            <div class="order-row">
              <span>Subtotal</span>
              <strong id="subtotalDisplay">$0.00</strong>
            </div>
            <div class="order-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>
            <div class="order-total">
              <span>Total</span>
              <strong id="totalDisplay">$0.00</strong>
            </div>
          </div>
          <button class="whatsapp-btn" id="whatsappBtn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Checkout via WhatsApp
          </button>
          <p class="whatsapp-note">You will be redirected to WhatsApp to complete your order.</p>
        </form>
      </div>
    </div>
  `;

  // Render each item
  const list = document.getElementById('cartItemList');
  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.dataset.id = item.id;
    el.innerHTML = `
      <div class="cart-item__img-wrap">
        <img src="" alt="${item.name}" class="cart-item__img" />
        <div class="cart-item__placeholder">${item.name}</div>
      </div>
      <div class="cart-item__info">
        <p class="cart-item__category">${item.category || 'Jewelry'}</p>
        <h3 class="cart-item__name">${item.name}</h3>
        <p class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div class="cart-item__controls">
        <div class="qty-control">
          <button class="qty-btn qty-decrease" data-id="${item.id}" aria-label="Decrease">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn qty-increase" data-id="${item.id}" aria-label="Increase">+</button>
        </div>
        <button class="cart-item__remove" data-id="${item.id}">Remove</button>
      </div>
    `;
    list.appendChild(el);
  });

  // Attach quantity & remove listeners
  list.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.addEventListener('click', () => adjustQty(btn.dataset.id, -1));
  });
  list.querySelectorAll('.qty-increase').forEach(btn => {
    btn.addEventListener('click', () => adjustQty(btn.dataset.id, 1));
  });
  list.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => removeItem(btn.dataset.id));
  });

  // WhatsApp button
  document.getElementById('whatsappBtn')?.addEventListener('click', checkoutViaWhatsApp);

  updateTotals();

  // GSAP entrance
  gsap.from('.cart-items-col', { opacity: 0, x: -40, duration: 0.9, ease: 'power3.out' });
  gsap.from('.cart-checkout-col', { opacity: 0, x: 40, duration: 0.9, ease: 'power3.out', delay: 0.15 });
  gsap.from('.cart-item', { opacity: 0, y: 20, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.2 });
}

/* ══════════════════════════════════════
   QUANTITY & REMOVE
══════════════════════════════════════ */
function adjustQty(id, delta) {
  const cart = getCart();
  const idx  = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
  updateCartBadge();
}

function removeItem(id) {
  const itemEl = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (itemEl) {
    gsap.to(itemEl, {
      opacity: 0, x: -30, height: 0, paddingTop: 0, paddingBottom: 0,
      duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        const cart = getCart().filter(i => i.id !== id);
        saveCart(cart);
        renderCart();
        updateCartBadge();
      }
    });
  }
}

/* ══════════════════════════════════════
   TOTALS
══════════════════════════════════════ */
function updateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const sub = document.getElementById('subtotalDisplay');
  const tot = document.getElementById('totalDisplay');
  if (sub) sub.textContent = `$${subtotal.toFixed(2)}`;
  if (tot) tot.textContent = `$${subtotal.toFixed(2)}`;
}

/* ══════════════════════════════════════
   WHATSAPP CHECKOUT
══════════════════════════════════════ */
function checkoutViaWhatsApp() {
  const name   = document.getElementById('cusName')?.value.trim();
  const phone  = document.getElementById('cusPhone')?.value.trim();
  const notes  = document.getElementById('cusNotes')?.value.trim();

  if (!name) { alert('Please enter your full name.'); return; }
  if (!phone) { alert('Please enter your phone number.'); return; }

  const cart = getCart();
  if (cart.length === 0) { alert('Your cart is empty.'); return; }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Build WhatsApp message
  let msg = `✨ *LUXÉ JEWELRY — New Order* ✨\n\n`;
  msg += `*Customer Details*\n`;
  msg += `Name: ${name}\n`;
  msg += `Phone: ${phone}\n`;
  if (notes) msg += `Notes: ${notes}\n`;
  msg += `\n*Order Summary*\n`;
  msg += `─────────────────\n`;

  cart.forEach(item => {
    msg += `◆ ${item.name}\n`;
    msg += `  Qty: ${item.qty} × $${item.price.toFixed(2)} = $${(item.price * item.qty).toFixed(2)}\n`;
  });

  msg += `─────────────────\n`;
  msg += `*Subtotal: $${subtotal.toFixed(2)}*\n`;
  msg += `*Shipping: Free*\n`;
  msg += `*Total: $${subtotal.toFixed(2)}*\n\n`;
  msg += `_Thank you for choosing LUXÉ Jewelry. We'll confirm your order shortly._`;

  const encoded = encodeURIComponent(msg);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Button feedback
  const btn = document.getElementById('whatsappBtn');
  btn.textContent = 'Opening WhatsApp...';
  btn.disabled = true;

  setTimeout(() => {
    window.open(url, '_blank');
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Checkout via WhatsApp`;
    btn.disabled = false;
  }, 600);
}

/* ══════════════════════════════════════
   HERO ANIMATION
══════════════════════════════════════ */
function initCartHero() {
  gsap.from('.cart-hero .section-eyebrow', { y: 20, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power2.out' });
  gsap.from('.cart-hero__title', { y: 40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
  gsap.from('.cart-hero .gold-divider', { opacity: 0, duration: 0.8, delay: 0.5 });
}

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
function initCartNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initCartHero();
  initCartNav();
  renderCart();
});