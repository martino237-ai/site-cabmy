/* index.js – Scripts spécifiques à la page d'accueil */

// Carrousel de la section hero (background images)
(function initHeroSlider() {
  const slides = Array.from(document.querySelectorAll('#hero-bg-slider > div'));
  const prevBtn = document.getElementById('prevBgSlide');
  const nextBtn = document.getElementById('nextBgSlide');
  const dotsContainer = document.getElementById('bgSlideDots');
  let currentIndex = 0;
  let interval;
  let visibleSlides = [];
  
  // Filtrer les slides avec images valides
  function initVisibleSlides() {
    visibleSlides = [];
    slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      if (img && img.complete && img.naturalWidth > 0) {
        visibleSlides.push(slide);
      } else if (img) {
        img.addEventListener('load', function() {
          if (this.naturalWidth > 0 && !visibleSlides.includes(slide)) {
            visibleSlides.push(slide);
            if (visibleSlides.length === 1) showSlide(0);
          }
          updateDotsAndButtons();
        });
        img.addEventListener('error', function() {
          slide.style.display = 'none';
        });
      } else {
        slide.style.display = 'none';
      }
    });
    
    if (visibleSlides.length === 0 && slides.length > 0) {
      visibleSlides = slides;
    }
    
    updateDotsAndButtons();
  }
  
  function updateDotsAndButtons() {
    if (dotsContainer && visibleSlides.length > 0) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < visibleSlides.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'w-2 h-2 rounded-full bg-white/40 transition-all cursor-pointer hover:bg-white/80';
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
      }
    }
    
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
    
    visibleSlides.forEach(slide => {
      slide.classList.remove('opacity-100');
      slide.classList.add('opacity-0');
    });
    
    if (visibleSlides[index]) {
      visibleSlides[index].classList.remove('opacity-0');
      visibleSlides[index].classList.add('opacity-100');
    }
    
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
  
  // Initialiser avec délai
  setTimeout(() => {
    initVisibleSlides();
    if (visibleSlides.length > 0) {
      showSlide(0);
      resetInterval();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  }, 100);
})();
