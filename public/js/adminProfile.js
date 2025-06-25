const profileForm = document.getElementById('adminProfileForm');
const profileMsg = document.getElementById('adminProfileMsg');
const passForm = document.getElementById('changePasswordForm');
const passMsg = document.getElementById('passwordMsg');

const showMsg = (el, text, success = true) => {
    el.textContent = text;
    el.style.color = success ? 'green' : 'red';
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
};

// Show/hide password toggle
document.getElementById('togglePassword')?.addEventListener('change', function () {
    const confirmPwd = document.getElementById('confirmNewPassword');
    const newPwd = document.querySelector('[name="newPassword"]');
    const currentPwd = document.querySelector('[name="currentPassword"]');

    const type = this.checked ? 'text' : 'password';
    confirmPwd.type = newPwd.type = currentPwd.type = type;
});

profileForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(profileForm).entries());
    try {
        const res = await fetch('/admin/api/update-profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        showMsg(profileMsg, result.message, result.success);
    } catch {
        showMsg(profileMsg, 'Error updating profile', false);
    }
});

passForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(passForm).entries());

    if (data.newPassword !== data.confirmNewPassword)
        return showMsg(passMsg, "Passwords don't match", false);

    try {
        const res = await fetch('/admin/api/change-password', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        showMsg(passMsg, result.message, result.success);
        if (result.success) passForm.reset();
    } catch {
        showMsg(passMsg, 'Error changing password', false);
    }
});
