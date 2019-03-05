"use strict";
const booksRanking = document.querySelector("#ranking");
let numberOfBooks = fakeBooks.length;

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

function searchBarSearch(){
	const searchBar = document.getElementById('searchBar')
	console.log(fuzzyBookSearch(searchBar.value))
}

for (let i = 0; i < numberOfBooks; i++) {
    let book = fakeBooks[i];
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
    const imgContainer = document.createElement('a')
    imgContainer.setAttribute('href','book.html')
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

    // const description = document.createTextNode(book.getDescription());
    // const p2 = document.createElement("p");
    // p2.className = "displayDesc";
    // p2.appendChild(description);
    // span.appendChild(p2);
    const descriptionContainer = document.createElement('p')
    descriptionContainer.appendChild(document.createTextNode(book.getShortDescription()))
    span.appendChild(descriptionContainer);

    divider.appendChild(imgContainer);
    divider.appendChild(span);


    booksRanking.appendChild(divider);
}