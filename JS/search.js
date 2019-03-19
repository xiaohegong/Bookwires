"use strict";
const booksRanking = document.querySelector("#ranking");

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

// For search bar algorithm
function searchBarSearch() {
    const searchBar = document.getElementById('searchBar');
    bookSetUp(fuzzyBookSearch(searchBar.value));
}

// DOM element helper function for displaying search results
bookSetUp(fakeBooks);//server call to get real data

// DOM element helper function for displaying search results
function bookSetUp(books) {
    while (booksRanking.firstChild) {
        booksRanking.removeChild(booksRanking.firstChild);
    }
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        // First, add authors
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "");
        const parag = document.createElement("p");
        parag.className = "author";
        const author = document.createTextNode(book.getAuthor());
        parag.appendChild(author);
        anchor.appendChild(parag);
        // authors.appendChild(anchor);

        // Then add book image to the book shelf
        // booksDisplayed.children[i + (i / 3) >> 0].firstElementChild.src = book.getImage();

        // Add books to the ranking section
        const divider = document.createElement("div");
        divider.className = "bookDisplay";
        const imgContainer = document.createElement('a');
        imgContainer.setAttribute('href', 'book.html');
        const img = document.createElement("img");
        img.src = book.getImage();
        img.className = "bookDisplayImg";
        imgContainer.appendChild(img);
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

        divider.appendChild(imgContainer);
        divider.appendChild(span);

        booksRanking.appendChild(divider);
    }
}
