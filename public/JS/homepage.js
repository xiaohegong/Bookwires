"use strict";
const log = console.log;
// Constants defined for DOM objects
const authors = document.querySelector("#authorRec");
const booksDisplayed = document.querySelector("#books");
const booksRanking = document.querySelector("#ranking");
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

// All authors from the database
const authorURL = '/db/users/';
let allAuthors = [];
const fetchAuthors = () => {
    return fetch(authorURL)
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            allAuthors = json;
            return json;
        })
        .catch(error => {
            console.log(error);
        });
};

const numEditorPicks = 12; // total number of books on the shelf
const numTopBooks = 5; // total number of books on popular books
const numPopAuthors = 5; // total number of authors on popular authors

function searchBook() {
    const val = searchVal.value;
    if (val.length > 45) {
        location.href = "/";
    }
    location.href = "/search?word=" + val;
    return true;
}

const authorHrefURL = "/profile/";
fetchAuthors().then((a) => {
    const authorsSortedByPop = sortAuthorsByPopularity(allAuthors, numPopAuthors);
    for (let i = 0; i < numPopAuthors; i++) {
        const author = authorsSortedByPop[i];
        const divider = document.createElement("div");
        divider.className = "authorDisplay";
        const link = document.createElement("a");
        link.href = authorHrefURL + String(author._id);
        const img = document.createElement("img");
        img.src = author.image;
        img.className = "authorImg";
        link.appendChild(img);

        // Add book info to the block
        const span = document.createElement("span");
        span.className = "authorDisplayText";
        const authorName = document.createTextNode(author.name);

        span.appendChild(document.createElement("p").appendChild(authorName));
        span.appendChild(document.createElement("p"));

        const info = document.createTextNode("Followers: " + author.followers);
        const p = document.createElement("p");

        p.className = "displayInfo";
        p.appendChild(info);
        span.appendChild(p);

        divider.appendChild(link);
        divider.appendChild(span);
        authors.appendChild(divider);

        const numMessages = parseInt(getCookie("newnotifications"), 10);
        if (numMessages > 0) {
            toastBody.innerHTML = "You have " + numMessages.toString() + " new notifications.";
            toast.setAttribute("data-autohide", "false");
            toastBody.onclick = function () {
                location.href = authorHrefURL + getCookie("id");
            };
            toast.style.display = "block";
            $(document).ready(function () {
                $('.toast').toast('show');
            });

            sampleUser.moveNewMsgToOld();
        }
    }

    const bookHrefURL = "/books/";
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
            bookTag.href = bookHrefURL + String(books[i]._id);
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
            link.href = bookHrefURL + String(book._id);
            const img = document.createElement("img");
            img.src = book.image;
            img.className = "bookDisplayImg";
            link.appendChild(img);

            // Add book info to the block
            const span = document.createElement("span");
            span.className = "bookDisplayText";
            span.appendChild(document.createElement("p").appendChild(document.createTextNode(book.bookTitle)));

            const info = document.createTextNode(findName(book.user) + book.genre);
            const p = document.createElement("p");
            p.className = "displayInfo";
            p.appendChild(info);
            span.appendChild(p);

            // Append star ratings to the block
            const rating = makeStars(parseInt(book.rating));
            span.appendChild(rating);

            divider.appendChild(link);
            divider.appendChild(span);
            booksRanking.appendChild(divider);
        }

        /*********** Code for making <popular authors> section ***********/
        // const popularAuthors = sortAuthorsByPopularity()
    });


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
        return parseFloat(b.rating) - parseFloat(a.rating);
    });
    return books.slice(0, num + 1);
}

function sortAuthorsByPopularity(authors, num) {
    authors.sort(function (a, b) {
        return parseFloat(b.followers) - parseFloat(a.followers);
    });

    return authors.slice(0, num + 1);
}

// Find the author's name given id
function findName(id) {
    for (let i = 0; i < allAuthors.length; i++) {
        if (allAuthors[i]._id === id) {
            return allAuthors[i].name + " | ";
        }
    }
    return "";
}