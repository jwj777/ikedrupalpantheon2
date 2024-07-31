

// Focus effects for search bar on ike soldiers
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('edit-keys');
  var label = document.querySelector('label[for="edit-keys"]');

  function checkInput() {
    if (input.value.trim() !== '') {
      label.style.display = 'none';
    } else {
      label.style.display = 'block';
    }
  }

  // Hide label on focus
  input.addEventListener('focus', function() {
    label.style.display = 'none';
  });

  // Show/hide label on blur
  input.addEventListener('blur', function() {
    checkInput();
  });

  // Initial check
  checkInput();
});
