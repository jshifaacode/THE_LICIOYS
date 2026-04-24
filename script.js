

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ---- HEADER SCROLL ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- HAMBURGER / NAV ----
function toggleMenu() {
  const nav = document.getElementById('navbar');
  const btn = document.getElementById('hamburger');
  const isOpen = nav.classList.toggle('active');
  btn.classList.toggle('active', isOpen);
}
function closeMenu() {
  const nav = document.getElementById('navbar');
  const btn = document.getElementById('hamburger');
  nav.classList.remove('active');
  btn.classList.remove('active');
}

// Close when clicking outside the panel
document.addEventListener('click', e => {
  const nav = document.getElementById('navbar');
  const btn = document.getElementById('hamburger');
  if (nav.classList.contains('active') &&
      !nav.contains(e.target) &&
      !btn.contains(e.target)) {
    closeMenu();
  }
});

// ---- POPUP ORDER ----
const popup = document.getElementById('popupBox');
const popupItemName = document.getElementById('popupItem');

function openPopup(itemName) {
  popupItemName.textContent = itemName || 'gorengan';
  popup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popup.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.pesanButton').forEach(btn => {
  btn.addEventListener('click', function () {
    const item = this.dataset.item || 'gorengan';
    openPopup(item);
  });
});

document.getElementById('batalButton').addEventListener('click', closePopup);
document.getElementById('batalButton2').addEventListener('click', closePopup);
popup.addEventListener('click', e => {
  if (e.target === popup) closePopup();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePopup();
});

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('id-ID');
  }
  requestAnimationFrame(update);
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Trigger counter if applicable
      if (entry.target.querySelector('[data-count]')) {
        entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      }
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Trigger counter on hero stats (already visible)
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => heroObserver.observe(el));

// ---- ACTIVE NAV ----
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id || (id === 'home' && link.getAttribute('href') === '#')) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Add active nav style
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--gold-light) !important; background: rgba(201,147,90,.12) !important; }`;
document.head.appendChild(style);

// ---- CARD TILT EFFECT (desktop only) ----
if (window.innerWidth > 768) {
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ---- PARALLAX HERO ----
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && scrolled < window.innerHeight) {
    heroImg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
  }
});
