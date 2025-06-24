// adminRegister.js
const form = document.getElementById('adminRegisterForm');
const msg = document.getElementById('adminRegisterMsg');

if (!form) {
    console.error("❌ Form not found. Make sure it's loaded in the DOM.");
} else {

    const showToast = (message, type = 'info') => {
        msg.textContent = message;
        msg.style.color = type === 'success' ? 'green' : type === 'error' ? 'red' : 'black';
        msg.style.display = 'block';
        setTimeout(() => {
            msg.textContent = '';
            msg.style.display = 'none';
        }, 3000);
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg.textContent = "";

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 🔒 VALIDATIONS
        if (!/^\d{10}$/.test(data.mobile)) {
            return showToast("Mobile number must be 10 digits.", "error");
        }

        if (!/^\d{12}$/.test(data.aadhar_number)) {
            return showToast("Aadhar number must be 12 digits.", "error");
        }

        if (!isValidEmail(data.email)) {
            return showToast("Enter a valid email address.", "error");
        }

        if (!/^\d{6}$/.test(data.pincode)) {
            return showToast("Pincode must be 6 digits.", "error");
        }

        if (!isStrongPassword(data.password)) {
            return showToast("Password must include uppercase, lowercase, number & special char, min 8 chars.", "error");
        }

        if (!isAdult(data.birthdate)) {
            return showToast("Admin must be at least 18 years old.", "error");
        }

        // ✅ SUBMIT TO SERVER
        try {
            const res = await fetch('/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (result.success) {
                showToast(result.message, 'success');
                form.reset();
            } else {
                showToast(result.message, 'error');
            }

        } catch (err) {
            console.error("❌ Registration error:", err);
            showToast("Something went wrong. Try again.", "error");
        }
    });
}
