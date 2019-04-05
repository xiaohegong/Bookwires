// HTML elements constants
const logInForm = document.getElementById("logInForm");
const closeBox = document.getElementById("close2");
const toSignUp = document.getElementById("toSignUp");
const loginSubmit = document.getElementById("loginButton");
const quit = document.getElementById("quit");

// Set up the onlick functions
window.onclick = function (event) {
    if (event.target === logInForm) {
        window.location.href = "/index";
    }
};

// Setting login pop up box animation
closeBox.onclick = function (e) {
    e.preventDefault();
    window.location.href = "/index";
};

// Setting up the onclick function if sign up is queried
toSignUp.onclick = function (e) {
    e.preventDefault();
    window.location.href = "/signup";
};

// Validation for log in
loginSubmit.onclick = function (e) {
    e.preventDefault();
    const userNameInput = document.getElementById('loginUserName');
    const userName = userNameInput.value;

    const userPassWordInput = document.getElementById('loginPassword');
    const passWord = userPassWordInput.value;

    const newUserBody = {
        username: userName,
        password: passWord
    };

    // Fetch login request from the server
    fetch("user/login", {
        method: 'post', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(newUserBody)
    }).then((response) => {
        if (response.status === 404) {
            swal({
                title: "Failed to log in",
                text: "Username and password do not match, please try again!",
                icon: "error"
            });
            return;
        }
        if (response.status !== 200) {
            swal({
                title: "Failed to log in",
                text: "Please check your internet connection or refresh the page and try again!",
                icon: "error"
            });
            return;

        } else {
            // Redirect back to homepage on success
            window.location.href = "/index";
        }
    }).catch((error) => {
        console.log("fetch error" + error);
    });

};
