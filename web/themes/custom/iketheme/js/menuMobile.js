function toggleMenu(event) {
  event.preventDefault();
  const menu = document.getElementById("mobile-nav-container");
  const body = document.body;

  if (menu.classList.contains("visible")) {
    menu.classList.remove("visible");
    body.classList.remove("menu-open");
  } else {
    menu.classList.add("visible");
    body.classList.add("menu-open");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // Select all primary links
  const primaryLinks = document.querySelectorAll(".lvl1");

  primaryLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault(); // Prevent default link behavior

      // Find the parent `.nav1` and its associated `.accordionToggle`
      const navContainer = link.closest(".nav1");
      const accordionToggle = navContainer.querySelector(".accordionToggle");

      if (!accordionToggle) {
        console.error("Accordion toggle not found for:", link);
        return;
      }

      // Toggle visibility of the clicked accordion
      const isVisible = accordionToggle.classList.contains("visible");

      // Close all other accordions
      document.querySelectorAll(".accordionToggle").forEach(toggle => {
        if (toggle !== accordionToggle) {
          toggle.classList.remove("visible");
          toggle.style.maxHeight = null; // Reset max-height to collapse
        }
      });

      if (isVisible) {
        // Collapse the currently open accordion
        accordionToggle.classList.remove("visible");
        accordionToggle.style.maxHeight = null; // Reset max-height
      } else {
        // Expand the clicked accordion
        accordionToggle.classList.add("visible");
        accordionToggle.style.maxHeight = accordionToggle.scrollHeight + "px"; // Dynamically set max-height
      }
    });
  });
});








