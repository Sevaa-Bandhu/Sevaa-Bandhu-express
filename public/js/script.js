// show menu options if screen in not phone
window.addEventListener('resize', () => {
    if (window.innerWidth > '625') {
        btnLogin.style.display = 'inline-flex';
        navLinks.style.display = 'block';
        menuStatus = 'show';
    }
});
// show or hide the menu options in phone screen
const btnLogin = document.querySelector('.log-sign-in');
const navLinks = document.querySelector('#nav-links-container');
let btnMenu = document.querySelector('#menu');
let menuStatus = 'none';
const showMenu = () => {
    if (menuStatus == 'none') {
        btnLogin.style.display = 'inline-flex';
        navLinks.style.display = 'block';
        menuStatus = 'show';
    }
    else {
        btnLogin.style.display = 'none';
        navLinks.style.display = 'none';
        menuStatus = 'none';
    }
};

btnMenu.addEventListener("click", showMenu);

//underlining the active link
let active = document.querySelectorAll(".nav-links");
const highlightNavLink = (requestActive) => {
    let currActive = document.querySelector(".active-nav-link");
    let reqId = requestActive.getAttribute("id");
    requestActive.classList.add("active-nav-link");
    if (currActive != requestActive)
        currActive.classList.remove("active-nav-link");
};
for (let activeItem of active) {
    activeItem.addEventListener("click", () => {
        highlightNavLink(activeItem);
    });
}

// Google translation
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: 'true',
        includedLanguages: 'hi,en,mr,pa,ta,kn,ml',
    }, 'google_translate_element');
}

// fetching data from test_database
/*fetch('https://sevaa-bandhu-github-io.onrender.com/api/login_data')
    .then(response => {
        if (!response.ok) throw new Error("Network response was not OK");
        return response.json();
    })
    .then(data => {
        console.log('Fetched from MongoDB:', data);
        // You can now display this data in your HTML dynamically
    })
    .catch(error => console.error('Error:', error));*/