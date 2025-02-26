

document.addEventListener("DOMContentLoaded", function () {
  // Select the desktop navigation container
  const desktopNav = document.getElementById("block-iketheme-mainnavigation2");

  if (!desktopNav) return; // Exit if desktop nav isn't found

  // Select all top-level menu items that have submenus inside the desktop nav
  const topLevelItems = desktopNav.querySelectorAll(".menu-level-0 > li");

  topLevelItems.forEach((li) => {
    const link = li.querySelector(":scope > a"); // Direct <a> child
    const submenu = li.querySelector(":scope > .menu-level-1"); // Direct submenu

    if (submenu) {
      // Create the SVG element
      const svg = document.createElement("span");
      svg.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="dropdown-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      `;
      svg.classList.add("menu-dropdown-icon");

      // Append the SVG only to top-level links with submenus
      link.appendChild(svg);

      // Add click event to toggle submenu visibility
      link.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Check if this menu is already active
        const isActive = li.classList.contains("active");

        // Close all other submenus
        topLevelItems.forEach((otherLi) => {
          otherLi.classList.remove("active");
          const otherSubmenu = otherLi.querySelector(":scope > .menu-level-1");
          if (otherSubmenu) {
            otherSubmenu.style.display = "none";
          }
          const otherIcon = otherLi.querySelector(".dropdown-icon");
          if (otherIcon) {
            otherIcon.style.transform = "rotate(0deg)";
          }
        });

        // Toggle this submenu
        if (!isActive) {
          li.classList.add("active");
          submenu.style.display = "block";
          const icon = link.querySelector(".dropdown-icon");
          if (icon) {
            icon.style.transform = "rotate(180deg)";
          }
        }
      });
    }
  });

  // Close menus when clicking outside
  document.addEventListener("click", function () {
    topLevelItems.forEach((li) => {
      li.classList.remove("active");
      const submenu = li.querySelector(":scope > .menu-level-1");
      if (submenu) submenu.style.display = "none";

      // Reset icon rotation
      const icon = li.querySelector(".dropdown-icon");
      if (icon) {
        icon.style.transform = "rotate(0deg)";
      }
    });
  });
});
