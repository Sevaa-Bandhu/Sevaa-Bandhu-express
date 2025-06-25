document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("workerSearch");
    const searchForm = document.getElementById("workerSearchForm");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = Array.from(document.querySelectorAll(".worker-card"));
    const workerContainer = document.querySelector('.worker-container');
    const pagination = document.getElementById('paginationControls');

    const suggestions = [
        "Search by worker name",
        "Search for location",
        "Search required experience",
        "Search for a skill"
    ];

    let suggestionIndex = 0, charIndex = 0, typing = true;
    let currentText = "";
    let currentPage = 1;
    const cardsPerPage = 12;

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

    // Display cards for current page
    function displayPage(page, data = cards) {
        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;

        cards.forEach(card => card.style.display = 'none');
        data.slice(start, end).forEach(card => card.style.display = 'flex');

        renderPagination(data.length, page, data);
    }

    // Render pagination buttons
    function renderPagination(totalItems, currentPage, data) {
        const totalPages = Math.ceil(totalItems / cardsPerPage);
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = i === currentPage ? "active" : "";
            btn.addEventListener("click", () => {
                currentPage = i;
                displayPage(currentPage, data);
            });
            pagination.appendChild(btn);
        }
    }

    // Skill filter button click
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedSkill = btn.dataset.skill.toLowerCase();

            input.value = "";
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filtered = cards.filter(card =>
                selectedSkill === "all" || card.dataset.skill === selectedSkill
            );

            currentPage = 1;
            displayPage(currentPage, filtered);
        });
    });

    // Search form submission
    searchForm.addEventListener("submit", e => {
        e.preventDefault();
        const keyword = input.value.trim().toLowerCase();

        filterButtons.forEach(b => b.classList.remove("active"));

        const filtered = cards.filter(card => {
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

            return fields.some(field => field && field.includes(keyword));
        });

        currentPage = 1;
        displayPage(currentPage, filtered);
    });

    // Initial display of all cards
    displayPage(currentPage, cards);
});
