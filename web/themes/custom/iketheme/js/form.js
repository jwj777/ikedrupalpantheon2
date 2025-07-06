

// Hide Search Label - Primary Source Search
// (function (Drupal, once) {
//   Drupal.behaviors.hideSearchLabel = {
//     attach: function (context, settings) {
//       console.log("Attaching hideSearchLabel behavior");

//       const inputs = once('hide-search-label', '.view-primary-source-main input[name="keys"]', context);
//       inputs.forEach((input) => {
//         const label = input.closest('form')?.querySelector('label[for^="edit-keys"]');
//         if (!label) return;

//         function checkInput() {
//           const val = input.value.trim();
//           if (val === '') {
//             label.classList.remove('hidden-label');
//           } else {
//             label.classList.add('hidden-label');
//           }
//         }

//         input.addEventListener('focus', function () {
//           console.log('Focus event triggered');
//           label.classList.add('hidden-label'); // <-- force hide label on focus
//         });

//         input.addEventListener('blur', function () {
//           console.log('Blur event triggered');
//           setTimeout(checkInput, 50); // Allow DOM update after blur
//         });

//         input.addEventListener('input', function () {
//           checkInput();
//         });

//         checkInput();
//       });
//     }
//   };
// })(Drupal, once);



(function (Drupal, once) {
  Drupal.behaviors.hideSearchLabels = {
    attach: function (context, settings) {
      console.log("Attaching hideSearchLabels behavior");

      const configs = [
        {
          viewClass: '.view-primary-source-main',
          onceKey: 'hide-search-label',
          logSuffix: 'primary',
        },
        {
          viewClass: '.view-soliders-main',
          onceKey: 'hide-soldiers-search-label',
          logSuffix: 'soldiers',
        },
        {
          viewClass: '.view-lesson-plans',
          onceKey: 'hide-lesson-plans-search-label', 
          logSuffix: 'lesson-plans',
        }
      ];

      configs.forEach(({ viewClass, onceKey, logSuffix }) => {
        const selector = `${viewClass} input[name="keys"]`;
        const inputs = once(onceKey, selector, context);

        inputs.forEach((input) => {
          const label = input.closest('form')?.querySelector('label[for^="edit-keys"]');
          if (!label) return;

          function checkInput() {
            const val = input.value.trim();
            if (val === '') {
              label.classList.remove('hidden-label');
            } else {
              label.classList.add('hidden-label');
            }
          }

          input.addEventListener('focus', function () {
            console.log(`Focus event triggered (${logSuffix})`);
            label.classList.add('hidden-label');
          });

          input.addEventListener('blur', function () {
            console.log(`Blur event triggered (${logSuffix})`);
            setTimeout(checkInput, 50);
          });

          input.addEventListener('input', checkInput);
          checkInput();
        });
      });
    }
  };
})(Drupal, once);




document.addEventListener('DOMContentLoaded', function () {
  console.log("Form script loaded!");

  function initializeForm() {
    const formItems = document.querySelectorAll('.webform-submission-form .form-item');

    // console.log(`Found ${formItems.length} form items`);
    if (formItems.length === 0) {
      // console.warn("No form items found. Retrying in 500ms...");
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



