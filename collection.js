/* ═══════════════════════════════════════════
   LUXÉ JEWELRY — collection.js
   Generates 20 distinct products, renders them,
   handles filter & sort with GSAP transitions
═══════════════════════════════════════════ */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   20 DISTINCT PRODUCT OBJECTS
══════════════════════════════════════ */
const ALL_PRODUCTS = [
  {
    id: 'C001', name: 'Solara Solitaire Ring',
    price: 380, category: 'rings', tag: 'Bestseller',
    desc: 'Round brilliant diamond set in 18k white gold.'
  },
  {
    id: 'C002', name: 'Eternal Band Ring',
    price: 210, category: 'rings', tag: null,
    desc: 'Pavé diamond eternity band, classic and timeless.'
  },
  {
    id: 'C003', name: 'Celeste Halo Ring',
    price: 520, category: 'rings', tag: 'New',
    desc: 'Sapphire center stone with diamond halo in platinum.'
  },
  {
    id: 'C004', name: 'Marquise Twist Ring',
    price: 295, category: 'rings', tag: null,
    desc: 'Marquise cut diamond with twisted shank setting.'
  },
  {
    id: 'C005', name: 'Lumière Drop Necklace',
    price: 460, category: 'necklaces', tag: 'Bestseller',
    desc: 'Pear shaped diamond pendant on delicate gold chain.'
  },
  {
    id: 'C006', name: 'Baroque Pearl Strand',
    price: 320, category: 'necklaces', tag: null,
    desc: 'South Sea baroque pearls hand-knotted on silk cord.'
  },
  {
    id: 'C007', name: 'Diamond Collar Necklace',
    price: 890, category: 'necklaces', tag: 'Limited',
    desc: 'Statement pavé diamond collar in 18k rose gold.'
  },
  {
    id: 'C008', name: 'Golden Chain Lariat',
    price: 175, category: 'necklaces', tag: 'New',
    desc: 'Adjustable lariat in 22k vermeil, effortlessly chic.'
  },
  {
    id: 'C009', name: 'Crescent Moon Pendant',
    price: 240, category: 'necklaces', tag: null,
    desc: 'Diamond crescent pendant symbolising intuition.'
  },
  {
    id: 'C010', name: 'Cascading Drop Earrings',
    price: 310, category: 'earrings', tag: 'Bestseller',
    desc: 'Multi-drop diamond earrings for radiant movement.'
  },
  {
    id: 'C011', name: 'Pearl Stud Earrings',
    price: 145, category: 'earrings', tag: null,
    desc: 'Classic Akoya pearl studs in 18k white gold bezels.'
  },
  {
    id: 'C012', name: 'Geometric Hoop Earrings',
    price: 195, category: 'earrings', tag: 'New',
    desc: 'Architectural gold hoops with pavé diamond edges.'
  },
  {
    id: 'C013', name: 'Chandelier Ruby Earrings',
    price: 740, category: 'earrings', tag: 'Limited',
    desc: 'Burmese ruby and diamond chandelier drops.'
  },
  {
    id: 'C014', name: 'Dainty Huggie Hoops',
    price: 98, category: 'earrings', tag: null,
    desc: 'Slim gold huggies with single diamond accent.'
  },
  {
    id: 'C015', name: 'Tennis Bracelet',
    price: 680, category: 'bracelets', tag: 'Bestseller',
    desc: 'Classic 4ct diamond tennis bracelet in 18k white gold.'
  },
  {
    id: 'C016', name: 'Herringbone Chain Bracelet',
    price: 190, category: 'bracelets', tag: 'New',
    desc: 'Flat herringbone weave in polished 14k yellow gold.'
  },
  {
    id: 'C017', name: 'Charm Link Bracelet',
    price: 260, category: 'bracelets', tag: null,
    desc: 'Customisable gold link with signature LUXÉ charms.'
  },
  {
    id: 'C018', name: 'Sapphire Bangle',
    price: 430, category: 'bracelets', tag: 'Limited',
    desc: 'Ceylon sapphire and diamond hinged bangle.'
  },
  {
    id: 'C019', name: 'Infinity Twist Bracelet',
    price: 155, category: 'bracelets', tag: null,
    desc: 'Intertwined gold strands symbolising endless love.'
  },
  {
    id: 'C020', name: 'Pavé Diamond Cuff',
    price: 550, category: 'bracelets', tag: 'New',
    desc: 'Bold open cuff set with 2ct of brilliant pavé diamonds.'
  },
];

/* ══════════════════════════════════════
   RENDER CARDS
══════════════════════════════════════ */
function buildCard(product) {
  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.category = product.category;
  article.dataset.price = product.price;
  article.dataset.name = product.name.toLowerCase();

  article.innerHTML = `
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

  article.querySelector('.product-card__cart-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(product);
  });

  return article;
}

function renderAllProducts(products) {
  const grid = document.getElementById('collectionGrid');
  if (!grid) return;
  grid.innerHTML = '';

  products.forEach((p, i) => {
    const card = buildCard(p);
    grid.appendChild(card);
  });

  // GSAP stagger entrance
  gsap.fromTo('.collection-grid .product-card',
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.7,
      stagger: { each: 0.07, from: 'start' },
      ease: 'power2.out',
      clearProps: 'all'
    }
  );

  updateCount(products.length);
}

function updateCount(n) {
  const el = document.getElementById('resultsCount');
  if (el) el.textContent = `${n} piece${n !== 1 ? 's' : ''}`;
}

/* ══════════════════════════════════════
   FILTER & SORT
══════════════════════════════════════ */
let activeFilter = 'all';
let activeSort   = 'default';

function getFilteredSorted() {
  let list = [...ALL_PRODUCTS];

  // Filter
  if (activeFilter !== 'all') {
    list = list.filter(p => p.category === activeFilter);
  }

  // Sort
  switch (activeSort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break; // keep original order
  }

  return list;
}

function applyFilterSort() {
  renderAllProducts(getFilteredSorted());
}

function initFilters() {
  // Read URL param
  const params = new URLSearchParams(window.location.search);
  const urlFilter = params.get('filter');
  if (urlFilter) activeFilter = urlFilter;

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    if (btn.dataset.filter === activeFilter) {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
    }
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      activeFilter = btn.dataset.filter;
      applyFilterSort();
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', () => {
    activeSort = sortSelect.value;
    applyFilterSort();
  });
}

/* ══════════════════════════════════════
   SCROLL REVEAL FOR GRID
══════════════════════════════════════ */
function initCollectionScrollReveal() {
  gsap.from('.collection-hero__title', {
    y: 40, opacity: 0, duration: 1, ease: 'power3.out'
  });
  gsap.from('.collection-hero__sub', {
    y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power2.out'
  });
  gsap.from('.filters-section', {
    y: 20, opacity: 0, duration: 0.7, delay: 0.5, ease: 'power2.out'
  });
}

/* ══════════════════════════════════════
   NAV SCROLL (solid on collection page)
══════════════════════════════════════ */
function initCollectionNav() {
  const nav = document.getElementById('mainNav');
  // Already solid; just track scroll for box-shadow depth
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = '0 1px 0 #E8E8E8';
    }
  }, { passive: true });

  const hamburger = document.getElementById('hamburger');
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
  initFilters();
  applyFilterSort();
  initCollectionScrollReveal();
  initCollectionNav();
});