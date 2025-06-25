document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminProfileForm');
    const msg = document.getElementById('adminProfileMsg');
    const modal = document.getElementById('passwordModal');
    const passwordForm = document.getElementById('changePasswordForm');
    const passwordMsg = document.getElementById('passwordMsg');

    const showToast = (message, type = 'info') => {
        msg.textContent = message;
        msg.style.color = type === 'success' ? 'green' : type === 'error' ? 'red' : 'black';
        msg.style.display = 'block';
        setTimeout(() => {
            msg.textContent = '';
            msg.style.display = 'none';
        }, 2500);
    };

    // Profile update
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            const res = await fetch('/admin/update-profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            showToast(result.message, result.success ? 'success' : 'error');
        } catch (err) {
            showToast("Something went wrong", 'error');
        }
    });

    // Show Password Modal
    document.getElementById('openPasswordModal')?.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    document.getElementById('cancelPasswordModal')?.addEventListener('click', () => {
        modal.style.display = 'none';
        passwordForm.reset();
        passwordMsg.textContent = '';
    });

    // Password Change Form Submit
    passwordForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmNewPassword } = Object.fromEntries(new FormData(passwordForm).entries());

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword)) {
            return showPasswordToast("New password must be strong", "error");
        }
        if (newPassword !== confirmNewPassword) {
            return showPasswordToast("Passwords do not match", "error");
        }

        try {
            const res = await fetch('/admin/change-password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const result = await res.json();
            showPasswordToast(result.message, result.success ? 'success' : 'error');

            if (result.success) {
                passwordForm.reset();
                setTimeout(() => {
                    modal.style.display = 'none';
                    passwordMsg.textContent = '';
                }, 2000);
            }

        } catch (err) {
            showPasswordToast("Server error", 'error');
        }
    });

    function showPasswordToast(message, type) {
        passwordMsg.textContent = message;
        passwordMsg.style.color = type === 'success' ? 'green' : 'red';
    }
});
