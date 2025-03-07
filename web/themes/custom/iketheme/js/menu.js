// document.addEventListener('DOMContentLoaded', function () {
//   const menuItems = [
//     { linkId: 'aboutUsLink', dropdownId: 'aboutUsDropdown' },
//     { linkId: 'ikesLifeLink', dropdownId: 'ikesLifeDropdown' },
//     { linkId: 'eduLink', dropdownId: 'eduDropdown' },
//     { linkId: 'soldiersLink', dropdownId: 'soldiersDropdown' },
//     { linkId: 'visitLink', dropdownId: 'visitDropdown' },
//     { linkId: 'joinLink', dropdownId: 'joinDropdown' },
//   ];

//   const dropdowns = menuItems.map(item => document.getElementById(item.dropdownId));

//   function hideAllDropdowns() {
//     console.log('Hiding all dropdowns...');
//     dropdowns.forEach(dropdown => {
//       if (dropdown) {
//         dropdown.style.display = 'none';
//       }
//     });
//     document.body.className = document.body.className
//       .split(' ')
//       .filter(cls => !cls.startsWith('dropdown-visible-'))
//       .join(' ');
//   }

//   menuItems.forEach(({ linkId, dropdownId }) => {
//     const link = document.getElementById(linkId);
//     const dropdown = document.getElementById(dropdownId);

//     if (link && dropdown) {
//       // Add click event listener to the link
//       link.addEventListener('click', function (event) {
//         event.preventDefault();
//         event.stopPropagation(); // Prevent click event from reaching the document

//         const isVisible = dropdown.style.display === 'flex';
//         hideAllDropdowns();

//         if (!isVisible) {
//           console.log('Showing dropdown and adding class:', `dropdown-visible-${dropdownId}`);
//           dropdown.style.display = 'flex';
//           document.body.classList.add(`dropdown-visible-${dropdownId}`);
//         }
//       });

//       // Prevent clicks inside the dropdown from closing it
//       dropdown.addEventListener('click', function (event) {
//         event.stopPropagation();
//       });
//     } else {
//       console.error('Missing link or dropdown:', { linkId, dropdownId });
//     }
//   });

//   // Optional: Close dropdowns when clicking outside
//   document.addEventListener('click', function () {
//     console.log('Clicked outside dropdowns. Hiding all.');
//     hideAllDropdowns();
//   });
// });
