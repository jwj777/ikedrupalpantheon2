
document.addEventListener('DOMContentLoaded', () => {
  // Select all anchor tags
  const links = document.querySelectorAll('a');

  links.forEach(link => {
    // Check if the href matches the specified URL
    if (link.href.includes('https://interland3.donorperfect.net')) {
      link.setAttribute('target', '_blank'); // Set to open in a new tab
      link.setAttribute('rel', 'noopener noreferrer'); // Add security measures
    }
  });
});
