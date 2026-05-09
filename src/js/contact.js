/* contact.js – Scripts spécifiques à la page Contact */

// Gestion du formulaire de contact
function handleContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const name = form.querySelector('input[name="name"]')?.value;
      const email = form.querySelector('input[name="email"]')?.value;
      const message = form.querySelector('textarea[name="message"]')?.value;
      
      // Validation simple
      if (name && email && message) {
        // Afficher un message de succès
        const successMsg = document.querySelector('.success-msg');
        if (successMsg) {
          successMsg.style.display = 'block';
          // Réinitialiser le formulaire
          form.reset();
          // Masquer le message après 5 secondes
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 5000);
        }
      } else {
        alert('Veuillez remplir tous les champs.');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', handleContactForm);
