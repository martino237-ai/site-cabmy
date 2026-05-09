/* admin.js – Scripts spécifiques à la page Administration */

// Système d'authentification simple
const defaultUser = 'admin';
const defaultPass = 'cabmy2024';
let isAuthenticated = false;

function doLogin() {
  const user = document.getElementById('login-user')?.value;
  const pass = document.getElementById('login-pass')?.value;
  const errorDiv = document.getElementById('login-error');
  
  if (user === defaultUser && pass === defaultPass) {
    isAuthenticated = true;
    localStorage.setItem('cabmy-admin-auth', 'true');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-ui').style.display = 'block';
  } else {
    if (errorDiv) errorDiv.style.display = 'block';
  }
}

// Vérifier l'authentification au chargement
function checkAuth() {
  if (localStorage.getItem('cabmy-admin-auth')) {
    isAuthenticated = true;
    const loginScreen = document.getElementById('login-screen');
    const adminUI = document.getElementById('admin-ui');
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminUI) adminUI.style.display = 'block';
  }
}

function showSection(section) {
  // Masquer toutes les sections
  document.querySelectorAll('[id^="section-"]').forEach(el => {
    el.style.display = 'none';
  });
  
  // Afficher la section demandée
  const sectionEl = document.getElementById('section-' + section);
  if (sectionEl) {
    sectionEl.style.display = 'block';
  }
  
  // Mettre à jour les liens de navigation actifs
  document.querySelectorAll('[id^="nav-"]').forEach(el => {
    el.classList.remove('active');
  });
  const navEl = document.getElementById('nav-' + section);
  if (navEl) {
    navEl.classList.add('active');
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', checkAuth);
