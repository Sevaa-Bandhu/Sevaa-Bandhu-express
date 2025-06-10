document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("workerSearch");
    const searchForm = document.getElementById("workerSearchForm");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".worker-card");

    const suggestions = [
        "Search by worker name",
        "Search for location",
        "Search required experience",
        "Search for a skill"
    ];

    let suggestionIndex = 0, charIndex = 0, typing = true;
    let currentText = "";

    // Typing animation for placeholder
    function typeSuggestion() {
        if (typing) {
            if (charIndex < suggestions[suggestionIndex].length) {
                currentText += suggestions[suggestionIndex][charIndex];
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

    // Filter by skill button
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedSkill = btn.dataset.skill.toLowerCase();

            // Clear search box
            input.value = "";

            // Highlight active filter
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            cards.forEach(card => {
                const cardSkill = card.dataset.skill.toLowerCase();
                if (selectedSkill === "all" || cardSkill === selectedSkill) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // Filter by search
    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        const keyword = input.value.trim().toLowerCase();

        // Remove active skill filter
        filterButtons.forEach(b => b.classList.remove("active"));

        cards.forEach(card => {
            const fields = [
                card.dataset.firstname,
                card.dataset.lastname,
                card.dataset.skill,
                card.dataset.experience,
                card.dataset.city,
                card.dataset.pincode,
                card.dataset.state,
                card.dataset.gender
            ];

            const matchFound = fields.some(field => field && field.includes(keyword));

            card.style.display = matchFound ? "flex" : "none";
        });
    });
});
