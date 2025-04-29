////////////////  GALLERY  ///////////////////

// Sélection des boutons de filtre
const filterButtons = document.querySelectorAll('.filter-btn');
// Sélection des images
const images = document.querySelectorAll('.gallery picture');

// Ajout d'un écouteur sur chaque bouton
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Gestion de l'état "actif"
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Affichage des images en fonction du filtre
        images.forEach(picture => {
            const img = picture.querySelector('img');
            if (filter === 'all' || img.getAttribute('data-category') === filter) {
                picture.style.display = 'block';
            } else {
                picture.style.display = 'none';
            }
        });
    });
});


////////////////  CAROUSEL  ///////////////////


// Sélection du conteneur des slides
const track = document.querySelector('.carousel-track');
// Sélection de toutes les slides (les images à faire défiler) et conversion en tableau
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
// Sélection des dots (indicateurs de position)
const dots = Array.from(document.querySelectorAll('.dot'));
// Sélection des flèches de navigation gauche et droite
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

// Récupérer la largeur d'une slide pour calculer les déplacements
let slideWidth = slides[0].clientWidth;

// Index initial (commence à 0 mais sera modifié par les clones)
let currentIndex = 0;

// *** Étape 1 : Ajouter des clones pour créer l'effet de défilement infini ***

// Clone de la première slide pour l'ajouter à la fin
const firstClone = slides[0].cloneNode(true);

// Clone de la dernière slide pour l'ajouter au début
const lastClone = slides[slides.length - 1].cloneNode(true);

// Ajouter le clone de la première slide à la fin du conteneur
track.appendChild(firstClone);

// Ajouter le clone de la dernière slide au début du conteneur
track.insertBefore(lastClone, slides[0]);

// *** Étape 2 : Positionner le carrousel sur la première vraie image ***

// On positionne le carrousel sur le deuxième élément (le premier réel, après le clone)
currentIndex = 1; // À cause du clone
track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

// *** Étape 3 : Gérer les dots pour indiquer la position actuelle ***
// Mettre à jour les dots
function updateDots() {
  // Parcourir tous les dots et activer uniquement celui correspondant à l'index actuel
  dots.forEach((dot, index) => {
    // Activer le dot correspondant en ignorant les clones
    dot.classList.toggle('active', index === (currentIndex - 1 + slides.length) % slides.length);
  });
}

// *** Étape 4 : Déplacer le carrousel vers une slide spécifique ***
// Déplacer vers un slide donné
function goToSlide(index) {
  // Ajouter une transition pour un défilement fluide
  track.style.transition = 'transform 0.5s ease-in-out';
  // Déplacer le carrousel vers la slide souhaitée
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

// *** Étape 5 : Ajuster la position après un cycle (éviter l'effet de rebobinage) ***
// Ajuster la position après un cycle
function checkPosition() {
  if (currentIndex === 0) {
    // Si on est sur le clone de la dernière slide (index 0), sauter sans animation à la vraie dernière slide
    track.style.transition = 'none'; // Retirer la transition
    currentIndex = slides.length; // Dernière vraie slide
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
  if (currentIndex === slides.length + 1) {
    // Si on est sur le clone de la première slide, sauter sans animation à la vraie première slide
    track.style.transition = 'none'; // Retirer la transition
    currentIndex = 1; // Première vraie slide
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
}

// *** Étape 6 : Ajouter les événements pour les flèches ***
// Flèche droite (passer à la slide suivante)
rightArrow.addEventListener('click', () => {
  if (currentIndex <= slides.length) {
    currentIndex++; // Augmenter l'index
    goToSlide(currentIndex); // Aller à la slide suivante
    updateDots(); // Mettre à jour les dots
  }
});

// Flèche gauche (revenir à la slide précédente)
leftArrow.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--; // Diminuer l'index
    goToSlide(currentIndex); // Aller à la slide précédente
    updateDots(); // Mettre à jour les dots
  }
});

// *** Étape 7 : Réinitialiser la position après la transition (pour ignorer les clones) ***
// Transition terminée : vérifier position
track.addEventListener('transitionend', checkPosition);


// *** Étape 8 : Gérer le défilement tactile (pour les écrans tactiles) ***
let startX = 0; // Position de départ du swipe

// Détecter le début du swipe
track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX; // Stocker la position X initiale
});

// Détecter la fin du swipe et calculer le déplacement
track.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX; // Position X finale
  const diff = startX - endX; // Différence entre début et fin

  if (diff > 50) {
    // Swipe vers la gauche (aller à la slide suivante)
    rightArrow.click();
  } else if (diff < -50) {
    // Swipe vers la droite (revenir à la slide précédente)
    leftArrow.click();
  }
});

window.addEventListener('resize', () => {
  slideWidth = slides[0].clientWidth; // recalculer la largeur
  goToSlide(currentIndex); // repositionner correctement
});

setInterval(() => {
  rightArrow.click(); // simule un clic sur la flèche droite
}, 10000); // toutes les 3 secondes


