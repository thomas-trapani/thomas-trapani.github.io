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
