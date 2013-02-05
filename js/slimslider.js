/**
 * Slimslider v1.0.5
 * @author Kyle Foster
 * MIT license
 */
;(function ( $, window, document, undefined ) {

  $.fn.slimSlider = function ( options ) {

    options = $.extend( {}, $.fn.slimSlider.options, options );

    return this.each(function () {        
      
      // Define our variables
      var counter  = 0,
          element  = $(this),
          wrapper  = element.children('.slides'),
          slide    = wrapper.children('li'),
          slideCnt = slide.length,
          navLink  = element.find('.slide-nav').find('li').find('a'),
          prefix   = ($.browser.webkit)  ? '-webkit-' :
                     ($.browser.mozilla) ? '-moz-' : 
                     ($.browser.msie)    ? '-ms-' :
                     ($.browser.opera)   ? '-o-' : '';
      
      // Add active class to first nav link
      navLink.first().addClass('active');    
      
      // Auto play function (if selected options)
      if ( options.autoPlay === true ) {          
        
        // Define slideshow variable
        var slideShow;

        // Define play function
        function play() {

          // Don't execute after click function  
          if ( !wrapper.is('.stopped') ) {

            // Slideshow function
            slideShow = setTimeout(function() {
              
              // Slideshow iterator
              if (counter < slideCnt - 1) { counter++; } 
              else { counter = 0; };  

              // Stop browser 'catch up' when switching tabs
              wrapper.stop(true,true);

              // Fire animation function
              animate();

              // Loop our slideshow
              play();
            }, options.autoDelay );
          };
        };

        // Instantiate our play function
        play();
        
        // Define our pause function
        function pause() { clearTimeout(slideShow); };
        
        // Pause on hover (if selected)
        if ( options.hoverPause === true ) {
          wrapper.on({
            mouseenter: function() { pause(); }, 
            mouseleave: function() { play(); }
          });
        };
      }; 

      // Navigation click function
      navLink.on('click', function(e) {
        
        // Stop auto play (if instantiated)
        pause();

        // Add a class to keep animation stopped
        wrapper.addClass('stopped');
        
        // Set counter to new slide position
        counter = $(this).parent().index();
        
        // Fire animation function
        animate();
        
        // Prevent default click action
        e.preventDefault();
      });   

      // Define our animation function
      function animate() {
      
        // Iterate through our navigation links
        navLink.each(function() {
      
          // Cache 'this'
          var currentLink = $(this);          
      
          // Move to counter's position
          if ( counter === currentLink.parent().index() ) {
            navLink.removeClass('active'); // Clear 'active' class
            currentLink.addClass('active'); // And add to selected link
          }
        });

        // Animation
        wrapper
          .css( prefix + 'transition' , prefix + 'transform ' + options.animSpeed ) // Apply transition
          .css( prefix + 'transform' , 'translate(-' + counter * element.width() + 'px, 0)' ) // Animate
          .bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() { 
            wrapper.css( prefix + 'transition' , 'none' ); // Kill transition once animation completes
          });
      }; 

      // Define debulked onresize handler
      function on_resize(c, t) { onresize = function() { clearTimeout(t); t = setTimeout(c, 100) }; return c }; 
      
      // Instantiate resize function      
      on_resize(function() {
      
        // Cache our slider width
        var newWidth = element.width();        
      
        // Set wrapper width & reposition
        wrapper
          .css({ 'width' : newWidth * slideCnt })
          .css( prefix + 'transform' , 'translate(-' + counter * newWidth + 'px, 0)' );        
      
        // Set slide width
        slide.css({ 'width' : newWidth }); 
      })();    
    });
  };

  // Overridable default options
  $.fn.slimSlider.options = {
    animSpeed  : '0.5s', // animation speed
    autoPlay   : true,   // auto play option
    autoDelay  : 4000,   // auto play duration
    hoverPause : true    // auto play pause on hover      
  };

})( jQuery, window, document );