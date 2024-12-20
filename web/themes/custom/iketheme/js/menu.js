document.addEventListener('DOMContentLoaded', function () {
  
  // Get the About Us link and dropdown elements
  var aboutUsLink = document.getElementById('aboutUsLink');
  var aboutUsDropdown = document.getElementById('aboutUsDropdown');

  var ikesLifeLink = document.getElementById('ikesLifeLink');
  var ikesLifeDropdown = document.getElementById('ikesLifeDropdown');
  
  // Get the Education link and dropdown elements
  var eduLink = document.getElementById('eduLink');
  var eduDropdown = document.getElementById('eduDropdown');
  
  // Get the Visit link and dropdown elements
  var visitLink = document.getElementById('visitLink');
  var visitDropdown = document.getElementById('visitDropdown');

  // Get the join link and dropdown elements
  var joinLink = document.getElementById('joinLink');
  var joinDropdown = document.getElementById('joinDropdown');

  // Initially hide all dropdowns
  aboutUsDropdown.style.display = 'none';
  ikesLifeDropdown.style.display = 'none';
  eduDropdown.style.display = 'none';
  visitDropdown.style.display = 'none';
  joinDropdown.style.display = 'none';

  // Function to hide all dropdowns
  function hideAllDropdowns() {
    aboutUsDropdown.style.display = 'none';
    ikesLifeDropdown.style.display = 'none';
    eduDropdown.style.display = 'none';
    visitDropdown.style.display = 'none';
    joinDropdown.style.display = 'none';
  }

  // Add click event listener for the About Us link
  aboutUsLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (aboutUsDropdown.style.display === 'none') {
      hideAllDropdowns();  // Hide all other dropdowns
      aboutUsDropdown.style.display = 'flex';  // Show the About Us dropdown
    } else {
      aboutUsDropdown.style.display = 'none';  // Toggle to hide it
    }
  });

  ikesLifeLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (ikesLifeDropdown.style.display === 'none') {
      hideAllDropdowns();  // Hide all other dropdowns
      ikesLifeDropdown.style.display = 'flex';  // Show the About Us dropdown
    } else {
      ikesLifeDropdown.style.display = 'none';  // Toggle to hide it
    }
  });

  // Add click event listener for the Education link
  eduLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (eduDropdown.style.display === 'none') {
      hideAllDropdowns();  // Hide all other dropdowns
      eduDropdown.style.display = 'flex';  // Show the Education dropdown
    } else {
      eduDropdown.style.display = 'none';  // Toggle to hide it
    }
  });

  // Add click event listener for the Visit link
  visitLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (visitDropdown.style.display === 'none') {
      hideAllDropdowns();  // Hide all other dropdowns
      visitDropdown.style.display = 'flex';  // Show the Visit dropdown
    } else {
      visitDropdown.style.display = 'none';  // Toggle to hide it
    }
  });

  // Add click event listener for the Visit link
  joinLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (joinDropdown.style.display === 'none') {
      hideAllDropdowns();  // Hide all other dropdowns
      joinDropdown.style.display = 'flex';  // Show the join dropdown
    } else {
      joinDropdown.style.display = 'none';  // Toggle to hide it
    }
  });

});
