// const log = console.log;

// Establish html element getter constants
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

    // Validate the password
    if (passWCon !== passWord) {
        swal({
            title: "Failed to sign up",
            text: "Two inputs of password do not match, please input again!",
            icon: "error"
        });
        return;
    }
    if (passWord.length < 4) {
        swal({
            title: "Failed to sign up",
            text: "Your password is too short(at least 4 characters), please input again!",
            icon: "error"
        });
        return;
    }

    // Fetch request from the server to signup
    const newUserBody = {
        username: userName,
        email: userMail,
        password: passWord
    };

    fetch("user/signup", {
        method: 'post', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(newUserBody)
    }).then((response) => {
        if (response.status === 200) {
            // Alert the user on success
            swal({
                title: "Signed up successfully",
                text: "Welcome to Bookwires!",
                icon: "success",
                timer: 5000
            }).then(() => {
                window.location.href = "/index";
            });
        } else if (response.status === 400) {
            // Alert the user on error
            swal({
                title: "Failed to sign up",
                text: "Please enter valid username and email.\n" +
                    "Please try again!",
                icon: "error"
            });
        } else if (error.status !== 200) {
            // Alert the user on error
            swal({
                title: "Failed to sign up",
                text: "Please check your internet connection and try again!",
                icon: "error"
            });
        }
    })
        .catch((error) => {
            log(error);

            return;
        });

};

// Set DOM elements correctly when sign up is complete
toSignIn.onclick = function (e) {
    e.preventDefault();
    window.location.href = "/login";
};