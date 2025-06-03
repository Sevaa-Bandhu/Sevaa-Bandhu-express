// public/js/profile.js

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

    // Disable fields by default
    const fields = updateForm.querySelectorAll('input:not([readonly]), select');
    fields.forEach(field => field.setAttribute('disabled', true));

    // Enable edit
    editBtn.addEventListener('click', () => {
        fields.forEach(field => field.removeAttribute('disabled'));
        updateBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
    });

    // Submit updated profile
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
                fields.forEach(field => field.setAttribute('disabled', true));
                updateBtn.style.display = 'none';
                editBtn.style.display = 'inline-block';
            } else {
                showPopup(data.message, false);
            }
        } catch (err) {
            console.error('Update error:', err);
            showPopup('Server error while updating profile', false);
        }
    });

    // Show delete confirmation
    deleteBtn.addEventListener('click', () => {
        deleteConfirmation.style.display = 'block';
        updateBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
    });
});
