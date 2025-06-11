// Utility: Show alert messages
function showPopup(message, isSuccess = true) {
    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: isSuccess ? 'Success' : 'Error',
        text: message,
        timer: 3500,
        timerProgressBar: true,
        showConfirmButton: false
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const mobileInput = document.getElementById('adminMobile');
    const passwordInput = document.getElementById('adminPassword');
    const togglePassword = document.getElementById('toggleLoginPassword');

    // Show/hide password
    togglePassword.addEventListener('change', () => {
        passwordInput.type = togglePassword.checked ? 'text' : 'password';
    });

    // Frontend form validation
    form.addEventListener('submit', function (e) {
        const mobile = mobileInput.value.trim();
        const password = passwordInput.value.trim();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!/^\d{10}$/.test(mobile)) {
            showPopup('Please enter a valid 10-digit mobile number.', false);
            e.preventDefault();
            return;
        }

        if (password.length < 8) {
            showPopup('Password must be at least 8 characters long.', false);
            e.preventDefault();
            return;
        }

        if (!passwordRegex.test(password)) {
            showPopup('Password must contain an uppercase, lowercase, number, and special character.', false);
            e.preventDefault();
        }
    });

    // 🔔 Show backend error (passed from EJS using hidden data attribute)
    const errorContainer = document.getElementById('serverError');
    if (errorContainer && errorContainer.dataset.error) {
        showPopup(errorContainer.dataset.error, false);
    }
});
