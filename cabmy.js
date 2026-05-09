// ============================================
// CABMY – Script partagé (cabmy.js)
// ============================================

// ---- LANGUE ----
let currentLang = localStorage.getItem('cabmy-lang') || 'fr';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('cabmy-lang', lang);
  document.querySelectorAll('[data-fr]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val) el.textContent = val;
  });
  // placeholders
  document.querySelectorAll('[data-fr-placeholder]').forEach(el => {
    const val = el.getAttribute('data-' + lang + '-placeholder');
    if (val) el.placeholder = val;
  });
  // options dans les selects
  document.querySelectorAll('option[data-fr]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val) el.textContent = val;
  });
  const btnFr = document.getElementById('btn-fr');
  const btnEn = document.getElementById('btn-en');
  if (btnFr) { btnFr.classList.toggle('lang-active', lang === 'fr'); btnFr.classList.toggle('hover:bg-white/10', lang !== 'fr'); }
  if (btnEn) { btnEn.classList.toggle('lang-active', lang === 'en'); btnEn.classList.toggle('hover:bg-white/10', lang !== 'en'); }
  document.documentElement.lang = lang;
}

// ---- MENU MOBILE ----
function toggleMobile() {
  const m = document.getElementById('mobile-menu');
  if (m) m.classList.toggle('open');
}

// Fermer menu si clic en dehors
document.addEventListener('click', e => {
  const menu = document.getElementById('mobile-menu');
  const btn = document.querySelector('[onclick="toggleMobile()"]');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ---- ANIMATIONS AU SCROLL ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-fade, .animate-fade-left, .animate-fade-right').forEach(el => {
  observer.observe(el);
});

// ---- COMPTEUR ANIMÉ (chiffres clés) ----
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + (el.dataset.suffix || ''); clearInterval(timer); return; }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = true;
      const target = parseInt(e.target.dataset.target);
      animateCounter(e.target, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ---- NAVBAR SCROLL EFFECT ----
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 4px 24px rgba(15,31,61,.12)';
    } else {
      nav.style.boxShadow = '';
    }
  }
});

// ---- ANTI-SPAM FORM ----
function validateAntiSpam(inputId, expected = 5) {
  const val = parseInt(document.getElementById(inputId)?.value);
  return val === expected;
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
});
// Carrousel background
(function() {
    const slides = Array.from(document.querySelectorAll('#hero-bg-slider > div'));
    const prevBtn = document.getElementById('prevBgSlide');
    const nextBtn = document.getElementById('nextBgSlide');
    const dotsContainer = document.getElementById('bgSlideDots');
    let currentIndex = 0;
    let interval;
    let visibleSlides = [];
    
    // Filtrer les slides qui ont des images valides
    function initVisibleSlides() {
        visibleSlides = [];
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            // Vérifier si l'image existe et est accessible
            if (img && img.complete && img.naturalWidth > 0) {
                visibleSlides.push(slide);
            } else if (img) {
                // Si l'image n'est pas encore chargée, attendre
                img.addEventListener('load', function() {
                    if (this.naturalWidth > 0 && !visibleSlides.includes(slide)) {
                        visibleSlides.push(slide);
                        if (visibleSlides.length === 1) showSlide(0);
                    }
                    updateDotsAndButtons();
                });
                img.addEventListener('error', function() {
                    // Image introuvable, la masquer
                    slide.style.display = 'none';
                });
            } else {
                slide.style.display = 'none';
            }
        });
        
        // Si aucune image valide trouvée immédiatement, prendre toutes les slides
        if (visibleSlides.length === 0 && slides.length > 0) {
            visibleSlides = slides;
        }
        
        updateDotsAndButtons();
    }
    
    function updateDotsAndButtons() {
        // Mettre à jour les dots
        if (dotsContainer && visibleSlides.length > 0) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < visibleSlides.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'w-2 h-2 rounded-full bg-white/40 transition-all cursor-pointer hover:bg-white/80';
                dot.addEventListener('click', () => showSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        // Afficher/masquer les boutons selon le nombre de slides
        if (prevBtn && nextBtn) {
            if (visibleSlides.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
        }
    }
    
    function showSlide(index) {
        if (!visibleSlides.length) return;
        
        if (index < 0) index = visibleSlides.length - 1;
        if (index >= visibleSlides.length) index = 0;
        
        // Cacher tous les slides visibles
        visibleSlides.forEach(slide => {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        });
        
        // Afficher le slide actif
        if (visibleSlides[index]) {
            visibleSlides[index].classList.remove('opacity-0');
            visibleSlides[index].classList.add('opacity-100');
        }
        
        // Mettre à jour les dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('div');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.remove('bg-white/40');
                    dot.classList.add('bg-gold', 'scale-125');
                    dot.style.backgroundColor = 'var(--gold)';
                } else {
                    dot.classList.add('bg-white/40');
                    dot.classList.remove('bg-gold', 'scale-125');
                    dot.style.backgroundColor = '';
                }
            });
        }
        
        currentIndex = index;
    }
    
    function nextSlide() {
        if (visibleSlides.length > 1) {
            showSlide(currentIndex + 1);
            resetInterval();
        }
    }
    
    function prevSlide() {
        if (visibleSlides.length > 1) {
            showSlide(currentIndex - 1);
            resetInterval();
        }
    }
    
    function resetInterval() {
        if (interval) clearInterval(interval);
        if (visibleSlides.length > 1) {
            interval = setInterval(() => {
                nextSlide();
            }, 5000);
        }
    }
    
    // Initialiser après un court délai pour permettre le chargement des images
    setTimeout(() => {
        initVisibleSlides();
        if (visibleSlides.length > 0) {
            showSlide(0);
            resetInterval();
        }
        
        // Ajouter les écouteurs d'événements
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    }, 100);
})();