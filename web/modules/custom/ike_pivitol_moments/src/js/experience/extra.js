/*jshint strict: false */

function checkHash() {
  var homeHash = [
    "#/west_point",
    "#/dday",
    "#/nato",
    "#/winning_the_presidency",
    "#/waging_peace",
    "#/little_rock",
    "#/space_race"
  ];
  return (homeHash.indexOf(window.location.hash) !== -1);
}

function checkWindow() {
  return (window.innerWidth >= 1500);
}

function handleLogo(hash, window) {
  if (hash && window) {
    $('.site-logo').addClass('logo-home');
    $('.site-logo').removeClass('logo-not-home');
  } else {
    $('.site-logo').removeClass('logo-home');
    $('.site-logo').addClass('logo-not-home');
  }
}

jQuery(document).ready(function($) {
  handleLogo(checkHash(), checkWindow());

  $(window).on('resize', function () {
    handleLogo(checkHash(), checkWindow());
  });

  $('body').on('click', '.intro-text .enter', function () {
    handleLogo(false, checkWindow());
  });

  $('body').on('click', '.theme-ul .option', function () {
    setTimeout(
      function()
      {
        handleLogo(checkHash(), checkWindow());
      }, 500);
  });
});
