

// Focus effects for search bar on ike soldiers and primary source search

// document.addEventListener('DOMContentLoaded', function () {
//   var input = document.getElementById('edit-keys');
//   var label = document.querySelector('label[for="edit-keys"]');
//   var body = document.querySelector('body');

//   function checkInput() {
//     console.log("Running checkInput, input value:", input.value);
//     if (input.value.trim() === '') {
//       console.log("input is blank");
//       label.classList.remove('hidden-label');
//     } else {
//       console.log("input is NOT blank");
//       label.style.display = '';
//       body.classList.add('hidden-label');
//       console.log("label class list: ", label.classList);
//       console.log("label element: ", label);
//       console.log("is label still in DOM? ", document.body.contains(label));
//     }
//   }

//   input.addEventListener('focus', function () {
//     console.log("focused");
//     checkInput();
//   });

//   input.addEventListener('blur', function () {
//     console.log("blur");
//     checkInput();
//   });

//   checkInput(); // initial
// });


// (function ($, Drupal) {
//   Drupal.behaviors.hideSearchLabel = {
//     attach: function (context, settings) {
//       // const $input = $('#edit-keys', context).once('hide-search-label');
//       const $input = $('[name="keys"]', context);
//       const $label = $('label[for="edit-keys"]', context);
//       const $form = $input.closest('form');

//       if (!$input.length || !$label.length || !$form.length) return;

//       function checkInput() {
//         const val = $input.val().trim();
//         if (val === '') {
//           $label.removeClass('hidden-label');
//         } else {
//           $label.addClass('hidden-label');
//         }
//       }

//       // Hook into typing/focus
//       $input.on('focus blur input', checkInput);

//       // Hook into form submission (manual or auto)
//       $form.on('submit', function () {
//         console.log("form submitted -----");
//         setTimeout(checkInput, 50); // Allow DOM updates or AJAX to complete
//       });

//       $form.on('bef-exposed-form-submit', function () {
//         console.log('B.E.F. form auto-submitted');
//         setTimeout(checkInput, 50);
//       });

//       // Initial check
//       checkInput();
//     }
//   };
// })(jQuery, Drupal);


// (function ($, Drupal) {
//   Drupal.behaviors.hideSearchLabel = {
//     attach: function (context, settings) {
//       console.log("Attaching hideSearchLabel behavior");

//       const $input = $('[name="keys"]', context).once('hide-search-label');
//       const $label = $('label[for^="edit-keys"]', context);

//       if (!$input.length || !$label.length) return;

//       function checkInput() {
//         const val = $input.val().trim();
//         if (val === '') {
//           $label.removeClass('hidden-label');
//         } else {
//           $label.addClass('hidden-label');
//         }
//       }

//       $input.on('focus', function () {
//         console.log("Event: focus");
//         checkInput();
//       });

//       $input.on('input', function () {
//         console.log("Event: input");
//         checkInput();
//       });

//       $input.on('blur', function () {
//         console.log("Event: blur — delaying check");
//         setTimeout(() => {
//           checkInput();
//         }, 50); // Allow DOM to settle after blur and possible AJAX trigger
//       });

//       checkInput(); // Initial
//     }
//   };
// })(jQuery, Drupal);


