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

// ---- Build plant card HTML ----
function buildPlantCard(plant) {
  let images = plant.images || [];
  if (typeof images === 'string') {
    try { images = JSON.parse(images); } catch { images = [images]; }
  }
  if (!Array.isArray(images)) images = [];
  const slidesHTML = images.length > 0
    ? images.map(url => `<div class="carousel-slide"><img src="${url}" alt="${plant.name}" loading="lazy"></div>`).join('')
    : `<div class="carousel-slide" style="display:flex;align-items:center;justify-content:center;background:var(--sage-light);height:100%"><span style="font-size:3rem">🌿</span></div>`;
  const dotsHTML = images.length > 1
    ? images.map(() => `<div class="dot"></div>`).join('')
    : '';

  return `
    <div class="plant-card fade-in" onclick="window.location.href='plant.html?id=${plant.id}'">
      <div class="carousel">
        <div class="carousel-track">${slidesHTML}</div>
        ${images.length > 1 ? `<button class="carousel-btn prev">&#8249;</button><button class="carousel-btn next">&#8250;</button>` : ''}
        ${dotsHTML ? `<div class="carousel-dots">${dotsHTML}</div>` : ''}
      </div>
      <div class="plant-card-body">
        <h3>${plant.name}</h3>
        <p class="plant-desc" onclick="event.stopPropagation(); window.location.href='plant.html?id=${plant.id}'">${plant.description || ''}</p>
        <div class="plant-card-links">
          ${plant.amazon_link ? `<a href="${plant.amazon_link}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="btn-amazon">🛒 Amazon</a>` : ''}
          ${plant.flipkart_link ? `<a href="${plant.flipkart_link}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="btn-flipkart">🛍 Flipkart</a>` : ''}
        </div>
      </div>
    </div>`;
}

// ---- Active nav link ----
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
});
