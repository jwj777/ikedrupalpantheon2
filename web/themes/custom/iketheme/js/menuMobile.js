
function toggleMenu(event) {
  event.preventDefault();
  const menu = document.getElementById("mobile-nav-container");
  const body = document.body;

  if (!menu) {
    console.error("Mobile menu container not found.");
    return;
  }

  if (menu.classList.contains("visible")) {
    menu.classList.remove("visible");
    body.classList.remove("menu-open");
  } else {
    menu.classList.add("visible");
    body.classList.add("menu-open");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");

  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", event => {
      event.preventDefault(); // Prevent default link behavior

      const dropdown = trigger.nextElementSibling; // Find the corresponding dropdown
      if (!dropdown || !dropdown.classList.contains("accordionToggle")) {
        console.error("Dropdown not found for:", trigger);
        return;
      }

      const isVisible = dropdown.classList.contains("visible");

      // Close all other dropdowns
      document.querySelectorAll(".accordionToggle.visible").forEach(openDropdown => {
        if (openDropdown !== dropdown) {
          openDropdown.classList.remove("visible");
          openDropdown.style.maxHeight = null; // Reset height
        }
      });

      // Toggle the clicked dropdown
      if (isVisible) {
        dropdown.classList.remove("visible");
        dropdown.style.maxHeight = null; // Collapse
      } else {
        dropdown.classList.add("visible");
        dropdown.style.maxHeight = dropdown.scrollHeight + "px"; // Expand
      }
    });
  });
});
