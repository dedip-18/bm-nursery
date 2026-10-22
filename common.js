const SUPABASE_URL = 'https://lpwhwpcxmbtbblfrbqqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd2h3cGN4bWJ0YmJsZnJicXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODgzOTksImV4cCI6MjA4ODc2NDM5OX0.hdRM7xvqTmeJtEhL8Gd3Q3fq3f1_Iww7vF1YTo1HBWI';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Carousel ----
function initCarousel(carouselEl) {
  const track = carouselEl.querySelector('.carousel-track');
  const slides = carouselEl.querySelectorAll('.carousel-slide');
  const dots = carouselEl.querySelectorAll('.dot');
  const prevBtn = carouselEl.querySelector('.carousel-btn.prev');
  const nextBtn = carouselEl.querySelector('.carousel-btn.next');
  let current = 0;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
  dots.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); goTo(i); }));

  // Touch support
  let startX = 0;
  carouselEl.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
  carouselEl.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  goTo(0);
  return { goTo };
}


// ============================================================
//  Shared helpers for the public site
// ============================================================
const WA_LINK = 'https://wa.me/917362980328';
const WA_NUMBER = '+91 73629 80328';

const SUB_LABELS = {
  'air-purifying': 'Air purifying', 'low-maintenance': 'Low maintenance', 'succulents': 'Succulents & cactus',
  'flowering': 'Flowering', 'combo': 'Combos', 'self-watering-pot': 'Self-watering pots',
  'fruit': 'Fruit', 'herbs-spice': 'Herbs & spice', 'trees-shrubs': 'Trees & shrubs',
  'vegetable-seeds': 'Vegetable seeds', 'flower-seeds': 'Flower seeds', 'herb-seeds': 'Herb seeds'
};

function esc(t) { return String(t ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function imgsOf(p) {
  let a = (p && p.images) || [];
  if (typeof a === 'string') { try { a = JSON.parse(a); } catch { a = a ? [a] : []; } }
  return Array.isArray(a) ? a.filter(Boolean) : [];
}
function money(p) {
  const v = p && p.price;
  if (v === null || v === undefined || v === '' || isNaN(Number(v))) return '';
  return '₹' + Number(v).toLocaleString('en-IN');
}
// "Christmas Tree Live Plant (Araucaria heterophylla / Norfolk Pine)" -> title + scientific line
function nameParts(name) {
  const n = String(name || '');
  const m = n.match(/^(.*?)\s*\((.*)\)\s*$/);
  const title = (m ? m[1] : n).replace(/\s+Live Plant$/i, '').trim();
  return { title: title || n, sci: m ? m[2].trim() : '' };
}

// One plant card, used on the home page and the category pages
function plantCard(p) {
  const imgs = imgsOf(p);
  const { title, sci } = nameParts(p.name);
  const url = 'plant.html?id=' + encodeURIComponent(p.id);
  const price = money(p);
  const sub = SUB_LABELS[p.subcategory] || '';
  const buy = p.amazon_link
    ? `<a class="btn btn-buy" href="${esc(p.amazon_link)}" target="_blank" rel="noopener">Buy on Amazon</a>`
    : `<a class="btn btn-buy alt" href="${url}">View details</a>`;
  return `<article class="pc">
    <a class="pc-img" href="${url}" tabindex="-1" aria-hidden="true">
      ${imgs[0] ? `<img src="${esc(imgs[0])}" alt="" loading="lazy">` : ''}
      ${imgs[1] ? `<img class="alt" src="${esc(imgs[1])}" alt="" loading="lazy">` : ''}
    </a>
    <div class="pc-body">
      ${sub ? `<p class="pc-sub">${esc(sub)}</p>` : ''}
      <h3 class="pc-name"><a href="${url}">${esc(title)}</a></h3>
      ${sci ? `<p class="pc-sci">${esc(sci)}</p>` : ''}
      <div class="pc-foot">${price ? `<span class="pc-price">${price}</span>` : ''}${buy}</div>
    </div>
  </article>`;
}
// kept so older code paths keep working
function buildPlantCard(p) { return plantCard(p); }

// ============================================================
//  Header, footer and search (injected on every public page)
// ============================================================
const ICON = {
  leaf: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 20C4 10 9 4 20 4c0 11-5.500 16-13 16.500" fill="currentColor"/><path d="M4 20c3-5.500 6.500-9 11-11.500" stroke="var(--leaf-vein, #f5f7f1)" stroke-width="1.500" fill="none" stroke-linecap="round"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="6.500" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 4.500 4.500" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  menu: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path class="m-open" d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="m-close" d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  wa: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2Zm5.800 14.200c-.2.700-1.400 1.300-1.900 1.400-.5.100-1.100.1-1.800-.1-.4-.1-1-.3-1.700-.6-3-1.300-4.900-4.300-5-4.500-.1-.2-1.200-1.600-1.200-3s.8-2.100 1-2.400c.3-.3.600-.3.800-.3h.600c.2 0 .4 0 .6.500l.8 2c.1.200.1.400 0 .600l-.4.600-.5.500c-.2.200-.3.400-.1.700.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.100.5.100.7-.1l.9-1.100c.2-.3.400-.2.700-.1l2 1c.3.100.5.200.5.300.1.200.1.800-.1 1.300Z"/></svg>'
};

function renderChrome() {
  const header = document.getElementById('site-header');
  if (header) {
    header.outerHTML = `
<header class="site-header" id="site-header-el">
  <div class="wrap bar">
    <a class="brand" href="index.html" aria-label="Bonayon home">${ICON.leaf}<span class="brand-name">Bonayon</span><span class="brand-sub">Your Own Nursery</span></a>
    <nav class="main-nav" id="main-nav" aria-label="Main">
      <a href="indoor.html">Indoor</a>
      <a href="outdoor.html">Outdoor</a>
      <a href="seeds.html">Seeds</a>
      <a class="nav-wa" href="${WA_LINK}" target="_blank" rel="noopener">WhatsApp us</a>
    </nav>
    <button class="icon-btn" id="search-toggle" type="button" aria-label="Search plants">${ICON.search}</button>
    <button class="icon-btn burger" id="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">${ICON.menu}</button>
  </div>
</header>
<div class="search-overlay" id="search-overlay">
  <div class="search-modal" role="dialog" aria-label="Search plants">
    <div class="search-input-wrap">
      ${ICON.search}
      <input type="text" id="global-search-input" placeholder="Search plants and seeds" autocomplete="off">
      <button class="search-close-btn" id="search-close" type="button">Close</button>
    </div>
    <div class="search-results" id="search-results"><div class="sr-empty">Type a plant name to search.</div></div>
  </div>
</div>
<a href="${WA_LINK}" target="_blank" rel="noopener" class="wa-float" aria-label="Chat on WhatsApp">${ICON.wa}</a>`;
    const here = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('#main-nav a[href$=".html"]').forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
    const btn = document.getElementById('nav-toggle'), nav = document.getElementById('main-nav');
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.getElementById('site-header-el').classList.toggle('menu-open', open);
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.getElementById('site-header-el').classList.remove('menu-open'); } });
  }
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.outerHTML = `
<footer class="site-footer">
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <a class="brand light" href="index.html">${ICON.leaf}<span class="brand-name">Bonayon</span></a>
      <p>Live plants, fruit trees and seeds from our nursery in Kolkata, delivered across India.</p>
    </div>
    <div><h4>Shop</h4><a href="indoor.html">Indoor plants</a><a href="outdoor.html">Outdoor plants</a><a href="seeds.html">Seeds</a></div>
    <div><h4>Talk to us</h4><a href="${WA_LINK}" target="_blank" rel="noopener">WhatsApp ${WA_NUMBER}</a><span>Orders are placed on Amazon.in</span></div>
  </div>
  <div class="wrap foot-base">&copy; 2026 Bonayon</div>
</footer>`;
  }
}
renderChrome();

// ============================================================
//  Global search
// ============================================================
function initGlobalSearch() {
  const toggle = document.getElementById('search-toggle');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('global-search-input');
  const results = document.getElementById('search-results');
  const closeBtn = document.getElementById('search-close');
  if (!toggle || !overlay || !input) return;

  let all = [], loaded = false;

  async function fetchAll() {
    if (loaded) return;
    results.innerHTML = '<div class="sr-empty">Searching...</div>';
    const { data } = await db.from('plants').select('*').order('name');
    all = data || []; loaded = true; doSearch();
  }

  function doSearch() {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = '<div class="sr-empty">Type a plant name to search.</div>'; return; }
    const hits = all.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q) || (p.subcategory || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)).slice(0, 30);
    if (!hits.length) { results.innerHTML = `<div class="sr-empty">No plants found for "${esc(q)}".</div>`; return; }
    results.innerHTML = hits.map(p => {
      const img = imgsOf(p)[0];
      const { title } = nameParts(p.name);
      return `<a href="plant.html?id=${encodeURIComponent(p.id)}" class="sr-item">
        <span class="sr-img">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ''}</span>
        <span class="sr-info"><strong>${esc(title)}</strong><span>${esc(SUB_LABELS[p.subcategory] || p.category || '')}</span></span>
        <span class="sr-price">${money(p)}</span>
      </a>`;
    }).join('');
  }

  const open = () => { overlay.classList.add('open'); input.focus(); fetchAll(); };
  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  input.addEventListener('input', () => { loaded ? doSearch() : fetchAll(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
  });
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('global-search-input');
  if (overlay) overlay.classList.remove('open');
  if (input) input.value = '';
  const results = document.getElementById('search-results');
  if (results) results.innerHTML = '<div class="sr-empty">Type a plant name to search.</div>';
}

initGlobalSearch();

// Photos that are not the standard portrait shape (about 0.855 wide:tall) are shown whole, not cropped
document.addEventListener('load', e => {
  const im = e.target;
  if (!(im instanceof HTMLImageElement) || !im.naturalHeight) return;
  const box = im.closest('.pc-img, .gallery-main, .thumb, .tile, .type-photo, .sr-img');
  if (!box) return;
  if (Math.abs(im.naturalWidth / im.naturalHeight - 0.855) > 0.08) box.classList.add('fit-whole');
}, true);
