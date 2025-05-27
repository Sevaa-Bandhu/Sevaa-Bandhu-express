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

// Handle "Send OTP" button click
document.getElementById("Send").addEventListener("click", function (e) {
    console.log("sending otp");

    const fname = document.getElementById('firstname').value.trim();
    const lname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const aadhar = document.getElementById('aadhar_number').value;
    const password = document.getElementById('password_fld').value;
    const confirmPassword = document.getElementById('chk_password').value;
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const region = document.getElementById('region').value.trim();

    function validateForm() {
        console.log("Validating details");

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

        const aadharRegex = /^\d{12}$/;
        if (!aadharRegex.test(aadhar)) {
            alert("Please enter a valid 12-digit Aadhar number.");
            return false;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return false;
        }

        if (!age || !birthdate || !fname || !lname || !aadhar || !address || !city || !state || !region) {
            alert('All fields are mandatory.');
            return false;
        }
        return true;
    }

    if (validateForm()) {
        document.getElementById("otpsection").style.display = "block";
        document.getElementById("otp").setAttribute("required", "true");
        // Generate a 6-digit random OTP
        generatedotp = Math.floor(100000 + Math.random() * 900000);
        alert("Your OTP is: " + generatedotp);
    }
});

document.getElementById("Verify").addEventListener("click", function (e) {
    console.log("Verify OTP");

    // Get selected role (Labourer or Client)
    const selectedRole = document.querySelector('input[name="choice"]:checked');

    if (selectedRole) {
        const role = selectedRole.id; // Get the id of the selected radio button
        const enteredotp = document.getElementById("otp").value.trim();

        if (enteredotp === "") {
            alert("Please enter the OTP before proceeding.");
            return;
        }

        if (enteredotp == generatedotp) {
            console.log("OTP Verified");

            const Workersection = document.getElementById("container-worker");
            const firstSection = document.getElementById("firstSection");

            if (role === "worker") {  // Profession as a Worker
                firstSection.style.display = "none";
                Workersection.style.display = "block";
                document.getElementById("skillset").setAttribute("required", "required");
                document.getElementById("experience").setAttribute("required", "required");
                document.getElementById("certificate").setAttribute("required", "required");
                document.getElementById("userphoto").setAttribute("required", "required");

                //validations
                if (role === 'worker' && skillset === '') {
                    alert("Please select a valid skillset.");
                }
                // now move forward to save the entered detsils
            }
            else if (role === "client") {
                alert("Client details saved successfully!");
                /*
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
                                    }); */
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