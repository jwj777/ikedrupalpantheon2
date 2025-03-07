document.addEventListener('DOMContentLoaded', function () {
  console.log("Form script loaded!");

  function initializeForm() {
    const formItems = document.querySelectorAll('.webform-submission-form .form-item');

    console.log(`Found ${formItems.length} form items`);

    if (formItems.length === 0) {
      console.warn("No form items found. Retrying in 500ms...");
      setTimeout(initializeForm, 500); // Retry after delay
      return;
    }

    formItems.forEach(function (formItem, index) {
      const input = formItem.querySelector('input, select');
      const label = formItem.querySelector('label');

      if (!input || !label) {
        console.warn(`Skipping form item ${index}: Missing input or label`);
        return;
      }

      console.log(`Processing input: ${input.name || input.id}`);

      function checkInput() {
        if (input.value.trim() !== '') {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      }

      checkInput();

      input.addEventListener('focus', function () {
        label.classList.add('active');
      });

      input.addEventListener('blur', function () {
        checkInput();
      });

      if (input.tagName === 'SELECT') {
        input.addEventListener('change', function () {
          checkInput();
        });
      }
    });
  }

  initializeForm();
});
