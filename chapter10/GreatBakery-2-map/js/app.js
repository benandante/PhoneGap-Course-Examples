// patching the touch and click event.
if (window.Touch) {
  $('a').bind('touchstart', function(e) {
    e.preventDefault();
  });
  $('a').bind('touchend', function(e) {
    e.preventDefault();
    return $(this).trigger('click');
  });
}

// Model
// Anything related to data querying and manipulation
;(function($){
  var app = this.app || (this.app={});


}).call(this, jQuery);

// View
// Anything that belongs to interface.
;(function($){
  var app = this.app || (this.app={});

  app.view = {}

}).call(this, jQuery);

// Controller Logic
// Glue the model and view together
;(function($){

  // Entry point
  $(function(){
    $.mobile.defaultPageTransition = 'slide';

    $(document).bind('pageshow', function(event, ui) {
      if ( $(event.target).attr('id') === 'map' ) {
        $('#map-element').gmap('addMarker', {'position': '22.191572,113.541553', 'bounds': true})
      }
    });
  });

}).call(this, jQuery);

