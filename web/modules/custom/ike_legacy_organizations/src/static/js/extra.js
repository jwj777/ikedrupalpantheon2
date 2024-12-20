/*jshint strict: false */

function handleLogo(hash) {
  if (hash === "#timeline-intro" || hash === "") {
    $('.site-logo').addClass('logo-home');
    $('.site-logo').removeClass('logo-not-home');
  } else {
    $('.site-logo').removeClass('logo-home');
    $('.site-logo').addClass('logo-not-home');
  }
}

jQuery(document).ready(function($) {

  handleLogo(window.location.hash);

  $(window).on('wheel', function () {
    setTimeout(
      function()
      {
        handleLogo(window.location.hash);
      }, 500);
  });

  $('a.legacy-org').on('click', function () {
    setTimeout(
      function()
      {
        handleLogo(window.location.hash);
      }, 500);
  });
});


