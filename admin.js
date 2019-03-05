'use strict';
const log = console.log;
let tempBook = fakeBooks;
let tempUser = fakeUser;

const booksRanking = document.querySelector("#InfoContainer");
const bookNavButton = document.querySelector("#bookNav");
bookNavButton.addEventListener('click', function () {
    switchToBook(tempBook);
}, false);
const UserNavButton = document.querySelector("#userNav");
UserNavButton.addEventListener('click', function () {
    switchToUser(tempUser);
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
        const titleContainer = document.createElement('p');
        titleContainer.appendChild(document.createTextNode(book.getBookTitle()));
        span.appendChild(titleContainer);

        const info = document.createTextNode(book.getAuthor() + " | " + book.getGenre());
        const p = document.createElement("p");
        p.className = "displayInfo";
        p.appendChild(info);
        span.appendChild(p);

        const button = getDeleteButton();
        button.onclick = deleteBook;

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
        button.onclick = deleteUser;
        divider.appendChild(imgContainer);
        divider.appendChild(span);
        divider.appendChild(button);


        booksRanking.appendChild(divider);
    }


}

switchToBook(tempBook);


function deleteBook(e) {
    e.preventDefault();
    const name = e.target.parentElement.children[1].children[0].innerText;
    const statusBar = document.getElementsByClassName("statBox");
    statusBar[0].children[1].innerHTML = parseInt(statusBar[0].children[1].innerHTML) + 1;
    deleteBookForAllUsers(searchBooksByTitle(name));

    function removeBook(name) {
        return tempBook.filter((fBook) => fBook.bookTitle !== name);
    }

    tempBook = removeBook(name); //this is a server that support to remove a book from the database


    e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}

function deleteUser(e) {
    e.preventDefault();
    const name = e.target.parentElement.children[1].innerText;
    const statusBar = document.getElementsByClassName("statBox");
    statusBar[1].children[1].innerHTML = parseInt(statusBar[1].children[1].innerHTML)+1;

    function removeUser(name) {
        const targetUser = tempUser.filter((user) => user.name === name);
        const targetUserAuthoredBooks = targetUser[0].getWrittenBook();
        targetUserAuthoredBooks.forEach(function(entry) {
            tempBook = tempBook.filter((fBook) => fBook.bookTitle !== entry.getBookTitle());
        });
        log(tempBook);
        return tempUser.filter((user) => user.bookTitle !== name);
    }

    tempUser = removeUser(name); // this is a server that support to remove user from the database

    e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}

function getDeleteButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.innerText = "Delete";
    button.className = "deleteBtn";
    return button;
}