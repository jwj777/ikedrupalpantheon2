document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.getElementById("block-iketheme-mainnavigation2-2"); 
  const mobileMenuIcon = document.querySelector(".mobile-menu-icon a"); 
  // const topLevelItems = mobileMenu.querySelectorAll(".menu-level-0 > li"); 

  function toggleMenu(event) {
    event.preventDefault();
    mobileMenu.classList.toggle("mobile-menu-open");
  }

  // Attach event listener to mobile menu button
  mobileMenuIcon.addEventListener("click", toggleMenu);

  // Handle accordion-style submenu behavior and add dropdown icons
  // topLevelItems.forEach((li) => {
  //   const link = li.querySelector(":scope > a"); // Direct <a> child
  //   const submenu = li.querySelector(":scope > .menu-level-1"); // Direct submenu

  //   if (submenu) {
  //     // Create and insert dropdown SVG
  //     const dropdownIcon = document.createElement("span");
  //     dropdownIcon.innerHTML = `
  //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="dropdown-icon">
  //         <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  //       </svg>
  //     `;
  //     dropdownIcon.classList.add("menu-dropdown-icon");

  //     // Append icon to link if not already added
  //     if (!link.querySelector(".menu-dropdown-icon")) {
  //       link.appendChild(dropdownIcon);
  //     }

  //     // Add click event to toggle submenu visibility
  //     link.addEventListener("click", function (event) {
  //       event.preventDefault();

  //       // Check if this menu is already active
  //       const isActive = li.classList.contains("active");

  //       // Close all other submenus
  //       topLevelItems.forEach((otherLi) => {
  //         otherLi.classList.remove("active");
  //         const otherSubmenu = otherLi.querySelector(":scope > .menu-level-1");
  //         if (otherSubmenu) {
  //           otherSubmenu.style.maxHeight = null;
  //         }
  //         const otherIcon = otherLi.querySelector(".dropdown-icon");
  //         if (otherIcon) {
  //           otherIcon.style.transform = "rotate(0deg)";
  //         }
  //       });

  //       // Toggle this submenu
  //       if (!isActive) {
  //         li.classList.add("active");
  //         submenu.style.maxHeight = submenu.scrollHeight + "px";

  //         // Rotate the icon
  //         dropdownIcon.querySelector("svg").style.transform = "rotate(180deg)";
  //       } else {
  //         li.classList.remove("active");
  //         submenu.style.maxHeight = null;

  //         // Reset icon rotation
  //         dropdownIcon.querySelector("svg").style.transform = "rotate(0deg)";
  //       }
  //     });
  //   }
  // });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!mobileMenu.contains(event.target) && !mobileMenuIcon.contains(event.target)) {
      mobileMenu.classList.remove("mobile-menu-open");
      topLevelItems.forEach((li) => {
        li.classList.remove("active");
        const submenu = li.querySelector(":scope > .menu-level-1");
        if (submenu) submenu.style.maxHeight = null;

        // Reset icon rotation
        const icon = li.querySelector(".dropdown-icon svg");
        if (icon) {
          icon.style.transform = "rotate(0deg)";
        }
      });
    }
  });
});
