'use strict';
const log = console.log;

const books = fakeBooks;
const users = fakeUser;


const overallContainer = document.getElementsByClassName("InfoContainer")
const booksRanking = document.querySelector("#InfoContainer");
const bookNavButton = document.querySelector("#bookNav");
const UserNavButton = document.querySelector("#userNav");


let curNav = bookNavButton;

function changeActive(elem){
    curNav.parentElement.classList.remove("active");
    elem.parentElement.classList.add("active");
    curNav = elem;
}

function switchToBook(){
	changeActive(bookNavButton);
	while (booksRanking.firstChild) {
	    booksRanking.removeChild(booksRanking.firstChild);
	}
	for (let i = 0; i < fakeBooks.length; i++) {
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

	    const button = document.createElement("input");
	    button.type = "button";
	    button.value = "delete";
	    button.onclick = deleteBook;
	    
	    

	    divider.appendChild(imgContainer);
	    divider.appendChild(span);
	    divider.appendChild(button)


	    booksRanking.appendChild(divider);
	}
}

function switchToUser(){
	changeActive(UserNavButton);
	while (booksRanking.firstChild) {
	    booksRanking.removeChild(booksRanking.firstChild);
	}
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
	    const imgContainer = document.createElement('a')
	    imgContainer.setAttribute('href','profile.html')
	    const img = document.createElement("img");
	    img.src = user.getImage();
	    img.className = "bookDisplayImg";
	    imgContainer.appendChild(img);
	    const span = document.createElement("span");
	    span.className = "bookDisplayText";
	    span.appendChild(document.createElement("p").appendChild(document.createTextNode(user.getName())));

	    const p = document.createElement("p");
	    p.className = "displayInfo";
	    span.appendChild(p);

	    const button = document.createElement("input");
	    button.type = "button";
	    button.value = "delete";
	    button.onclick = deleteUser;
	    divider.appendChild(imgContainer);
	    divider.appendChild(span);
	    divider.appendChild(button)


	    booksRanking.appendChild(divider);
	}


	
	
}
switchToBook();



function deleteBook(e){
	e.preventDefault()
	const name = e.target.parentElement.children[1].innerText;
	fakeBooks = removeBook(name);
	e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}

function deleteUser(e){
	e.preventDefault()
	const name = e.target.parentElement.children[1].innerText;
	fakeUser = removeUser(name);
	e.target.parentElement.parentElement.removeChild(e.target.parentElement);

}