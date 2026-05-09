
  let currentLang=localStorage.getItem('cabmy-lang')||'fr';
  function setLang(lang){currentLang=lang;localStorage.setItem('cabmy-lang',lang);document.querySelectorAll('[data-fr]').forEach(el=>{el.textContent=el.getAttribute('data-'+lang)||el.textContent;});document.getElementById('btn-fr').classList.toggle('lang-active',lang==='fr');document.getElementById('btn-en').classList.toggle('lang-active',lang==='en');document.documentElement.lang=lang;}
  setLang(currentLang);
  function toggleMobile(){document.getElementById('mobile-menu').classList.toggle('open');}
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1});
  document.querySelectorAll('.animate-fade').forEach(el=>observer.observe(el));
  // Sidebar active on scroll
  const sections=['conditions','calendrier','frais','examens','tenues'];
  window.addEventListener('scroll',()=>{
    sections.forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      const rect=el.getBoundingClientRect();
      const link=document.querySelector(`.sidebar-nav a[href="#${id}"]`);
      if(link){link.classList.toggle('active',rect.top<200&&rect.bottom>0);}
    });
  });