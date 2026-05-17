/* ═══════════════════════════════════════════
   LUXÉ JEWELRY — script.js
   Landing Page JS: Nav, GSAP, Cart, Products
═══════════════════════════════════════════ */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   CART STATE
══════════════════════════════════════ */
function getCart() {
  try { return JSON.parse(localStorage.getItem('luxe_cart')) || []; }
  catch { return []; }
}
function saveCart(cart) { localStorage.setItem('luxe_cart', JSON.stringify(cart)); }
function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx > -1) cart[idx].qty += 1;
  else cart.push({ ...product, qty: 1 });
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
function showAddedNotif(name) {
  let notif = document.getElementById('luxe-notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'luxe-notif';
    notif.style.cssText = `
      position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(80px);
      background:#1A1A1A;color:#fff;padding:14px 28px;font-family:'Montserrat',sans-serif;
      font-size:11px;font-weight:400;letter-spacing:0.15em;z-index:9999;
      transition:transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94),opacity 0.4s;
      opacity:0;white-space:nowrap;
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
   TOP SALES
══════════════════════════════════════ */
const TOP_PRODUCTS = [
  { id: 'P001', name: 'Golden Elegance Ring',  price: 120, category: 'rings',     tag: 'Bestseller', image: 'images/one.jpg' },
  { id: 'P002', name: 'Diamond Aura Necklace', price: 250, category: 'necklaces', tag: 'New',        image: 'images/two.jpg' },
  { id: 'P003', name: 'Royal Gold Earrings',   price: 150, category: 'earrings',  tag: 'Limited',    image: 'images/tree.jpg' },
  { id: 'P004', name: 'Luxury Pearl Bracelet', price: 90,  category: 'bracelets', tag: null,         image: 'images/for.jpg' },
];
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__img-wrap">
      <img src="${product.image || ''}" alt="${product.name}" class="product-card__img" loading="lazy" />
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
   NAV
══════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

/* ══════════════════════════════════════
   HERO ENTRANCE
══════════════════════════════════════ */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero__eyebrow', { y: 24, opacity: 0, duration: 1, delay: 0.3 })
    .from('.hero__title-line', { y: 60, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out' }, '-=0.6')
    .from('.hero__sub', { y: 20, opacity: 0, duration: 0.9 }, '-=0.6')
    .from('.hero__ctas .btn', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
    .from('.hero__scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.3');
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function initScrollReveal() {
  gsap.from('.trust-item', { y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.trust-bar', start: 'top 85%' } });
  gsap.from('#topSalesGrid .product-card', { y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '#topSalesGrid', start: 'top 80%' } });
  gsap.from('.about__img-col', { x: -60, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.about', start: 'top 75%' } });
  gsap.from('.about__text-col > *', { x: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.about', start: 'top 75%' } });
  gsap.from('.type-card', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.type-grid', start: 'top 82%' } });
  gsap.from('.contact__text > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.contact', start: 'top 80%' } });
  gsap.from('.contact__form .form-group', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.contact__form', start: 'top 82%' } });
}

/* ══════════════════════════════════════
   HORIZONTAL SCROLL TIMELINE
   — 100vh pinned, scrub-driven
══════════════════════════════════════ */
function initHorizontalTimeline() {
  const section = document.getElementById('legacySection');
  const track   = document.getElementById('legacyTrack');
  if (!section || !track) return;

  const mm = gsap.matchMedia();

  /* ── DESKTOP: horizontal pin + scrub ── */
  mm.add('(min-width: 769px)', () => {

    // How far to scroll the track leftward
    const getScrollDist = () => -(track.scrollWidth - window.innerWidth);

    const pinTween = gsap.to(track, {
      x: getScrollDist,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        // end = travel distance so 1px scroll = 1px track movement
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Drive the gold progress bar via CSS custom property
        onUpdate: (self) => {
          section.style.setProperty('--tl-progress', (self.progress * 100) + '%');
        }
      }
    });

    /* Stagger nodes in as they enter the viewport during horizontal scroll */
    document.querySelectorAll('.tl-node').forEach((node) => {
      const inner = node.querySelectorAll(
        '.tl-node__img-wrap, .tl-node__content, .tl-node__dot'
      );

      gsap.fromTo(inner,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: node,
            containerAnimation: pinTween,
            start: 'left 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    /* Dot pulse on enter */
    document.querySelectorAll('.tl-node__dot').forEach((dot, i) => {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot.closest('.tl-node'),
            containerAnimation: pinTween,
            start: 'left 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    return () => {
      pinTween.scrollTrigger?.kill();
      pinTween.kill();
    };
  });

  /* ── MOBILE: touch swipe card slider ── */
  mm.add('(max-width: 768px)', () => {
    const canvas  = section.querySelector('.legacy-canvas');
    const nodes   = Array.from(track.querySelectorAll('.tl-node'));
    const total   = nodes.length;
    let current   = 0;

    // Make sure GSAP doesn't touch the track on mobile
    track.style.transform = 'translateX(0)';

    /* ── Build dot indicators ── */
    let dotsWrap = section.querySelector('.tl-mobile-dots');
    if (!dotsWrap) {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'tl-mobile-dots';
      for (let i = 0; i < total; i++) {
        const d = document.createElement('span');
        d.className = 'tl-mobile-dot' + (i === 0 ? ' active' : '');
        d.dataset.i = i;
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
      canvas.after(dotsWrap);
    }

    /* ── Build prev/next nav ── */
    let navWrap = section.querySelector('.tl-mobile-nav');
    if (!navWrap) {
      navWrap = document.createElement('div');
      navWrap.className = 'tl-mobile-nav';
      navWrap.innerHTML = `
        <button class="tl-mobile-btn" id="tlPrev" aria-label="Previous" disabled>‹</button>
        <span class="tl-mobile-counter"><span id="tlCur">1</span> / ${total}</span>
        <button class="tl-mobile-btn" id="tlNext" aria-label="Next">›</button>
      `;
      dotsWrap.after(navWrap);
    }
    const btnPrev = navWrap.querySelector('#tlPrev');
    const btnNext = navWrap.querySelector('#tlNext');
    const lblCur  = navWrap.querySelector('#tlCur');

    /* ── Slide to index ── */
    function goTo(idx) {
      current = Math.max(0, Math.min(idx, total - 1));
      const vw = window.innerWidth;
      track.style.transition = 'transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)';
      track.style.transform  = `translateX(${-current * vw}px)`;

      // Update dots
      dotsWrap.querySelectorAll('.tl-mobile-dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
      );

      // Update counter & buttons
      if (lblCur) lblCur.textContent = current + 1;
      if (btnPrev) btnPrev.disabled = current === 0;
      if (btnNext) btnNext.disabled = current === total - 1;

      // Animate the card in
      const node = nodes[current];
      gsap.fromTo(node,
        { opacity: 0.4, scale: 0.97 },
        { opacity: 1,   scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }

    btnPrev?.addEventListener('click', () => goTo(current - 1));
    btnNext?.addEventListener('click', () => goTo(current + 1));

    /* ── Touch / swipe support ── */
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging  = false;

    canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging  = true;
      track.style.transition = 'none';
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      // Only hijack horizontal swipes
      if (Math.abs(dx) > Math.abs(dy)) {
        const vw = window.innerWidth;
        track.style.transform = `translateX(${(-current * vw) + dx}px)`;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const threshold = window.innerWidth * 0.2; // 20% of screen width
      if (dx < -threshold) goTo(current + 1);
      else if (dx > threshold) goTo(current - 1);
      else goTo(current); // snap back
    }, { passive: true });

    /* ── Mouse drag support (desktop fallback / emulation) ── */
    let mouseStartX = 0;
    let mouseDown   = false;

    canvas.addEventListener('mousedown', (e) => {
      mouseDown   = true;
      mouseStartX = e.clientX;
      track.style.transition = 'none';
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      const dx = e.clientX - mouseStartX;
      const vw = window.innerWidth;
      track.style.transform = `translateX(${(-current * vw) + dx}px)`;
    });
    window.addEventListener('mouseup', (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      const dx = e.clientX - mouseStartX;
      const threshold = window.innerWidth * 0.15;
      if (dx < -threshold) goTo(current + 1);
      else if (dx > threshold) goTo(current - 1);
      else goTo(current);
    });

    /* ── Keyboard arrow support ── */
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(current + 1);
      if (e.key === 'ArrowLeft')  goTo(current - 1);
    };
    window.addEventListener('keydown', onKey);

    /* ── Recalculate on resize ── */
    const onResize = () => {
      track.style.transition = 'none';
      track.style.transform  = `translateX(${-current * window.innerWidth}px)`;
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Init first card
    goTo(0);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      // Clean up injected elements
      dotsWrap?.remove();
      navWrap?.remove();
    };
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
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; form.reset(); }, 3000);
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