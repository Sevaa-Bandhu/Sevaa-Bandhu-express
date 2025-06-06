function showPopup(message, isSuccess = true) {
    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: isSuccess ? 'Success' : 'Error',
        text: message,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('updateProfileForm');
    const editBtn = document.getElementById('editProfileBtn');
    const updateBtn = document.getElementById('updateProfileBtn');
    const deleteBtn = document.getElementById('deleteAccountBtn');
    const deleteConfirmation = document.getElementById('deleteConfirmation');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    // Disable all input fields (except readonly) by default
    const fields = updateForm.querySelectorAll('input:not([readonly]):not([type="hidden"]), select');
    fields.forEach(field => field.setAttribute('disabled', true));

    // Enable edit mode
    editBtn.addEventListener('click', () => {
        fields.forEach(field => field.removeAttribute('disabled'));
        updateBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
        deleteConfirmation.style.display = 'none'; // hide delete box if open
    });

    // Submit profile update
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(updateForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                showPopup(data.message);
                setTimeout(() => {window.location.reload();}, 2500);
            } else {
                showPopup(data.message, false);
            }
        } catch (err) {
            console.error('Update error:', err);
            showPopup('Server error while updating profile', false);
        }
    });

    // Show delete confirmation UI
    deleteBtn.addEventListener('click', () => {
        deleteConfirmation.style.display = 'block';
        updateBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
        fields.forEach(field => field.setAttribute('disabled', true));
    });

    // Submit delete request
    confirmDeleteBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/profile/delete', {
                method: 'POST'
            });

            const data = await res.json();
            if (data.success) {
                showPopup('Account deleted successfully. Redirecting...', true);
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                showPopup(data.message || 'Failed to delete account.', false);
            }
        } catch (err) {
            console.error("Delete error:", err);
            showPopup("Server error while deleting account", false);
        }
    });

    // Cancel delete confirmation
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteConfirmation.style.display = 'none';
        });
    }
});
