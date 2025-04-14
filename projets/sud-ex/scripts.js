// =========================
// INIT ANIMATIONS
// =========================
AOS.init({
    duration: 800,
    once: false
});

// =========================
// CSS dynamique pour adaptation responsive
// =========================
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
window.addEventListener('resize', updateCSS);
updateCSS();

// =========================
// MAP responsive
// =========================
function updateMapSize() {
    let mapIframe = document.querySelector(".map-container iframe");
    if (!mapIframe) return;

    let largeur = window.innerWidth;

    if (largeur >= 768) {
        let newWidth = largeur - 200;
        let newHeight = newWidth / 2;
        mapIframe.width = newWidth;
        mapIframe.height = newHeight;
    } else if (largeur < 400) {
        let newWidth = largeur - 40;
        let newHeight = newWidth / 1.5;
        mapIframe.width = newWidth;
        mapIframe.height = newHeight;
    } else {
        let newWidth = largeur - 100;
        let newHeight = newWidth / 1.5;
        mapIframe.width = newWidth;
        mapIframe.height = newHeight;
    }
}
window.addEventListener("resize", updateMapSize);
window.addEventListener("load", updateMapSize);

// =========================
// MENU mobile
// =========================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// =========================
// CARROUSEL infini fluide
// =========================    
(function autoCloneCarousel() {
    const carousel = document.getElementById("carousel");
    if (!carousel) return;
  
    // Nombre d'éléments visibles dans le carrousel
    const items = Array.from(carousel.children);
    const totalItems = items.length;
  
    // On duplique les éléments pour créer l'effet infini
    items.forEach(item => {
      const clonedItem = item.cloneNode(true); // Clone chaque élément
      carousel.appendChild(clonedItem); // Ajoute le clone à la fin
    });
  
    // Dupliquer à la bonne échelle si nécessaire
    let totalCloned = carousel.children.length;
    let itemsPerView = Math.floor(carousel.offsetWidth / items[0].offsetWidth);
    let desiredCloneCount = itemsPerView * 2;
  
    // Si la taille du carrousel change (ou autre paramètre), dupliquer plus ou moins d'éléments
    while (carousel.children.length < desiredCloneCount) {
      items.forEach(item => {
        const clonedItem = item.cloneNode(true);
        carousel.appendChild(clonedItem);
      });
    }
  
    // Calculer la largeur totale du carrousel pour ajuster l'animation
    const totalWidth = carousel.scrollWidth;
  
    // Mettre à jour l'animation pour qu'elle défile sur la largeur totale du carrousel
    carousel.style.animation = `scroll-carousel ${totalWidth / 200}s linear infinite`;
  })();
  