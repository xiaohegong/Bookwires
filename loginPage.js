const logInForm = document.getElementById("logInForm");
const closeBox = document.getElementById("close2");
const toSignUp = document.getElementById("toSignUp");
const loginSubmit = document.getElementById("loginButton");

closeBox.onclick = function (e) {
    e.preventDefault();
    logInForm.style.display = "none";
};

toSignUp.onclick = function (e) {
    e.preventDefault();
    signUpForm.style.display = "block";
    logInForm.style.display = "none";
};

loginSubmit.onclick = function (e) {
    e.preventDefault();
    const userNameInput = document.getElementById('loginUserName');
    const userName = userNameInput.value;

    const userPassWordInput = document.getElementById('loginPassword');
    const passWord = userPassWordInput.value;

    let foundUser = 0;
    for (let i = 1; i <= numberOfUsers; i++) {

        if (fakeUser[i - 1].name == userName) {
            foundUser = 1;
            if (fakeUser[i - 1].passWord == passWord) {
                currentUserId = i;
            } else {
                alert("Wrong password");
                return;
            }
        }
    }
    if (!foundUser) {
        alert("This account do not exist");
        return;
    }
    userLoggedIn(userName);
    logInForm.style.display = "none";
};

