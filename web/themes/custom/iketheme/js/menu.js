

document.addEventListener('DOMContentLoaded', function () {
  // Get the About Us link and dropdown elements
  var aboutUsLink = document.getElementById('aboutUsLink');
  var aboutUsDropdown = document.getElementById('aboutUsDropdown');

  // Add a click event listener to the About Us link
  aboutUsLink.addEventListener('click', function (event) {
    // Prevent the default action
    event.preventDefault();
    // Toggle the display of the dropdown
    if (aboutUsDropdown.style.display === 'none') {
      aboutUsDropdown.style.display = 'flex';
    } else {
      aboutUsDropdown.style.display = 'none';
    }
  });
});