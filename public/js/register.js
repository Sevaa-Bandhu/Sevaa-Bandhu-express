function myFunction() {
    var x = document.getElementById("password_fld");
    var xCheck = document.getElementById("chk_password");
    if (x.type === "password") {
        x.type = "text";
        xCheck.type = "text"
    } else {
        x.type = "password";
        xCheck.type = "password";
    }
}

// Global variable to store the generated OTP
let generatedotp;

// Initially disable the OTP input field
document.getElementById("otpsection").style.display = "none";

// Handle "Send OTP" button click
document.getElementById("Send").addEventListener("click", function (e) {
    e.preventDefault();
    const fname = document.getElementById('firstname').value.trim();
    const lname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const dob = document.getElementById('dob').value;
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const aadhar = document.getElementById('aadhar').value;
    const password = document.getElementById('password_fld').value;
    const confirmPassword = document.getElementById('chk_password').value;
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const region = document.getElementById('region').value.trim();

    function validateForm() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email != "") {
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return false;
            }
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return false;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return false;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return false;
        }
        return true;
    }

    if (validateForm()) {
        // Generate a 6-digit random OTP
        generatedotp = Math.floor(100000 + Math.random() * 900000); // Example: 123456

        // Simulate sending OTP (Replace this with actual backend logic to send OTP)
        alert("Your OTP is: " + generatedotp);

        // Enable the OTP input field
        document.getElementById("otpsection").style.display = "block";
    }
    else {
        alert('Make sure all mandatory fields are properly filled.');
    }
});

/*document.getElementById("Send").addEventListener("click", function () {
  // Validate the form fields here (optional)
  window.location.href = "nextpage.html"; // Redirect to the next page
});*/

document.getElementById("Verify").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get selected role (Labourer or Client)
    const selectedRole = document.querySelector('input[name="choice"]:checked');

    // Check if a role is selected
    if (selectedRole) {
        const role = selectedRole.id; // Get the id of the selected radio button
        const enteredotp = document.getElementById("otp").value.trim(); // Get the entered OTP

        // Check if OTP is entered
        if (enteredotp === "") {
            alert("Please enter the OTP before proceeding.");
            return;
        }

        if (enteredotp == generatedotp) {
            // OTP matches
            if (role === "check-worker") {
                // Redirect to Labourer page
                window.location.href = "../src/Regformworker.html";
            }
            else if (role === "check-client") {
                alert("Client details saved successfully!");

                // Send data to a backend
                const formData = new FormData(document.querySelector("form"));
                fetch("/save-client-details", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            alert("Details saved successfully!");
                        } else {
                            alert("Error: " + data.message);
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        }
        else {
            alert("Invalid OTP. Please try again.");
        }
    }
    else {
        alert("Please select whether you are a Labourer or Client.");
    }
});