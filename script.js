/* ═══════════════════════════════════════════
   LUXÉ JEWELRY — script.js
   Landing Page JS: Nav, GSAP, Cart, Products
═══════════════════════════════════════════ */

'use strict';

// ── GSAP Plugin Registration ──
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   CART STATE
══════════════════════════════════════ */
function getCart() {
  try { return JSON.parse(localStorage.getItem('luxe_cart')) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
}
function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showAddedNotif(product.name);
}
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.textContent = total;
  badge.classList.toggle('visible', total > 0);
}

/* ── Toast Notification ── */
function showAddedNotif(name) {
  let notif = document.getElementById('luxe-notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'luxe-notif';
    notif.style.cssText = `
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(80px);
      background: #1A1A1A; color: #fff;
      padding: 14px 28px; font-family: 'Montserrat', sans-serif;
      font-size: 11px; font-weight: 400; letter-spacing: 0.15em;
      z-index: 9999; transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s;
      opacity: 0; white-space: nowrap;
    `;
    document.body.appendChild(notif);
  }
  notif.textContent = `"${name}" added to cart`;
  notif.style.transform = 'translateX(-50%) translateY(0)';
  notif.style.opacity = '1';
  clearTimeout(notif._t);
  notif._t = setTimeout(() => {
    notif.style.transform = 'translateX(-50%) translateY(80px)';
    notif.style.opacity = '0';
  }, 2800);
}

/* ══════════════════════════════════════
   TOP SALES PRODUCTS DATA & RENDER
══════════════════════════════════════ */
const TOP_PRODUCTS = [
  { id: 'P001', name: 'Golden Elegance Ring',    price: 120, category: 'rings',     tag: 'Bestseller' },
  { id: 'P002', name: 'Diamond Aura Necklace',   price: 250, category: 'necklaces', tag: 'New' },
  { id: 'P003', name: 'Royal Gold Earrings',     price: 150, category: 'earrings',  tag: 'Limited' },
  { id: 'P004', name: 'Luxury Pearl Bracelet',   price: 90,  category: 'bracelets', tag: null },
];

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__img-wrap">
      <img src="" alt="${product.name}" class="product-card__img" loading="lazy" />
      <div class="product-card__placeholder">${product.name}</div>
      ${product.tag ? `<span class="product-card__tag">${product.tag}</span>` : ''}
      <button class="product-card__cart-btn" data-id="${product.id}" aria-label="Add to cart">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </button>
    </div>
    <h3 class="product-card__name">${product.name}</h3>
    <p class="product-card__price">$${product.price.toFixed(2)}</p>
  `;
  card.querySelector('.product-card__cart-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product);
  });
  return card;
}

function renderTopSales() {
  const grid = document.getElementById('topSalesGrid');
  if (!grid) return;
  TOP_PRODUCTS.forEach(p => grid.appendChild(createProductCard(p)));
}

/* ══════════════════════════════════════
   NAV — Scroll & Mobile
══════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  // Scroll → solid nav
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

/* ══════════════════════════════════════
   GSAP — HERO ENTRANCE
══════════════════════════════════════ */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero__eyebrow', { y: 24, opacity: 0, duration: 1, delay: 0.3 })
    .from('.hero__title-line', {
      y: 60, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out'
    }, '-=0.6')
    .from('.hero__sub', { y: 20, opacity: 0, duration: 0.9 }, '-=0.6')
    .from('.hero__ctas .btn', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
    .from('.hero__scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.3');
}

/* ══════════════════════════════════════
   GSAP — SECTION REVEALS (ScrollTrigger)
══════════════════════════════════════ */
function initScrollReveal() {
  // Trust bar
  gsap.from('.trust-item', {
    y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.trust-bar', start: 'top 85%' }
  });

  // Top Sales
  gsap.from('#topSalesGrid .product-card', {
    y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '#topSalesGrid', start: 'top 80%' }
  });

  // About
  gsap.from('.about__img-col', {
    x: -60, opacity: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.about', start: 'top 75%' }
  });
  gsap.from('.about__text-col > *', {
    x: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.about', start: 'top 75%' }
  });

  // Type cards
  gsap.from('.type-card', {
    y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.type-grid', start: 'top 82%' }
  });

  // Contact
  gsap.from('.contact__text > *', {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact', start: 'top 80%' }
  });
  gsap.from('.contact__form .form-group', {
    y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact__form', start: 'top 82%' }
  });
}

/* ══════════════════════════════════════
   GSAP — HORIZONTAL SCROLL TIMELINE (PINNED)
══════════════════════════════════════ */
function initHorizontalTimeline() {
  const section = document.getElementById('legacySection');
  const track   = document.getElementById('legacyTrack');
  if (!section || !track) return;

  // How far to scroll: track width - viewport width
  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', () => {
    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Stagger-in each node as it enters view during horizontal scroll
    document.querySelectorAll('.timeline-node').forEach((node, i) => {
      gsap.from(node, {
        opacity: 0, y: 40, duration: 0.6,
        scrollTrigger: {
          trigger: node,
          containerAnimation: tween,
          start: 'left 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    return () => tween.kill();
  });

  // Mobile: simple vertical fade-in
  mm.add('(max-width: 768px)', () => {
    track.style.width = 'auto';
    track.style.flexDirection = 'column';
    track.style.padding = '40px 20px';
    document.querySelector('.timeline-line').style.display = 'none';

    document.querySelectorAll('.timeline-node').forEach(node => {
      node.style.width = '100%';
      node.style.flexDirection = 'column';
      node.style.alignItems = 'center';
      gsap.from(node, {
        y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: node, start: 'top 85%' }
      });
    });
  });
}

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#4a8c4a';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initNav();
  renderTopSales();
  initHeroAnimation();
  initScrollReveal();
  initHorizontalTimeline();
  initContactForm();
});