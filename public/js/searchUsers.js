document.getElementById("userSearchForm").addEventListener('submit', async (e) => {
    e.preventDefault();

    const keyword = form.keyword.value.trim();
    const role = form.getAttribute('data-role');

    // Basic validation
    if (!keyword || !role) {
        alert('Please enter a keyword and ensure role is defined.');
        return;
    }

    try {
        const response = await fetch(`/admin/search-users?role=${role}&q=${encodeURIComponent(keyword)}`);
        const html = await response.text();

        const resultSection = document.getElementById('adminContent');
        resultSection.innerHTML = html;
        resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        console.error('Search request failed:', err);
        alert('Something went wrong while searching. Please try again.');
    }
});