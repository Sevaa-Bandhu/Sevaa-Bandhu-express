let topNavbar = `<div class="navbar">
            <div class="nav-item" id="logo-menu" href="index.html">
                <a href="/">
                    <img src="/images/logo.png" class="logo-img" alt="logo">
                </a>
                <span class="fa-solid fa-bars" id="menu"></span>
            </div>
            <div class="nav-item log-sign-in" id="log-sign-in">
                <button class="login" id="login" type="button" onclick="window.open('/auth/login', '_self')">Login</button>
                <button class="reg" id="reg" type="button" onclick="window.open('/auth/register', '_self')">Register</button>
            </div>
            <div class="nav-links-container" id="nav-links-container">
                <a class="nav-item nav-links" id="google_translate_element"></a>
                <a class="nav-item nav-links" id="nav-home" href="/" target="_self">Home</a>
                <a class="nav-item nav-links" id="nav-profile" href="/profile" target="_self">Profile</a>
                <a class="nav-item nav-links" id="nav-help" href="/help" target="_self">Help</a>
                <a class="nav-item nav-links" id="nav-about" href="aboutUs" target="_self">About</a>
            </div>
        </div>`;
let bottomFooter = `<footer class="footer" id="footer">
        <div class="footer-container">
            <div class="contact-foot element notranslate">
                <p class="address merge">
                    <i class="fa fa-map-marker"></i>
                    <span>School of Electronics, DAVV University, Indore, Madhya Pradesh</span>
                </p>
                <p class="mail merge">
                    <i class="fa fa-envelope"></i>
                    <span>SevaaBandhu@gmail.com</span>
                </p>
                <p class="phone merge">
                    <i class="fa fa-phone"></i>
                    <span>+91 9424865699, +91 7828999263</span>
                </p>
                <p class="github merge">
                    <i class="fa fa-github"></i>
                    <span>Github.com/Sevaa-Bandu/Sevaa-Bandhu.github.io</span>
                </p>
            </div>

            <div class="logo-tag element">
                <img src="/images/logo.png" alt="logo footer">
                <p class="tag-foot">Connecting Communities, Empowering Workers</p>
            </div>
            <div class="quick-link element">
                <p class="sub-title">Quick Links</p>
                <div class="link-container">
                    <a href="/index" id="quick-home" target="_self">
                        Home</a>
                    <a href="/profile" id="quick-profile" target="_self">
                        Profile</a>
                    <a href="/aboutUs" id="quick-about" target="_self">
                        About Us</a>
                    <a href="/help" id="quick-help" target="_self">
                        Help</a>
                    <a href="/policy" id="quick-Policy" target="_self">
                        Policy</a>
                    <a href="/termCondition" id="quick-TandC" target="_self">
                        Term & Condition</a>
                </div>
            </div>
        </div>
    </footer>`;

document.querySelector("#navbar").innerHTML = topNavbar;
document.querySelector("#footer").innerHTML = bottomFooter;

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


// Google translation
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: 'true',
        includedLanguages: 'hi,en,mr,pa,ta,kn,ml',
    }, 'google_translate_element');
}
