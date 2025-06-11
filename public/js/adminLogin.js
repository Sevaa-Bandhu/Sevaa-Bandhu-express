// public/js/adminLogin.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const mobileInput = document.getElementById('adminMobile');
    const passwordInput = document.getElementById('adminPassword');
    const togglePassword = document.getElementById('toggleLoginPassword');

    togglePassword.addEventListener('change', () => {
        passwordInput.type = togglePassword.checked ? 'text' : 'password';
    });

    form.addEventListener('submit', function (e) {
        const mobile = mobileInput.value.trim();
        const password = passwordInput.value.trim();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!/^\d{10}$/.test(mobile)) {
            alert('Please enter a valid 10-digit mobile number.');
            e.preventDefault();
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            e.preventDefault();
            return;
        }

        if (!passwordRegex.test(password)) {
            alert('Password must contain a uppercase, lowercase, number, and special character.');
            e.preventDefault();
        }
    });
});
