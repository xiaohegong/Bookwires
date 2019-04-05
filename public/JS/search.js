"use strict";
const log = console.log;
const booksRanking = document.querySelector("#ranking");

// Parse the query from the link
const query = window.location.search.substring(1).split("=");
let genre = "";
let word = "";
if (query && query.length === 2) {
    // Link in the form of <genre=xx>
    if (query[0] === "genre") {
        genre = query[1];
        if (genre === "Science-Fiction") {
            genre = "Science Fiction";
        }
    }
    // Link in the form of <word=xx>
    else if (query[0] === "word") {
        word = query[1];
    }
}

// Get all books first from the server
async function getAllBook(url) {
    return fetch(url).then((res) => res.json())
        .then((bookJson) => {
            return bookJson;
        }).catch(error => log(error));
}

// A server call that fetches books by genre
if (genre !== "") {
    (function () {
        let data = {
            genre: genre
        };
        const request = new Request('/db/bookByGenre', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        getAllBook(request).then(res => {
            bookSetUp(res);
        });
    })();
} else if (word !== "") {
    (function () {
        let data = {
            word: word
        };
        const request = new Request('/db/fuzzySearch', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        getAllBook(request).then(res => {
            bookSetUp(res);
        });
    })();
} else {
    getAllBook("/db/books").then(res => {
        bookSetUp(res);
    });
}


// A function to generating stars with the given num
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

// Fetch from server the list of  books with the given rate
function searchByRate(rate) {
    if (genre === "") {
        let data = {
            rate: rate

        };
        const request = new Request('/db/bookByRate', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        getAllBook(request).then(res => {
            bookSetUp(res);

        });
    } else {
        let data = {
            rate: rate,
            genre: genre

        };
        const request = new Request('/db/bookByRateWithGenre', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        getAllBook(request).then(res => {
            bookSetUp(res);

        });
    }
}

// Set up search results from the search bar key words
function searchBarSearch() {
    const searchBar = document.getElementById('searchBar');
    if (genre === "") {
        let data = {
            word: searchBar.value
        };
        const request = new Request('/db/fuzzySearch', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        getAllBook(request).then(res => {
            bookSetUp(res);

        });
    } else {
        let data = {
            word: searchBar.value,
            genre: genre
        };
        const request = new Request('/db/fuzzySearchWithGenre', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        getAllBook(request).then(res => {
            bookSetUp(res);

        });
    }

}

// DOM element helper function for displaying search results
// bookSetUp(fakeBooks);//server call to get real data

// DOM element helper function for displaying search results
function bookSetUp(books) {
    while (booksRanking.firstChild) {
        booksRanking.removeChild(booksRanking.firstChild);
    }
    const header = document.createElement('h1');
    header.appendChild(document.createTextNode("Books"));
    booksRanking.appendChild(header);
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        // First, add authors
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "");
        const parag = document.createElement("p");
        parag.className = "author";

        // Add books to the ranking section
        const divider = document.createElement("div");
        divider.className = "bookDisplay";
        const imgContainer = document.createElement('a');
        imgContainer.setAttribute('href', "./books/" + String(book._id));
        const img = document.createElement("img");
        img.src = book.image;
        img.className = "bookDisplayImg";
        imgContainer.appendChild(img);
        const span = document.createElement("span");
        span.className = "bookDisplayText";
        span.appendChild(document.createElement("p").appendChild(document.createTextNode(book.bookTitle)));

        //TEMP
        if (typeof book.user !== 'undefined') {
            getAllBook("/db/users/" + book.user).then(res => {
                if (typeof res !== "undefined") {
                    const info = document.createTextNode(res.name + " | " + book.genre);
                    const p = document.createElement("p");
                    p.className = "displayInfo";
                    p.appendChild(info);
                    span.appendChild(p);
                    const rating = makeStars(book.rating);
                    span.appendChild(rating);
                }

            });
        }

        divider.appendChild(imgContainer);
        divider.appendChild(span);

        booksRanking.appendChild(divider);
    }
}
