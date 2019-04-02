"use strict";
const log = console.log;
// Constants defined for DOM objects
const authors = document.querySelector("#authorRec");
const booksDisplayed = document.querySelector("#books");
const booksRanking = document.querySelector("#ranking");
const menu = document.getElementById("menuBar");
const searchBtn = document.getElementById("searchBtn");
const searchVal = document.getElementById("searchVal");
searchBtn.onclick = searchBook;
searchBtn.href = "#";

const toast = document.querySelector(".toast");
const toastBody = document.querySelector(".toast-body");

// All books from the database
const url = '/db/books';
let books = [];
const fetchBooks = () => {
    return fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            books = json;
            return json;
        })
        .catch(error => {
            console.log(error);
        });
};

const numEditorPicks = 2; // total number of books on the shelf
const numTopBooks = 2; // total number of books on popular books

function searchBook(){
    const val = searchVal.value;
    if (val.length > 45){
        location.href = "../";
    }
    location.href = "../search?word=" + val;
    return true;
}


// TODO - Replace author sec below with user obj
for (let i = 0; i < fakeBooks.length; i++) {
    let book = fakeBooks[i];
    const author = book.getAuthor();
    const divider = document.createElement("div");
    divider.className = "bookDisplay";
    const link = document.createElement("a");
    // link.href = hrefURL + String(book._id);
    link.href = "";
    const img = document.createElement("img");
    img.src = author.image;
    img.className = "authorImg";
    link.appendChild(img);

    // Add book info to the block
    const span = document.createElement("span");
    span.className = "bookDisplayText";
    const authorName = document.createTextNode(author.name);

    span.appendChild(document.createElement("p").appendChild(authorName));
    span.appendChild(document.createElement("p"));

    // const info = document.createTextNode(book.getAuthor() + " | " + book.getGenre()); // TODO
    const info = document.createTextNode("Followers: " + author.followers);
    const p = document.createElement("p");

    p.className = "displayInfo";
    p.appendChild(info);
    span.appendChild(p);

    divider.appendChild(link);
    divider.appendChild(span);
    authors.appendChild(divider);


    //
    // // First, add authors
    // const div = document.createElement("div");
    // div.className = "bookDisplay";
    // const sp = document.createElement("span");
    //
    // const anchor = document.createElement("a");
    // anchor.href = "profile.html";
    // const parag = document.createElement("p");
    // parag.className = "author";
    // const author = book.getAuthor();
    // const authorName = document.createTextNode(author.name);
    // const img = document.createElement("img");
    // img.src = author.getImage();
    // img.className = "bookDisplayImg";
    //
    // parag.appendChild(authorName);
    // anchor.appendChild(img);
    // sp.appendChild(parag);
    // div.append(anchor);
    // div.appendChild(sp);
    // authors.appendChild(div);
}

const hrefURL = "./books/";
// Async function that sets the books array by fetch
fetchBooks().then((b) => {
    /*********** Code for making <Editor's Pick> section ***********/
    for (let i = 0; i < numEditorPicks; i++) {
        if (books.length < 1) {
            console.log("Not enough books in server");
            break;
        }
        const bookElement = booksDisplayed.children[i + (i / 3) >> 0];
        const bookTag = bookElement.firstElementChild;

        // Links to each book page
        bookTag.href = hrefURL + String(books[i]._id);
        bookTag.firstElementChild.src = books[i].image;
    }

    /*********** Code for making <popular books> section ***********/
    const booksSortedByRate = sortBooksByRate(books, numTopBooks);
    for (let i = 0; i < numTopBooks; i++) {
        let book = booksSortedByRate[i];

        // Add books to the ranking section
        const divider = document.createElement("div");
        divider.className = "bookDisplay";
        const link = document.createElement("a");
        link.href = hrefURL + String(book._id);
        const img = document.createElement("img");
        img.src = book.image;
        img.className = "bookDisplayImg";
        link.appendChild(img);

        // Add book info to the block
        const span = document.createElement("span");
        span.className = "bookDisplayText";
        span.appendChild(document.createElement("p").appendChild(document.createTextNode(book.bookTitle)));

        // const info = document.createTextNode(book.getAuthor() + " | " + book.getGenre()); // TODO
        const info = document.createTextNode("AUTHOR" + " | " + book.genre);
        const p = document.createElement("p");
        p.className = "displayInfo";
        p.appendChild(info);
        span.appendChild(p);

        // Append star ratings to the block
        const rating = makeStars(parseInt(book.rate));
        span.appendChild(rating);

        divider.appendChild(link);
        divider.appendChild(span);
        booksRanking.appendChild(divider);
    }

    /*********** Code for making <popular authors> section ***********/
    // const popularAuthors = sortAuthorsByPopularity()
});


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

function sortBooksByRate(books, num) {
    books.sort(function (a, b) {
        return parseFloat(a.rate) - parseFloat(a.rate);
    });
    return books.slice(0, num + 1);
}


// Handles DOM set up when user is logged in by adding welcome messages and quit button.
// Removes the old log in and sign up button and direct to correct pages
//server call to check login in the database
function userLoggedIn(user) {
    // Remove old buttons
    const username = user.name;
    menu.removeChild(menu.children[0]);
    menu.removeChild(menu.children[0]);
    const welcomeText = document.createTextNode("Welcome " + username + "!");
    const link = document.createElement("a");

    // Check user type to direct to correct pages
    if (user.isAdmin) {
        link.href = "./";
    } else {
        link.href = "public/HTML/profile.html";
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
    quit.href = "index";
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
}