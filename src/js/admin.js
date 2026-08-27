/* admin.js – Scripts spécifiques à la page Administration */

let isAuthenticated = false;
let currentUser = null;

// Authentification Supabase
async function doLogin() {
  const email = document.getElementById('login-user')?.value || '';
  const password = document.getElementById('login-pass')?.value || '';
  const errorDiv = document.getElementById('login-error');
  
  if (!email || !password) {
    if (errorDiv) {
      errorDiv.textContent = '❌ Veuillez remplir tous les champs';
      errorDiv.style.display = 'block';
    }
    return;
  }

  try {
    const authClient = window.supabase?.createClient
      ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
          auth: { persistSession: true, autoRefreshToken: true }
        })
      : getSupabaseClient();
    if (!authClient) throw new Error('Client Supabase non initialisé');

    const { data, error } = await authClient.auth.signInWithPassword({
      email: email.includes('@') ? email : `${email}@cabmy.fr`,
      password: password
    });

    if (error) {
      console.error('Erreur de connexion:', error.message);
      if (errorDiv) {
        errorDiv.textContent = `❌ ${error.message}`;
        errorDiv.style.display = 'block';
      }
      return;
    }

    if (data.session) {
      isAuthenticated = true;
      currentUser = data.session.user;
      
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('admin-ui').style.display = 'block';
      
      // Afficher le nom/email de l'utilisateur
      const userDisplay = document.getElementById('user-display');
      if (userDisplay) {
        userDisplay.textContent = currentUser.email || 'Admin';
      }

      if (typeof initSupabaseClient === 'function') {
        await initSupabaseClient();
      }
      if (typeof initAdmin === 'function') {
        await initAdmin();
      }
      
      console.log('✅ Connecté en tant que:', currentUser.email);
    }
  } catch (err) {
    console.error('Erreur:', err);
    if (errorDiv) {
      errorDiv.textContent = `❌ Erreur: ${err.message}`;
      errorDiv.style.display = 'block';
    }
  }
}

// Vérifier l'authentification au chargement
async function checkAuth() {
  try {
    const supabase = window.supabase?.createClient
      ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
          auth: { persistSession: true, autoRefreshToken: true }
        })
      : getSupabaseClient();
    if (!supabase) return;

    const { data, error } = await supabase.auth.getSession();
    
    if (data?.session?.user) {
      isAuthenticated = true;
      currentUser = data.session.user;
      
      const loginScreen = document.getElementById('login-screen');
      const adminUI = document.getElementById('admin-ui');
      if (loginScreen) loginScreen.style.display = 'none';
      if (adminUI) adminUI.style.display = 'block';
      
      const userDisplay = document.getElementById('user-display');
      if (userDisplay) {
        userDisplay.textContent = currentUser.email || 'Admin';
      }

      if (typeof initSupabaseClient === 'function') {
        await initSupabaseClient();
      }
      if (typeof initAdmin === 'function') {
        await initAdmin();
      }
    }
  } catch (err) {
    console.error('Erreur checkAuth:', err.message);
  }
}

// Déconnexion
async function doLogout() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.error('Erreur logout:', err);
  }
  
  isAuthenticated = false;
  currentUser = null;
  localStorage.removeItem('supabase.session');
  
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-ui').style.display = 'none';
  document.getElementById('login-error').style.display = 'none';
  
  // Réinitialiser les champs
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
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
