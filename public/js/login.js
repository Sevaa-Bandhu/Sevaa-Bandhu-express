/*Show password for login form*/
document.querySelector("#show-password").addEventListener('change', (event) => {
    let pass = document.querySelector("#login-password");
    if (event.currentTarget.checked)
        pass.type = 'text';
    else
        pass.type = 'password';
});

/* Show password for forgot password field*/
document.querySelector("#show-fgt-pass").addEventListener('change', (event) => {
    let matchPass = document.querySelector("#match-pass");
    let createPass = document.querySelector("#create-pass");
    if (event.currentTarget.checked) {
        matchPass.type = 'text';
        createPass.type = 'text';
    }
    else {
        createPass.type = 'password';
        matchPass.type = 'password';
    }
});

/*Forgot password form */
let forgotForm = document.querySelector("#forgot-pass-form");
let forgotFormOne = document.querySelector("#step-one");
let forgotFormTwo = document.querySelector("#step-two");
let loginForm = document.querySelector("#login-container");

document.querySelector("#forget-pass").addEventListener("click", () => {
    forgotForm.style.display = "block";
    loginForm.style.display = "none";
    forgotFormOne.style.display = "block";
});

const nextStep = () => {
    forgotForm.style.display = "block";
    forgotFormOne.style.display = "none";
    forgotFormTwo.style.display = "block";
};