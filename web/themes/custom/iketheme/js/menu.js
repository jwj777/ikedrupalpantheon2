document.addEventListener('DOMContentLoaded', function () {
  
  // Get the About Us link and dropdown elements
  var aboutUsLink = document.getElementById('aboutUsLink');
  var aboutUsDropdown = document.getElementById('aboutUsDropdown');

  // Initially hide the About Us dropdown
  aboutUsDropdown.style.display = 'none';

  // Add a click event listener to the About Us link
  aboutUsLink.addEventListener('click', function (event) {
    // Prevent the default action
    event.preventDefault();
    // Toggle the display of the About Us dropdown and hide the Education dropdown
    if (aboutUsDropdown.style.display === 'none') {
      aboutUsDropdown.style.display = 'flex';
      eduDropdown.style.display = 'none'; // Hide the Education dropdown
    } else {
      aboutUsDropdown.style.display = 'none';
    }
  });

  var eduLink = document.getElementById('eduLink');
  var eduDropdown = document.getElementById('eduDropdown');

  // Initially hide the Education dropdown
  eduDropdown.style.display = 'none';

  // Add a click event listener to the Education link
  eduLink.addEventListener('click', function (event) {
    // Prevent the default action
    event.preventDefault();
    // Toggle the display of the Education dropdown and hide the About Us dropdown
    if (eduDropdown.style.display === 'none') {
      eduDropdown.style.display = 'flex';
      aboutUsDropdown.style.display = 'none'; // Hide the About Us dropdown
    } else {
      eduDropdown.style.display = 'none';
    }
  });

});
