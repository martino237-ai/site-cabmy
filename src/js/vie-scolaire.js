/* vie-scolaire.js – Scripts spécifiques à la page Vie Scolaire */

// Scripts pour les éléments interactifs de la vie scolaire
function initVieScolareFunctions() {
  // Animation des cartes d'activités
  const activityCards = document.querySelectorAll('.activity-card');
  
  activityCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('.overlay')?.style.setProperty('opacity', '1');
    });
    
    card.addEventListener('mouseleave', function() {
      this.querySelector('.overlay')?.style.setProperty('opacity', '0');
    });
  });
}

document.addEventListener('DOMContentLoaded', initVieScolareFunctions);
