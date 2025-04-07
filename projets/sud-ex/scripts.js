document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);
  
    gsap.utils.toArray('.fade-up').forEach(elem => {
      // Apparition (fade-up)
      gsap.fromTo(elem,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 95%", // 👈 Plus tôt : déclenche presque dès qu'il entre
            end: "top 70%",   // 👈 Laisse un peu de marge
            toggleActions: "play none none reverse"
          }
        }
      );
  
      // Disparition (fade-out vers le haut)
      gsap.to(elem, {
        opacity: 0,
        y: -30, 
        duration: 0.6,
        ease: "power2.in",
        scrollTrigger: {
          trigger: elem,
          start: "bottom 40%", // 👈 Plus tard : quand l’élément a bien défilé
          end: "bottom 20%",   // 👈 Quitte lentement le cadre
          toggleActions: "play none none reverse"
        }
      });
    });
  });
  
  
  

function updateCSS() {
    let largeur = window.innerWidth;
    document.documentElement.style.setProperty('--window-width', largeur + 'px');

    let styleElement = document.getElementById('dynamic-media-query');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-media-query';
        document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `
        @media (max-width: ${largeur}px) {
            * {
                max-width: ${largeur}px !important;
            }
        }
    `;
}

// Met à jour au chargement et à chaque redimensionnement
window.addEventListener('resize', updateCSS);
updateCSS();

function updateMapSize() {
    let mapIframe = document.querySelector(".map-container iframe");
    if (!mapIframe) return;

    let largeur = window.innerWidth;

    if (largeur >= 768) { // Grand écran
        let newWidth = largeur - 200;
        let newHeight = newWidth / 2; // Hauteur = moitié de la largeur

        mapIframe.width = newWidth;
        mapIframe.height = newHeight;
    } else if (largeur < 400) { // Petit écran
        let newWidth = largeur - 40;
        let newHeight = newWidth / 1.5; // Hauteur = proportion adaptée au mobile

        mapIframe.width = newWidth;
        mapIframe.height = newHeight;
    } else { // Moyen écran
        let newWidth = largeur - 100;
        let newHeight = newWidth / 1.5; // Hauteur = proportion adaptée au mobile

        mapIframe.width = newWidth;
        mapIframe.height = newHeight;
    }
}

// Appliquer les mises à jour au chargement et au redimensionnement
window.addEventListener("resize", updateMapSize);
window.addEventListener("load", updateMapSize);

// Sélection du bouton hamburger et du menu de navigation
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// Au clic, on bascule la classe "show" pour afficher ou masquer le menu
menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});
