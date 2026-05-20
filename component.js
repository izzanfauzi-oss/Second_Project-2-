// components.js - Handles global website elements

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. MANUFACTURE THE FLOATING CAPSULE BUTTON
    const toggleButton = document.createElement("button");
    toggleButton.id = "bwToggle";
    toggleButton.innerText = "🌓 B&W Mode";
    toggleButton.setAttribute("aria-label", "Toggle black and white accessibility contrast mode");
    toggleButton.setAttribute("title", "Switch between color mode and high-contrast grayscale mode");
    
    // CSS styling for uniform floating positioning
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "20px";
    toggleButton.style.right = "20px";
    toggleButton.style.zIndex = "10001";
    toggleButton.style.padding = "10px 15px";
    toggleButton.style.fontSize = "0.9rem";
    toggleButton.style.fontWeight = "bold";
    toggleButton.style.backgroundColor = "#2c3e50";
    toggleButton.style.color = "#ffffff";
    toggleButton.style.border = "1px solid rgba(255, 255, 255, 0.2)";
    toggleButton.style.borderRadius = "30px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";

    // Hover interactions
    toggleButton.onmouseover = function() {
        this.style.backgroundColor = "#1a252f";
        this.style.transform = "scale(1.05)";
    };
    toggleButton.onmouseout = function() {
        this.style.backgroundColor = "#2c3e50";
        this.style.transform = "scale(1)";
    };

    document.body.appendChild(toggleButton);

    // 🌟 FIXED: Target document.documentElement (the <html> tag) instead of body
    if (localStorage.getItem("bwMode") === "on") {
        document.documentElement.classList.add("grayscale");
    }

    // 🌟 FIXED: Toggle the class on the <html> tag
    toggleButton.addEventListener("click", () => {
        document.documentElement.classList.toggle("grayscale");

        if (document.documentElement.classList.contains("grayscale")) {
            localStorage.setItem("bwMode", "on");
        } else {
            localStorage.setItem("bwMode", "off");
        }
    });

    // 4. EXISTING LOGIC: Modular Structural Footer Fetch Injection
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