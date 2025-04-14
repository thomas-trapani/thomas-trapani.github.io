// Sélectionne la nav
const navbar = document.getElementById("navbar");

// Ajoute ou supprime la classe 'sticky' au scroll
window.addEventListener("scroll", function() {
  if (window.scrollY > 20) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

// Ajoute une barre centrale au hamburger
const bar = document.createElement("div");
hamburger.appendChild(bar);

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});
