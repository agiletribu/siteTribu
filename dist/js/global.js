/* ****************************** */
/*   DECLARATION DES FONCTIONS   */
/* **************************** */

/* BREAK POINT */
function assign_bootstrap_mode() {
	
   winWidth = $( window ).width();
   var mode = '';

    $("body").removeClass("mode-xs").removeClass("mode-sm").removeClass("mode-md").removeClass("mode-lg").removeClass("mode-desktop");

	if ( winWidth < 768) { $('body').addClass('mode-xs').removeClass('mode-desktop');}
	else if ( winWidth >= 769 &&  winWidth <= 992) { $('body').addClass('mode-sm mode-desktop');}
	else if ( winWidth > 993 &&  winWidth <= 1200) { $('body').addClass('mode-md mode-desktop');}
	else if ( winWidth > 1201) { $('body').addClass('mode-lg');}
	else  { $('body').addClass('mode-basic');}
   
}

 

/* Page home - vertical center */
function dashboardheight() {
  
  var theviewport = '';
  var thefooter = '';	
	var theviewport = $(window).height();

	var thefooter = $('#ft').outerHeight();	
	$('.wrapper').removeAttr('style');
	
	var thetotal =  theviewport - (thefooter) ;
	  
	
	$('.mode-desktop .wrapper').css('height',thetotal);
}



/* ******************************** */
/*  DOCUMENT                       */
/* ****************************** */
$(document).ready(function() {
 



	 
	 /* ********************** BREAK POINT DECLARATIONS ********************** */
	assign_bootstrap_mode();

	  
		/* **********************  MENU ********************** */ 
	 		
	    $("#menu-toggle").click(function(e) {
	        e.preventDefault();
	        $("#wrapper").toggleClass("toggled");
			$("body").toggleClass("bodytoggledmenu");
			$("#menu-toggle").toggleClass("active");
	    });
		 
	    
					 
	 
	 
	/* ********************** BLOCK CLICK ********************** */
	$(".ft-title").click(function(){
						window.location=$(this).find("a").prop('href');
		        return false;
	});

	 
	 $(".block-social-perso").click(function(){
						window.location=$(this).find("a").prop('href');
		        return false;
	});


	/* ********************** OWL********************** */	
  		
		
	// Go to the next item
	$('.btn-prev').click(function() {
	 $('#slider-owl').trigger('prev.owl.carousel');
	})
	// Go to the previous item
	$('.btn-next').click(function() {
	    // With optional speed parameter
	    // Parameters has to be in square bracket '[]'
	 $('#slider-owl').trigger('next.owl.carousel');
	})
 

 
/*
	$("#slider-owl").owlCarousel( { 
	autoplay:true, // peut être une valeur numerique ex:12000
	 
	navigation : true, 
	pagination:false,   
	 
	navigationText :["précédent","suivant"],
		
		responsive : {
	    // breakpoint 
	   992 : {
	        items:5
	    },
	    // breakpoint  
	    768: {
	       items:3
	    },
	    // breakpoint  
	    20 : {
	          items:1
	    }
	}
				
				
	});
*/
  
 
/* end document */
});

 
 


/* ******************************** */
/*  REZISE                         */
/* ****************************** */
// Reload JavaScript
$(window).bind('resize', function(e){ 
 
assign_bootstrap_mode();

});

 