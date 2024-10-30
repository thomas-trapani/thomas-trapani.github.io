$(function() {
	window.sr = ScrollReveal();
  
	// Parcours de chaque élément .timeline-content
	$('.timeline-content').each(function(index) {
	  // Configuration pour les éléments pairs : fade-in depuis la gauche
	  if (index % 2 === 0) {
		sr.reveal(this, {
		  origin: 'left',
		  distance: '300px',
		  opacity: 0,
		  easing: 'ease-in-out',
		  duration: 800,
		  reset: true // Pour réinitialiser l'animation lors de la disparition
		});
	  } 
	  // Configuration pour les éléments impairs : fade-in depuis la droite
	  else {
		sr.reveal(this, {
		  origin: 'right',
		  distance: '300px',
		  opacity: 0,
		  easing: 'ease-in-out',
		  duration: 800,
		  reset: true // Pour réinitialiser l'animation lors de la disparition
		});
	  }
	});
  
	// Ajout d'un écouteur pour détecter quand les éléments sortent du viewport
	$(window).on('scroll', function() {
	  $('.timeline-content').each(function() {
		const rect = this.getBoundingClientRect();
		const windowHeight = window.innerHeight;
  
		// Ajoute fade-out si l'élément est en dehors du viewport
		if (rect.top > windowHeight || rect.bottom < 0) {
		  $(this).addClass('fade-out');
		} else {
		  $(this).removeClass('fade-out');
		}
	  });
	});
  });
  