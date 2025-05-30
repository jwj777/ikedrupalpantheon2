

// Focus effects for search bar on ike soldiers
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('edit-keys');
  var label = document.querySelector('label[for="edit-keys"]');

  function checkInput() {
    if (input.value.trim() !== '') {
      console.log("input is blank ")
      label.style.display = 'none';
    } else {
      console.log("input is NOT blank ")
      label.style.display = 'block';
    }
  }

  // Hide label on focus
  input.addEventListener('focus', function() {
    console.log("focused");
    label.style.display = 'none';
  });

  // Show/hide label on blur
  input.addEventListener('blur', function() {
    console.log("blur")
    checkInput();
  });

  // Initial check
  checkInput();
});
