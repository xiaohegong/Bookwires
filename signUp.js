const log = console.log;

const signUpForm = document.getElementById('signUpForm');
const signUpButton = document.getElementById("signUpButton");
const close = document.getElementById("close");
const toSignIn = document.getElementById("toSignIn");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    event.preventDefault();
    if (event.target === signUpForm) {
        signUpForm.style.display = "none";
    }
};

signUpButton.onclick = tryToSignUp();

close.onclick = function () {
    signUpForm.style.display = "none";
};


function tryToSignUp() {
    const userNameInput = document.getElementById("userName");
    const passWordInput = document.getElementById("passWord");
    const userMailInput = document.getElementById("mail");
    const passWConfirmInput = document.getElementById("passWordConfirm");

    const userName = userNameInput.value;
    const passWord = passWordInput.value;
    const passWCon = passWConfirmInput.value;
    const userMail = userMailInput.value;

    if (passWCon != passWord) {
        alert("Two inputs of password not match, please input again");
        return;
    }

    for (let i = 1; i <= numberOfUsers; i++) {
        if (fakeUser[i - 1].name == userName) {
            alert("This account already exist, please change another userName");
            return;
        }
    }

    fakeUser.push(userCreater(userName, userMail, passWord));
    log(fakeUser);
    alert("New account created, sign up completed");
}

toSignIn.onclick = function (e) {
    e.preventDefault();
    signUpForm.style.display = "none";
    logInForm.style.display = "block";
};