'use strict';
const log = console.log;


const booksRanking = document.querySelector("#InfoContainer");
const bookNavButton = document.querySelector("#bookNav");
bookNavButton.addEventListener('click', function () {
    switchToBook(fakeBooks);
}, false);
const UserNavButton = document.querySelector("#userNav");
UserNavButton.addEventListener('click', function () {
    switchToUser(fakeUser);
}, false);

let curNav = bookNavButton;

function searchBarBookSearch() {
    const searchBar = document.getElementsByClassName('searchBar');
    switchToBook(fuzzyBookSearch(searchBar[0].value));
}

function searchBarUserSearch() {
    const searchBar = document.getElementsByClassName('searchBar');
    switchToUser(fuzzyUserSearch(searchBar[0].value));
}

function changeActive(elem) {
    curNav.parentElement.classList.remove("active");
    elem.parentElement.classList.add("active");
    curNav = elem;
}

function switchToBook(books) {
    changeActive(bookNavButton);
    while (booksRanking.firstChild) {
        booksRanking.removeChild(booksRanking.firstChild);
    }
    const searchBar = document.createElement('input');
    searchBar.className = "searchBar larger";
    searchBar.setAttribute('type', 'search');
    searchBar.setAttribute('placeholder', 'Search Books...');
    booksRanking.appendChild(searchBar);
    const searchButtonContainer = document.createElement('a');
    const searchButton = document.createElement('img');
    searchButton.setAttribute('id', 'searchLogo');
    searchButton.src = "img/search.png";
    searchButtonContainer.appendChild(searchButton);
    searchButtonContainer.onclick = searchBarBookSearch;
    booksRanking.appendChild(searchButtonContainer);
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
        // Then add book image to the book shelf
        // booksDisplayed.children[i + (i / 3) >> 0].firstElementChild.src = book.getImage();

        // Add books to the ranking section
        const divider = document.createElement("div");
        divider.className = "bookDisplay";
        const imgContainer = document.createElement('a');
        imgContainer.setAttribute('href', 'adminBook.html');
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

        const button = getDeleteButton();

        divider.appendChild(imgContainer);
        divider.appendChild(span);
        divider.appendChild(button);


        booksRanking.appendChild(divider);
    }
}

function switchToUser(users) {
    changeActive(UserNavButton);

    while (booksRanking.firstChild) {
        booksRanking.removeChild(booksRanking.firstChild);
    }

    const searchBar = document.createElement('input');
    searchBar.className = "searchBar larger";
    searchBar.setAttribute('type', 'search');
    searchBar.setAttribute('placeholder', 'Search Users...');
    booksRanking.appendChild(searchBar);
    const searchButtonContainer = document.createElement('a');
    const searchButton = document.createElement('img');
    searchButton.setAttribute('id', 'searchLogo');
    searchButton.src = "img/search.png";
    searchButtonContainer.appendChild(searchButton);
    searchButtonContainer.onclick = searchBarUserSearch;
    booksRanking.appendChild(searchButtonContainer);

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        // First, add authors
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "");
        const parag = document.createElement("p");
        parag.className = "author";
        const author = document.createTextNode(user.getName());
        parag.appendChild(author);
        anchor.appendChild(parag);
        // Then add book image to the book shelf
        // booksDisplayed.children[i + (i / 3) >> 0].firstElementChild.src = book.getImage();

        // Add books to the ranking section
        const divider = document.createElement("div");
        divider.className = "bookDisplay";
        const imgContainer = document.createElement('a');
        imgContainer.setAttribute('href', 'profile.html');
        const img = document.createElement("img");
        if (user.getImage() == null) {
            img.src = "img/dog.jpeg";
        } else {
            img.src = user.getImage();
        }
        img.className = "userIcon";
        imgContainer.appendChild(img);
        const span = document.createElement("span");
        span.className = "bookDisplayText";
        span.appendChild(document.createElement("p").appendChild(document.createTextNode(user.getName())));


        const button = getDeleteButton();
        divider.appendChild(imgContainer);
        divider.appendChild(span);
        divider.appendChild(button);


        booksRanking.appendChild(divider);
    }


}

switchToBook(fakeBooks);


function deleteBook(e) {
    e.preventDefault();
    const name = e.target.parentElement.children[1].innerText;
    // fakeBooks = removeBook(name);
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}

function deleteUser(e) {
    e.preventDefault();
    const name = e.target.parentElement.children[1].innerText;
    // fakeUser = removeUser(name);
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}

function getDeleteButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.innerText = "Delete";
    button.className = "deleteBtn";
    button.onclick = deleteBook;
    return button;
}