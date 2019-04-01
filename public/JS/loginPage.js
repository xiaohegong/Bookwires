const logInForm = document.getElementById("logInForm");
const closeBox = document.getElementById("close2");
const toSignUp = document.getElementById("toSignUp");
const loginSubmit = document.getElementById("loginButton");
const quit = document.getElementById("quit");

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

    // let foundUser = 0;
    // let isAdmin = false;
    // for (let i = 1; i <= numberOfUsers; i++) {
    //     if (fakeUser[i - 1].name === userName) {
    //         foundUser = 1;
    //         isAdmin = fakeUser[i - 1].isAdmin();
    //         if (fakeUser[i - 1].passWord === passWord) {
    //             currentUserId = i;
    //         } else {
    //             alert("Wrong password");
    //             return;
    //         }
    //     }
    // }

    // if (!foundUser) {
    //     alert("This account do not exist");
    //     return;
    // }

    const newUserBody = {
        username: userName,
        password: passWord
    }

    fetch("user/login", {method: 'post', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(newUserBody)}).then((response) => {
        if(response.status === 404){
            alert("Invalid username/password");
            return;
        }
        if(response.status !== 200){
            alert("Error logging in");
            return;
        }else{
            window.location.href = "/index";
        }
    }).catch((error) => {
        console.log("fetch error")
    })


    // Change DOM elements to display logged in status
    // TODO: add request handling after user is logged in
    // window.location.href = "/index";
    // userLoggedIn(userName, isAdmin);
};
