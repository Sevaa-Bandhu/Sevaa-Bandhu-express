// public/js/login.js

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

// Section toggle functions
function showForgotForm() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('forgotSection').style.display = 'block';
    document.getElementById('resetPasswordSection').style.display = 'none';
}

function backToLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('forgotSection').style.display = 'none';
    document.getElementById('resetPasswordSection').style.display = 'none';
}

// Generation and Sending of otp
async function sendOtp() {
    const mobile = document.getElementById("forgotMobile").value.trim();

    if (!/^[0-9]{10}$/.test(mobile)) {
        showPopup("Please enter a valid 10-digit mobile number.", false);
        return;
    }

    try {
        const res = await fetch("/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile })
        });

        const data = await res.json();
        if (data.success) {
            showPopup("OTP sent to your mobile number.", true);
        } else {
            showPopup(data.message || "Failed to send OTP.", false);
        }
    } catch (err) {
        console.error("Send OTP error:", err);
        showPopup("Server error while sending OTP.", false);
    }
}

// Toggle password visibility
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const loginPassword = document.getElementById("loginPassword");
toggleLoginPassword.addEventListener("change", () => {
    loginPassword.type = toggleLoginPassword.checked ? "text" : "password";
});

// Login form validation
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async function (e) {
    const mobile = document.getElementById("loginMobile").value.trim();
    const password = loginPassword.value.trim();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!/^[0-9]{10}$/.test(mobile)) {
        showPopup('Please enter a valid 10-digit mobile number.', false);
        e.preventDefault();
        return;
    }

    else if (password.length < 8) {
        showPopup("Password must be at least 8 characters long.", false);
        e.preventDefault();
        return;
    }
    else if (!passwordRegex.test(password)) {
        showPopup(`Password must contain:
            a upper character [A - Z]
            a lower character [a - z]
            a numeric character [0 - 9] and
            a special character. [e.g @ # $ * ...]`, false);
        e.preventDefault();
        return;
    }
    else{
        const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password })
    });

    const data = await response.json();

    if (data.success) {
        window.location.href = data.redirect;
    } else {
        // Show error
        showPopup(data.message, false);
    }
    }
});

// OTP Verification
async function verifyOtp() {
    const mobile = document.getElementById("forgotMobile").value.trim();
    const otp = document.getElementById("otpCode").value.trim();

    if (!/^[0-9]{10}$/.test(mobile)) {
        showPopup("Enter a valid 10-digit mobile number.", false);
        return;
    }

    if (!otp || otp.length !== 6) {
        showPopup("Enter a valid 6-digit OTP.", false);
        return;
    }

    try {
        const res = await fetch("/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile, otp })
        });

        const data = await res.json();
        if (data.success) {
            document.getElementById("forgotSection").style.display = 'none';
            document.getElementById("resetPasswordSection").style.display = 'block';
        } else {
            showPopup(data.message || "Invalid OTP.", false);
        }
    } catch (err) {
        console.error("OTP verify error:", err);
        showPopup("Server error while verifying OTP.", false);
    }
}

// Update Password
async function updatePassword() {
    const mobile = document.getElementById("forgotMobile").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (newPassword.length < 8) {
        showPopup("New password must be at least 8 characters long.", false);
        return;
    }
    else if (!passwordRegex.test(newPassword)) {
        showPopup(`Password must contain:
            a upper character [A-Z],
            a lower character [a-z],
            a numeric character [0-9] and
            a special character [e.g @ # $...]`, false);
        e.preventDefault();
        return;
    }
    else if (newPassword !== confirmPassword) {
        showPopup("Password and confirm password do not match.", false);
        return;
    }
    else {
        try {
            const res = await fetch("/auth/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile, newPassword })
            });

            const data = await res.json();
            if (data.success) {
                showPopup("Password updated successfully. Please login.", true);
                backToLogin();
            } else {
                showPopup(data.message || "Failed to update password.", false);
            }
        } catch (err) {
            console.error("Update password error:", err);
            showPopup("Server error while updating password.", false);
        }
    }
}
