// function to parse cookie on client side
// Taken from: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2)
        return parts.pop().split(";").shift();
}


/*****  Set logged in status ******/
const menuBar = document.getElementById("menuBar");

// If a user is logged in
if (document.cookie) {
    try {
        const cookie = Cookies.get();
        const id = getCookie("id");
        const isAdmin = cookie.admin === "true";
        userLoggedIn(cookie.name, id, isAdmin);
    } catch {
    }

}

// If a user is logged in, set the page's html element to display his information
function userLoggedIn(username, id, isAdmin) {
    const menu = menuBar;
    // Remove old buttons
    if (username.trim().split(" ").length > 1) {
        username = username.trim().split(" ")[0];
    }
    if (menu && menu.children.length > 1) {
        menu.removeChild(menu.children[0]);
        menu.removeChild(menu.children[0]);
    }

    const welcomeText = document.createTextNode("Welcome " + username + "!");
    const link = document.createElement("a");

    // Check user type to direct to correct pages
    if (isAdmin) {
        link.href = "/admin";
    } else {
        link.href = "/profile/" + id;
    }

    // Create the welcome message
    link.appendChild(welcomeText);
    const span = document.createElement("span");
    span.appendChild(link);
    span.className = "welcomeMsg";
    menu.appendChild(span);

    // Create the quit button
    const quitText = document.createTextNode("Quit");
    const quit = document.createElement("a");
    quit.href = "/users/logout";
    quit.appendChild(quitText);
    const span2 = document.createElement("span");
    span2.appendChild(quit);
    span2.className = "welcomeMsg";
    span2.id = "quit";

    menu.appendChild(span2);

    // Adding toast when user logged in
    // if (sampleUser.newMessages.length > 0) {
    //     toastBody.innerHTML = "You have " + sampleUser.newMessages.length + " new notifications.";
    //     toast.setAttribute("data-autohide", "false");
    //     toast.style.display = "block";
    //     $(document).ready(function () {
    //         $('.toast').toast('show');
    //     });
    //
    //     sampleUser.moveNewMsgToOld();
    // }

    // document.querySelector("#bookShelf").style.pointerEvents = "all";
    // document.querySelector("#searchLogo").style.pointerEvents = "all";
    // document.querySelector("#leftSideBar").style.pointerEvents = "all";
    // document.querySelector("#rightSideBar").style.pointerEvents = "all";
    // document.querySelector("#searchLogo").style.pointerEvents = "all";
// }
}

// A search function shared by pages
function fuzzyBookSearch(input, inputList) {
    const outputList = [];
    //name search, similarity limit is .75
    for (let index = 0; index < inputList.length; index++) {
        if(inputList[index].bookTitle.toLowerCase().includes(input)){
            outputList.push(inputList[index]);
        }
    }
    return outputList;
}
