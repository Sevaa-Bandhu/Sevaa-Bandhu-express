// public/js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const dropdownBtn = document.getElementById("userDropdownBtn");
    const dropdownMenu = document.getElementById("userDropdownMenu");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
    }

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click from bubbling
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!dropdownBtn.contains(e.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }
});
