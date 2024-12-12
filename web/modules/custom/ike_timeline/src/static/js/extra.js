(function($) {
  $(document).ready(function() {

    // window.onbeforeunload = function () {
    //   document.location = "/";
    // }

    window.onpopstate = function(event) {
      history.replaceState({}, "", "/timeline");

      // If we want to set a parameter on back button. Introduces issues with dynamic height setting
      //history.replaceState({}, "", "?wrap=true")
    }

    $('.credits').on('click', function () {
      if ($('.about-section').hasClass('closed')) {
        $('.about-section').removeClass('closed');
        $('.about-section').addClass('open');
      }
    });

    $('.about-section .close-button').on('click', function () {
      if ($('.about-section').hasClass('open')) {
        $('.about-section').removeClass('open');
        $('.about-section').addClass('closed');
      }
    });

    /* Mobile Credits */
    $('.mobile-credits').on('click', function () {
      if ($('.mobile-credits-box').hasClass('closed')) {
        $('.mobile-credits-box').removeClass('closed');
        $('.mobile-credits-box').addClass('open');
        $('.mobile-credits').html('Credits &#9650;');

      } else {
        $('.mobile-credits-box').removeClass('open');
        $('.mobile-credits-box').addClass('closed');
        $('.mobile-credits').html('Credits &#9660;');
      }
    });

  });
})(jQuery);
