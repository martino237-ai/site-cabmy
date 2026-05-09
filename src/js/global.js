/* global.js – Scripts partagés pour tout le site CABMY */

// Système de langue (FR/EN)
let currentLang = localStorage.getItem('cabmy-lang') || 'fr';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('cabmy-lang', lang);
  
  document.querySelectorAll('[data-fr]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang) || el.textContent;
  });
  
  // Mettre à jour les boutons de langue
  const btnFr = document.getElementById('btn-fr');
  const btnEn = document.getElementById('btn-en');
  
  if (btnFr) {
    btnFr.classList.toggle('lang-active', lang === 'fr');
    btnFr.classList.toggle('hover:bg-white/10', lang !== 'fr');
  }
  if (btnEn) {
    btnEn.classList.toggle('lang-active', lang === 'en');
    btnEn.classList.toggle('hover:bg-white/10', lang !== 'en');
  }
  
  document.documentElement.lang = lang;
}

// Initialiser la langue au chargement
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
});

// Menu mobile
function toggleMobile() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

// Animations au scroll (IntersectionObserver)
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.animate-fade').forEach(el => {
    observer.observe(el);
  });
}

// Initialiser les animations au chargement du DOM
document.addEventListener('DOMContentLoaded', initScrollAnimations);
