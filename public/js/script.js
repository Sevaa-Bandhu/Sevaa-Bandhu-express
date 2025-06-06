document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".worker-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const skill = btn.dataset.skill;

            // Highlight the selected button
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            cards.forEach(card => {
                if (skill === "all" || card.dataset.skill === skill) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    const input = document.getElementById("workerSearch");
    const suggestions = [
        "search by worker name",
        "search for location",
        "search required experience",
        "search for a skill"
    ];

    let currentText = '';
    let suggestionIndex = 0;
    let charIndex = 0;
    let typing = true;

    function typeSuggestion() {
        if (typing) {
            if (charIndex < suggestions[suggestionIndex].length) {
                currentText += suggestions[suggestionIndex].charAt(charIndex);
                input.setAttribute("placeholder", currentText);
                charIndex++;
                setTimeout(typeSuggestion, 100);
            } else {
                typing = false;
                setTimeout(typeSuggestion, 1200);
            }
        } else {
            if (charIndex > 0) {
                currentText = currentText.slice(0, -1);
                input.setAttribute("placeholder", currentText);
                charIndex--;
                setTimeout(typeSuggestion, 50);
            } else {
                typing = true;
                suggestionIndex = (suggestionIndex + 1) % suggestions.length;
                setTimeout(typeSuggestion, 400);
            }
        }
    }
    typeSuggestion();

    // search from search box
    document.getElementById("workerSearchForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const keyword = document.getElementById("workerSearch").value.trim().toLowerCase();
        const cards = document.querySelectorAll(".worker-card");

        cards.forEach(card => {
            const skill = card.getAttribute("data-skill");
            if (!keyword || skill.includes(keyword)) {
                card.style.display = "flex"; // show matching or all if empty
            } else {
                card.style.display = "none"; // hide others
            }
        });
    });
});