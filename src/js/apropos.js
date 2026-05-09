let currentLang = localStorage.getItem('cabmy-lang') || 'fr';
  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('cabmy-lang', lang);
    document.querySelectorAll('[data-fr]').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang) || el.textContent;
    });
    document.getElementById('btn-fr').classList.toggle('lang-active', lang === 'fr');
    document.getElementById('btn-en').classList.toggle('lang-active', lang === 'en');
    document.documentElement.lang = lang;
  }
  setLang(currentLang);
  function toggleMobile() { document.getElementById('mobile-menu').classList.toggle('open'); }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-fade').forEach(el => observer.observe(el));