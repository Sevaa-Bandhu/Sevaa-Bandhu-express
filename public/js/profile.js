// public/js/profile.js

// Show success/error popup
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
    const deleteForm = document.getElementById('deleteForm');

    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(updateForm);
        const payload = Object.fromEntries(formData.entries());

        // Basic validations
        if (!payload.firstname.trim() || !payload.lastname.trim() || !payload.address.trim() || !payload.city.trim() || !payload.state.trim() || !payload.region.trim()) {
            showPopup("Please fill in all required fields.", false);
            return;
        }

        if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            showPopup("Invalid email format.", false);
            return;
        }

        try {
            const res = await fetch('/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                showPopup(data.message);
            } else {
                showPopup(data.message, false);
            }
        } catch (err) {
            console.error("Profile update error:", err);
            showPopup("Server error while updating profile.", false);
        }
    });

    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'Your account will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!confirmation.isConfirmed) return;

        try {
            const res = await fetch('/profile/delete', {
                method: 'POST'
            });

            const data = await res.json();
            if (data.success) {
                showPopup('Account deleted successfully. Redirecting...', true);
                setTimeout(() => window.location.href = '/', 2000);
            } else {
                showPopup(data.message, false);
            }
        } catch (err) {
            console.error("Delete error:", err);
            showPopup("Server error while deleting account.", false);
        }
    });
});
