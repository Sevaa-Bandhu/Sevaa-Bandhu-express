// adminRegister.js
const form = document.getElementById('adminRegisterForm');
const msg = document.getElementById('adminRegisterMsg');
const sendOtpBtn = document.getElementById('sendOtpBtn');
const otpField = document.getElementById('adminOtp');
let serverOtp = null;

if (!form) {
    console.error("Form not found. Make sure it's loaded in the DOM.");
} else {

    const showToast = (message, type = 'info') => {
        msg.textContent = message;
        msg.style.color = type === 'success' ? 'green' : type === 'error' ? 'red' : 'black';
        msg.style.display = 'block';
        setTimeout(() => {
            msg.textContent = '';
            msg.style.display = 'none';
        }, 2500);
    };

    const isStrongPassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isAdult = (birthdate) => {
        const dob = new Date(birthdate);
        const ageDiff = Date.now() - dob.getTime();
        const age = new Date(ageDiff).getUTCFullYear() - 1970;
        return age >= 18;
    };

    sendOtpBtn?.addEventListener('click', async () => {
        const email = form.email.value.trim();
        const mobile = form.mobile.value.trim();
        const aadhar_number = form.aadhar_number.value.trim();
        const password = form.password.value.trim();
        const birthdate = form.birthdate.value;
        const confirmPassword = form.confirm_password.value.trim();

        if (!email) return showToast("Please enter email before sending OTP", "error");
        if (!isValidEmail(email)) return showToast("Please enter email before sending OTP", "error");
        if (!/^\d{10}$/.test(mobile)) return showToast("Mobile must be 10 digits", "error");
        if (!/^\d{12}$/.test(aadhar_number)) return showToast("Aadhar must be 12 digits", "error");
        if (!isStrongPassword(password) || !isStrongPassword(confirmPassword))
        return showToast("Weak password or confirm password format\nMust contain uppercase, lowercase, digit and special character", "error");
        if (password !== confirmPassword) return showToast("Passwords do not match", "error");
        if (!isAdult(birthdate)) return showToast("Admin must be 18+", "error");

        sendOtpBtn.disabled = true;
        sendOtpBtn.innerText = "Sending...";

        try {
            const res = await fetch('/admin/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const result = await res.json();
            if (result.success) {
                serverOtp = result.otp;
                otpField.disabled = false;
                showToast("OTP sent to your email", "success");
            } else {
                showToast(result.message || "Failed to send OTP", "error");
            }
        } catch (err) {
            showToast("Server error while sending OTP", "error");
        } finally {
            sendOtpBtn.disabled = false;
            sendOtpBtn.innerText = "Send OTP";
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg.textContent = "";

        const data = Object.fromEntries(new FormData(form).entries());

        if (!serverOtp || data.otp !== serverOtp) {
            return showToast("Invalid OTP", "error");
        }
        delete data.confirm_password;

        // All okay, submit
        try {
            const res = await fetch('/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            showToast(result.message, result.success ? 'success' : 'error');

            if (result.success) form.reset();
        } catch (err) {
            showToast("Registration failed", "error");
        }
    });

}
