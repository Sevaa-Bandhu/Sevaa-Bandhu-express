// /js/register.js

// Helper to show popup
function showPopup(message, isSuccess = true) {
    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: isSuccess ? 'Success' : 'Error',
        text: message,
        timer: 3050,
        timerProgressBar: true,
        showConfirmButton: false
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    let countdownInterval;

    // Element references
    const form = document.getElementById('registerForm');
    const roleToggle = document.querySelector('input[name="choice"]:checked');
    const workerSection = document.getElementById('container-worker');
    const userSection = document.getElementById('userSection');
    const sendOtpBtn = document.getElementById('Send');
    const verifyOtpBtn = document.getElementById('Verify');
    const otpSection = document.getElementById('otpsection');
    const phoneInput = document.getElementById('phone');
    const otpInput = document.getElementById('otp');
    const passwordInput = document.getElementById('password_fld');
    const confirmPasswordInput = document.getElementById('chk_password');
    const togglePasswordBtn = document.getElementById('passwordcheck');
    const emailInput = document.getElementById('email');
    const dobInput = document.getElementById('birthdate');
    const ageInput = document.getElementById('age');
    const aadharInput = document.getElementById('aadhar_number');

    let generatedOTP = '';
    let isOtpVerified = false;

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type');
        passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
        confirmPasswordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
    });

    // Role selection handler
    roleToggle.addEventListener('change', () => {
        if (roleToggle.checked && isOtpVerified) {
            workerSection.style.display = 'block';
            userSection.style.display = 'none';
        } else {
            userSection.style.display = 'block';
            workerSection.style.display = 'none';
        }
    });

    // Send OTP handler
    sendOtpBtn.addEventListener('click', () => {
        let isValid = true;

        // Basic required fields
        const requiredFields = ['firstname', 'lastname', 'phone', 'birthdate', 'aadhar_number', 'gender', 'age', 'address', 'state', 'city', 'pincode', 'password_fld', 'chk_password'];
        requiredFields.forEach((ids) => {
            const field = document.getElementById(ids);
            if (field && field.value.trim() === '') {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (field) {
                field.classList.remove('is-invalid');
            }
        });

        // Email validation (optional)
        const email = emailInput.value.trim();
        if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.classList.add('is-invalid');
            isValid = false;
            showPopup('Please enter a valid email address.', false);
        } else {
            emailInput.classList.remove('is-invalid');
        }

        // Aadhar number validation
        const aadhar = aadharInput.value.trim();
        if (!/^\d{12}$/.test(aadhar)) {
            aadharInput.classList.add('is-invalid');
            isValid = false;
            showPopup('Aadhar number must be exactly 12 digits.', false);
        } else {
            aadharInput.classList.remove('is-invalid');
        }

        // Password strength validation
        const password = passwordInput.value;
        const cmfPassword = confirmPasswordInput.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password) && !passwordRegex.test(cmfPassword)) {
            passwordInput.classList.add('is-invalid');
            confirmPasswordInput.classList.add('is-invalid');
            isValid = false;
            showPopup('Password must be strong and match the confirmation.', false);

        }
        else if (password !== cmfPassword) {
            passwordInput.classList.add('is-invalid');
            confirmPasswordInput.classList.add('is-invalid');
            isValid = false;
            showPopup('Password must match the confirmation password.', false);
        }
        else {
            passwordInput.classList.remove('is-invalid');
            confirmPasswordInput.classList.remove('is-invalid');
        }

        // Date of birth and age consistency check
        const dob = new Date(dobInput.value);
        const age = parseInt(ageInput.value, 10);
        const today = new Date();
        let calculatedAge = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            calculatedAge--;
        }
        if (calculatedAge !== age) {
            dobInput.classList.add('is-invalid');
            ageInput.classList.add('is-invalid');
            isValid = false;
            showPopup('Age does not match the date of birth.', false);
        } else {
            dobInput.classList.remove('is-invalid');
            ageInput.classList.remove('is-invalid');
        }

        // Phone number validator
        const phone = phoneInput.value.trim();
        if (!/^\d{10}$/.test(phone)) {
            showPopup('Please enter a valid 10-digit phone number.', false);
            isValid = false;
        }

        // OTP generation
        if (isValid) {
            generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
            alert(`OTP sent: ${generatedOTP}`);     // Replace with actual SMS API integration

            phoneInput.setAttribute('readonly', true);
            aadharInput.setAttribute('readonly', true);
            otpSection.style.display = 'block';

            sendOtpBtn.disabled = true;
            startOtpCountdown(120);
        }
    });

    // Timer function for Resend button
    function startOtpCountdown(duration) {
        let timeRemaining = duration;

        sendOtpBtn.disabled = true;
        updateTimerDisplay(timeRemaining);

        countdownInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                sendOtpBtn.disabled = false;
                timerDisplay.textContent = '';
                sendOtpBtn.innerText = 'Resend OTP / पुन: ओटीपी भेजें';
            }
        }, 1000);
    }
    // Updating the timer every second
    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `Resend available in ${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Verify OTP handler
    verifyOtpBtn.addEventListener('click', async () => {
        const enteredOTP = otpInput.value.trim();
        if (enteredOTP === generatedOTP) {
            showPopup('OTP verified successfully.');
            otpInput.setAttribute('readonly', true);
            verifyOtpBtn.disabled = true;
            isOtpVerified = true;
            sendOtpBtn.disabled = true;

            if (roleToggle.checked) {
                userSection.style.display = 'none';
                workerSection.style.display = 'block';
            }
            else {

                //the client data storing should be handled when verify otp button is pressed

                const formData = new FormData(form);
                try {
                    console.log(formData);
                    const response = await fetch('/register', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();
                    if (result.success && result.redirect) {
                        showPopup('Registration successful! Redirecting to login...');
                        setTimeout(() => window.location.href = '/auth/login', 500);
                    } else {
                        showPopup(result.message || 'Registration failed.', false);
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    showPopup('Something went wrong. Please try again later.', false);
                }
            }

        } else {
            showPopup('Incorrect OTP. Please try again.', false);
        }
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Worker fields validation
        if (roleToggle.checked) {
            const workerFields = ['skillset', 'experience', 'certificate'];
            workerFields.forEach((ids) => {
                const field = document.getElementById(ids);
                if (field && field.value.trim() === '') {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else if (field) {
                    field.classList.remove('is-invalid');
                }
            });
        }
        if (!isValid) return;

        const formData = new FormData(form);

        try {
            console.log(formData);
            const response = await fetch('/register', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success && result.redirect) {
                showPopup('Registration successful! Redirecting to login...');
                setTimeout(() => window.location.href = '/auth/login', 500);
            } else {
                showPopup(result.message || 'Registration failed.', false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showPopup('Something went wrong. Please try again later.', false);
        }
    });
});
