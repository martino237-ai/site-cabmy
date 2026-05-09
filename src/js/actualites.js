let currentLang=localStorage.getItem('cabmy-lang')||'fr';
  function setLang(lang){currentLang=lang;localStorage.setItem('cabmy-lang',lang);document.querySelectorAll('[data-fr]').forEach(el=>{el.textContent=el.getAttribute('data-'+lang)||el.textContent;});document.getElementById('btn-fr').classList.toggle('lang-active',lang==='fr');document.getElementById('btn-en').classList.toggle('lang-active',lang==='en');document.documentElement.lang=lang;}
  setLang(currentLang);
  function toggleMobile(){document.getElementById('mobile-menu').classList.toggle('open');}

  function filterNews(cat){
    const cards=document.querySelectorAll('.article-card');
    let visible=0;
    cards.forEach(c=>{
      if(cat==='all'||c.dataset.cat===cat){c.classList.add('show');visible++;}
      else{c.classList.remove('show');}
    });
    document.getElementById('no-results').classList.toggle('hidden',visible>0);
    document.querySelectorAll('.filter-btn').forEach(b=>{b.classList.remove('active');});
    event.target.classList.add('active');
  }

  function openArticle(el){
    const card=el.closest('.article-card');
    const title=card.querySelector('h3').textContent;
    const content=card.querySelector('p').textContent;
    const date=card.querySelector('.text-xs.text-gray-400 span').textContent;
    document.getElementById('modal-title').textContent=title;
    document.getElementById('modal-content').textContent=content+' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur leo, in commodo odio. Sed aliquam urna leo, pretium justo faucibus condimentum.';
    document.getElementById('modal-date').textContent='📅 '+date+' · Administration CABMY';
    document.getElementById('article-modal').classList.remove('hidden');
    document.getElementById('article-modal').classList.add('flex');
  }
  function closeArticle(){
    document.getElementById('article-modal').classList.add('hidden');
    document.getElementById('article-modal').classList.remove('flex');
  }

  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1});
  document.querySelectorAll('.animate-fade').forEach(el=>observer.observe(el));
let currentLang=localStorage.getItem('cabmy-lang')||'fr';
  function setLang(lang){currentLang=lang;localStorage.setItem('cabmy-lang',lang);document.querySelectorAll('[data-fr]').forEach(el=>{el.textContent=el.getAttribute('data-'+lang)||el.textContent;});document.getElementById('btn-fr').classList.toggle('lang-active',lang==='fr');document.getElementById('btn-en').classList.toggle('lang-active',lang==='en');document.documentElement.lang=lang;}
  setLang(currentLang);
  function toggleMobile(){document.getElementById('mobile-menu').classList.toggle('open');}

  function filterNews(cat){
    const cards=document.querySelectorAll('.article-card');
    let visible=0;
    cards.forEach(c=>{
      if(cat==='all'||c.dataset.cat===cat){c.classList.add('show');visible++;}
      else{c.classList.remove('show');}
    });
    document.getElementById('no-results').classList.toggle('hidden',visible>0);
    document.querySelectorAll('.filter-btn').forEach(b=>{b.classList.remove('active');});
    event.target.classList.add('active');
  }

  function openArticle(el){
    const card=el.closest('.article-card');
    const title=card.querySelector('h3').textContent;
    const content=card.querySelector('p').textContent;
    const date=card.querySelector('.text-xs.text-gray-400 span').textContent;
    document.getElementById('modal-title').textContent=title;
    document.getElementById('modal-content').textContent=content+' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur leo, in commodo odio. Sed aliquam urna leo, pretium justo faucibus condimentum.';
    document.getElementById('modal-date').textContent='📅 '+date+' · Administration CABMY';
    document.getElementById('article-modal').classList.remove('hidden');
    document.getElementById('article-modal').classList.add('flex');
  }
  function closeArticle(){
    document.getElementById('article-modal').classList.add('hidden');
    document.getElementById('article-modal').classList.remove('flex');
  }

  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.1});
  document.querySelectorAll('.animate-fade').forEach(el=>observer.observe(el));
