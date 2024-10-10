
document.addEventListener('DOMContentLoaded', function () {
  const formItems = document.querySelectorAll('.webform-submission-form .form-item');

  formItems.forEach(function (formItem) {
    const input = formItem.querySelector('input');
    const label = formItem.querySelector('label');

    // Check if input contains text on page load and apply 'active' class
    if (input.value.trim() !== '') {
      label.classList.add('active');
    }

    // Add 'active' class when input is focused
    input.addEventListener('focus', function () {
      label.classList.add('active');
    });

    // Remove 'active' class when input loses focus, but only if input is empty
    input.addEventListener('blur', function () {
      if (input.value.trim() === '') {
        label.classList.remove('active');
      }
    });
  });
});
