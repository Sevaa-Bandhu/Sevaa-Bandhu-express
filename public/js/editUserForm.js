function attachEditFormLogic() {
    window.openDocumentPopup = function (aadhar) {
        const modal = document.getElementById('viewDocsModal');
        const input = document.getElementById('docSearchInput');
        const form = document.getElementById('viewDocsForm');

        if (!modal || !input || !form) return;

        modal.style.display = 'flex';
        input.value = aadhar;
        form.dispatchEvent(new Event('submit'));
    };

    // Show Admin Message toast popup
    function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

    const searchForm = document.getElementById('searchUserForm');
    const userForm = document.getElementById('editUserForm');
    const docContainer = document.getElementById('docLinkContainer');

    if (!searchForm || !userForm) return;

    const updateBtn = document.getElementById('updateBtn');
    const editBtn = document.getElementById('editToggleBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const keyword = searchForm.keyword.value.trim();
        const role = searchForm.dataset.role;

        try {
            const res = await fetch(`/admin/edit-fetch?role=${role}&keyword=${encodeURIComponent(keyword)}`);
            const data = await res.json();
            if (!data || !data._id)
                return showToast("User not found", 'error');

            // Populate form fields
            Object.entries(data).forEach(([key, value]) => {
                // If key is _id, populate hidden 'id' input
                if (key === '_id') {
                    const idField = userForm.querySelector('[name="id"]');
                    if (idField) idField.value = value;
                } else {
                    const field = userForm.querySelector(`[name="${key}"]`);
                    if (field) field.value = value;
                }
            });

            // Make all fields readonly again
            [...userForm.elements].forEach(el => {
                if (!['role', 'id'].includes(el.name)) el.setAttribute('readonly', true);
            });

            updateBtn.style.display = 'none';

            // ✅ Insert View Documents Button
            if (role === 'worker' && data.aadhar_number) {
                docContainer.innerHTML = `
                    <label>Documents</label><br>
                    <button type="button" class="doc-btn" onclick="openDocumentPopup('${data.aadhar_number}')">
                        View Uploaded Documents
                    </button>
                `;
            } else {
                docContainer.innerHTML = '';
            }

        } catch (err) {
            showToast('Fetch failed', 'error');
            console.error(err);
        }
    });

    editBtn?.addEventListener('click', () => {
        [...userForm.elements].forEach(el => {
            if (!['role', 'id'].includes(el.name)) el.removeAttribute('readonly');
        });
        updateBtn.style.display = 'inline-block';
    });

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = Object.fromEntries(new FormData(userForm).entries());
        const res = await fetch('/admin/update-user', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        showToast(result.message, result.success ? 'success' : 'error');
    });

    deleteBtn?.addEventListener('click', async () => {
        if (!confirm("Are you sure?")) return;
        const id = userForm.id.value;
        const role = userForm.role.value;

        const res = await fetch('/admin/delete-user', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, role })
        });

        const result = await res.json();
        showToast(result.message, result.success ? 'success' : 'error');
        userForm.reset();
    });
}
