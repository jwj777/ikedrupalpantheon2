document.addEventListener('DOMContentLoaded', function () {
  console.log("Form script loaded!");

  function initializeForm() {
    const formItems = document.querySelectorAll('.webform-submission-form .form-item');

    console.log(`Found ${formItems.length} form items`);
    if (formItems.length === 0) {
      console.warn("No form items found. Retrying in 500ms...");
      setTimeout(initializeForm, 500); 
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


(function (Drupal, once) {
  Drupal.behaviors.hideSearchLabel = {
    attach(context, settings) {
      const inputs = once('hide-search-label', 'input#edit-keys', context);

      inputs.forEach((input) => {
        const label = input.closest('form')?.querySelector('label[for="edit-keys"]');
        if (!label) return;

        console.log('Attaching hideSearchLabel behavior');

        function checkInput() {
          label.style.display = input.value.trim() !== '' ? 'none' : 'block';
        }

        input.addEventListener('focus', () => {
          console.log('Focus event triggered');
          label.style.display = 'none';
        });

        input.addEventListener('blur', () => {
          console.log('Blur event triggered');
          checkInput();
        });

        checkInput();
      });
    }
  };
})(Drupal, once);

