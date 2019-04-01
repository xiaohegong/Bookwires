// const log = console.log;
//
const signUpForm = document.getElementById('signUpForm');
const signUpSubmit = document.getElementById("signUpButton");
const close = document.getElementById("close");
const toSignIn = document.getElementById("toSignIn");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === signUpForm) {
        window.location.href = "/index";
    }
};

// Set call back function when close window is clicked
close.onclick = function (e) {
    e.preventDefault();
    window.location.href = "/index";
};

// Handles sign up validation and recording
signUpSubmit.onclick = function tryToSignUp(e) {
    e.preventDefault();
    const userNameInput = document.getElementById("userName");
    const passWordInput = document.getElementById("passWord");
    const userMailInput = document.getElementById("mail");
    const passWConfirmInput = document.getElementById("passWordConfirm");

    const userName = userNameInput.value;
    const passWord = passWordInput.value;
    const passWCon = passWConfirmInput.value;
    const userMail = userMailInput.value;

    if (passWCon !== passWord) {
        alert("Two inputs of password not match, please input again");
        return;
    }

    for (let i = 1; i <= numberOfUsers; i++) {
        if (fakeUser[i - 1].name === userName) {
            alert("This account already exist, please change another userName");
            return;
        }
    }

    fakeUser.push(userCreator(userName, userMail, passWord));
    // TODO: add request handling after user is signed up
    window.location.href = "/index";
    // signUpForm.style.display = "none";
};

// Set DOM elements correctly when sign up is complete
toSignIn.onclick = function (e) {
    e.preventDefault();
    window.location.href = "/login";
};