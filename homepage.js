"use strict";
// Constants defined for DOM objects
const authors = document.querySelector("#authorRec");
const booksDisplayed = document.querySelector("#books");
const booksRanking = document.querySelector("#ranking");
const menu = document.getElementById("menuBar");
const loginButton = menu.children[0];
const signUpButton = menu.children[1];

// Set up callback functions for sign up
signUpButton.onclick = function (e) {
    e.preventDefault();
    signUpForm.style.display = 'block';
};

// Set up callback functions for log in
loginButton.onclick = function (e) {
    e.preventDefault();
    logInForm.style.display = 'block';
};

let numberOfBooks = fakeBooks.length; // total number of books

for (let i = 0; i < numberOfBooks; i++) {
    let book = fakeBooks[i];//server call to get book
    // First, add authors
    const anchor = document.createElement("a");
    anchor.href = "profile.html";
    const parag = document.createElement("p");
    parag.className = "author";
    const author = document.createTextNode(book.getAuthor());
    parag.appendChild(author);
    anchor.appendChild(parag);
    authors.appendChild(anchor);

    // Then add book image to the book shelf
    booksDisplayed.children[i + (i / 3) >> 0].firstElementChild.firstElementChild.src = book.getImage();

    // Add books to the ranking section
    const divider = document.createElement("div");
    divider.className = "bookDisplay";
    const link = document.createElement("a");
    link.href = "book.html";
    const img = document.createElement("img");
    img.src = book.getImage();
    img.className = "bookDisplayImg";
    link.appendChild(img);

    // Add book info to the block
    const span = document.createElement("span");
    span.className = "bookDisplayText";
    span.appendChild(document.createElement("p").appendChild(document.createTextNode(book.getBookTitle())));

    const info = document.createTextNode(book.getAuthor() + " | " + book.getGenre());
    const p = document.createElement("p");
    p.className = "displayInfo";
    p.appendChild(info);
    span.appendChild(p);

    // Append star ratings to the block
    const rating = makeStars(book.getRating());
    span.appendChild(rating);

    divider.appendChild(link);
    divider.appendChild(span);
    booksRanking.appendChild(divider);
}

// Another for loop to add more place holder books, similar procedure with above
for (let i = 0; i < 2; i++) {
    let book = fakeBooks[3];

    const divider = document.createElement("div");
    divider.className = "bookDisplay";
    const img = document.createElement("img");
    img.src = book.getImage();
    img.className = "bookDisplayImg";
    const span = document.createElement("span");
    span.className = "bookDisplayText";
    span.appendChild(document.createElement("p").appendChild(document.createTextNode(book.getBookTitle())));

    const info = document.createTextNode(book.getAuthor() + " | " + book.getGenre());
    const p = document.createElement("p");
    p.className = "displayInfo";
    p.appendChild(info);
    span.appendChild(p);

    const rating = makeStars(book.getRating());
    span.appendChild(rating);

    divider.appendChild(img);
    divider.appendChild(span);
    booksRanking.appendChild(divider);
}

// Add more book picture holder to the book display
for (let i = numberOfBooks; i < 12; i++) {
    booksDisplayed.children[i + (i / 3) >> 0].firstElementChild.firstElementChild.src = "img/threebody.jpg";
}

// A function that makes a div that contains num many stars
function makeStars(num) {
    if (num > 5 || num < 0) {
        return;
    }

    const div = document.createElement("div");
    for (let i = 0; i < 5; i++) {
        const span = document.createElement("span");
        if (parseInt(num) > 0) {
            span.className = "fa fa-star darkerGreen";
            num -= 1;
        } else {
            span.className = "fa fa-star";
        }
        div.appendChild(span);
    }

    return div;
}

// Handles DOM set up when user is logged in by adding welcome messages and quit button.
// Removes the old log in and sign up button and direct to correct pages
//server call to check login in the database
function userLoggedIn(username, isAdmin) {
    // Remove old buttons
    menu.removeChild(menu.children[0]);
    menu.removeChild(menu.children[0]);
    const welcomeText = document.createTextNode("Welcome " + username + "!");
    const link = document.createElement("a");

    // Check user type to direct to correct pages
    if (isAdmin) {
        link.href = "admin.html";
    } else {
        link.href = "profile.html";
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
    quit.href = "index.html";
    quit.appendChild(quitText);
    const span2 = document.createElement("span");
    span2.appendChild(quit);
    span2.className = "welcomeMsg";
    span2.id = "quit";
    menu.appendChild(span2);
}