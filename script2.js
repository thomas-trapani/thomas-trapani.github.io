document.addEventListener("DOMContentLoaded", function () {
	const logo = document.querySelector(".logo-link");
	const navLinks = document.querySelector(".nav-links");

	logo.addEventListener("click", function (e) {
		e.preventDefault(); // Empêche le comportement par défaut du lien
		navLinks.classList.toggle("show");
	});
});
