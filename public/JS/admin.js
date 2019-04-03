'use strict';
const log = console.log;
let tempUser = fakeUser;//server call that gets real info

async function getAll(url) {
    return fetch(url).then((res) => res.json())
        .then((itemJson) => {
            return itemJson;
        }).catch(error => log(error));
}

if (document.cookie && Cookies.get().admin === "true") {
    const name = document.getElementsByClassName("profileHeader")[0];
    name.innerHTML = Cookies.get().name;
}else{
    log(Cookies.get().admin)
    location.href = "/index";
}

const booksRanking = document.querySelector("#InfoContainer");
const bookNavButton = document.querySelector("#bookNav");
bookNavButton.addEventListener('click', function () {
    getAll("/db/books").then(res=>{
        switchToBook(res);
    });

}, false);
const UserNavButton = document.querySelector("#userNav");
UserNavButton.addEventListener('click', function () {
    getAll("/db/users").then(res=>{
        switchToUser(res);
    });

}, false);

let curNav = bookNavButton;

function searchBarBookSearch() {
    const searchBar = document.getElementsByClassName('searchBar');
    let data = {
        word: searchBar[0].value,

    };
    const request = new Request('/db/fuzzySearch', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    getAll(request).then(res => {
        switchToBook(res);

    });
}

function searchBarUserSearch() {
    const searchBar = document.getElementsByClassName('searchBar');
    let data = {
        word: searchBar[0].value,

    };
    const request = new Request('/db/searchUser', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    getAll(request).then(res => {
        switchToUser(res);

    });
}

function changeActive(elem) {
    curNav.parentElement.classList.remove("active");
    elem.parentElement.classList.add("active");
    curNav = elem;
}

function switchToBook(res) {
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

    for (let i = 0; i < res.length; i++) {
        let book = res[i];
        // First, add authors

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
        const titleContainer = document.createElement('p');
        titleContainer.id = String(book._id);
        titleContainer.appendChild(document.createTextNode(book.bookTitle));
        span.appendChild(titleContainer);
        //temp
        getAll("/db/users/"+book.user).then(res=>{
            const info = document.createTextNode(res.name + " | " + book.genre);
            const p = document.createElement("p");
            p.className = "displayInfo";
            p.appendChild(info);
            span.appendChild(p);
        });


        const button = getDeleteButton();
        button.onclick = deleteBook;

        divider.appendChild(imgContainer);
        divider.appendChild(span);
        divider.appendChild(button);


        booksRanking.appendChild(divider);
    }


}

function switchToUser(res) {
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
        for (let i = 0; i < res.length; i++) {
            let user = res[i];
            // First, add authors
            const anchor = document.createElement("a");
            anchor.setAttribute("href", "");
            const parag = document.createElement("p");
            parag.className = "author";
            const author = document.createTextNode(user.name);
            parag.appendChild(author);
            anchor.appendChild(parag);

            // Add books to the ranking section
            const divider = document.createElement("div");

            divider.className = "bookDisplay";
            const imgContainer = document.createElement('a');
            imgContainer.id = user._id;
            imgContainer.setAttribute('href', 'public/HTML/profile.html');
            const img = document.createElement("img");
            if (user.image == null) {
                img.src = "img/dog.jpeg";
            } else {
                img.src = user.image;
            }
            img.className = "userIcon";
            imgContainer.appendChild(img);
            const span = document.createElement("span");
            span.className = "bookDisplayText";
            span.appendChild(document.createElement("p").appendChild(document.createTextNode(user.name)));


            const button = getDeleteButton();
            button.onclick = deleteUser;
            divider.appendChild(imgContainer);
            divider.appendChild(span);
            divider.appendChild(button);


            booksRanking.appendChild(divider);
        }

}
getAll("/db/books").then(res=>{
    switchToBook(res);
});


function deleteBook(e) {
    e.preventDefault();
    const name = e.target.parentElement.children[1].children[0];



    const request = new Request('/db/books/'+name.id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    getAll(request).then(res => {
        log("OUT");

    });

    e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}

function deleteUser(e) {
    e.preventDefault();
    const id = e.target.parentElement.children[0].id;


    const request = new Request('/db/users/'+id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    getAll(request).then(res => {
        log("OUT");

    });

    e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}

function getDeleteButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.innerText = "Delete";
    button.className = "deleteBtn";
    return button;
}