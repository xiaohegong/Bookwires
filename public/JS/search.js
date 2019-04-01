"use strict";
const log = console.log;
const booksRanking = document.querySelector("#ranking");


async function getAllBook(url) {
    return fetch(url).then((res) => res.json())
        .then((bookJson) => {
            log(bookJson)
            return bookJson;
        }).catch(error => log(error));
}
getAllBook("/db/books").then(res=>{
    bookSetUp(res);
});

function fuzzyBookSearch(input, inputList) {
    const outputList = [];
    //name search, similarity limit is .75
    for (let index = 0; index < inputList.length; index++) {
        if (stringCompByLevenshteinDistance(input, inputList[index].bookTitle) > 0.5) {
            outputList.push(inputList[index]);
        }
    }
    return outputList;
}
// getBook().then(res=>log(res.image));
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


function searchBarSearch() {
    const searchBar = document.getElementById('searchBar');
    let data = {
        word: searchBar.value
    };
    //bookSetUp(fuzzyBookSearch(searchBar.value,res));
    const request = new Request('/db/fuzzySearch', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },});
    getAllBook(request).then(res=>{
        bookSetUp(res);
        // const searchBar = document.getElementById('searchBar');
        // bookSetUp(fuzzyBookSearch(searchBar.value,res));
    });

}

// DOM element helper function for displaying search results
// bookSetUp(fakeBooks);//server call to get real data

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
        // const author = document.createTextNode(book.getAuthor());
        // parag.appendChild(author);
        // anchor.appendChild(parag);
        // authors.appendChild(anchor);

        // Then add book image to the book shelf
        // booksDisplayed.children[i + (i / 3) >> 0].firstElementChild.src = book.getImage();

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
        const info = document.createTextNode("WHAT" + " | " + book.genre);
        const p = document.createElement("p");
        p.className = "displayInfo";
        p.appendChild(info);
        span.appendChild(p);
        
        const rating = makeStars(book.rating);
        span.appendChild(rating);

        divider.appendChild(imgContainer);
        divider.appendChild(span);

        booksRanking.appendChild(divider);
    }
}
