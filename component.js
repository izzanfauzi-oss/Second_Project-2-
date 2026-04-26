// components.js - Handles global website elements

// Wait for the HTML to load before trying to inject the footer
document.addEventListener("DOMContentLoaded", function() {
    
    // Check if the page actually has a footer placeholder
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading the footer:', error));
    }
});