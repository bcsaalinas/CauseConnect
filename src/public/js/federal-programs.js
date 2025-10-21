// Federal Programs Pagination
document.addEventListener('DOMContentLoaded', function() {
  // Handle checkbox for showing federal programs
  const showFederalCheckbox = document.getElementById('showFederal');
  if (showFederalCheckbox) {
    // Set initial state from URL params
    const urlParams = new URLSearchParams(window.location.search);
    showFederalCheckbox.checked = urlParams.get('showFederal') === 'true';
    
    // Handle checkbox changes
    showFederalCheckbox.addEventListener('change', function() {
      const currentUrl = new URL(window.location.href);
      const params = new URLSearchParams(currentUrl.search);
      
      if (this.checked) {
        params.set('showFederal', 'true');
        params.set('page', '1'); // Reset to first page when toggling
      } else {
        params.delete('showFederal');
        params.delete('page');
      }
      
      currentUrl.search = params.toString();
      window.location.href = currentUrl.toString();
    });
  }
  
  // Add animation classes to program cards
  const programCards = document.querySelectorAll('.program-card');
  programCards.forEach(card => {
    card.setAttribute('data-animate', 'float-card');
    card.classList.add('fade-up');
  });
});