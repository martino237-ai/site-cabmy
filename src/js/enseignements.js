/* enseignements.js – Scripts spécifiques à la page Enseignements */

// Système d'onglets pour les sections d'enseignement
function showTab(tab) {
  // Masquer tout le contenu
  document.querySelectorAll('[id^="content-"]').forEach(el => {
    el.style.display = 'none';
  });
  
  // Afficher le contenu du tab
  const contentEl = document.getElementById('content-' + tab);
  if (contentEl) {
    contentEl.style.display = 'block';
  }
  
  // Mettre à jour les boutons actifs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const tabBtn = document.getElementById('tab-' + tab);
  if (tabBtn) {
    tabBtn.classList.add('active');
  }
}
