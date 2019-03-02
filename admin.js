'use strict';
const log = console.log;

const books = fakeBooks;
const users = fakeUser;


const overallContainer = document.getElementsByClassName("carousel-item active")

function switchToUser(){
	const rowsContainer = document.createElement('div');
	const bookHeader = document.createElement('h1')
	bookHeader.appendChild(document.createTextNode('Users'))
	const searchBook = document.createElement('input')
	searchBook.className = 'form-control shelf-search'
	searchBook.setAttribute('type','text')
	searchBook.setAttribute('placeholder','Search User')
	bookHeader.appendChild(searchBook)
	rowsContainer.appendChild(bookHeader)
	rowsContainer.className = "rows-container"
	let i = 0;
	while (i < users.length) {
    const row = document.createElement('ul');
    row.className = 'book-row'

    for (let j = 0; j < 5; j++) {
    	if(i >= users.length){
    		break;
    	}
        const userContainer = document.createElement('li');
        const userImg  =document.createElement('img')
        userImg.src = users[i].getImage();
        userContainer.appendChild(userImg)
        const button = document.createElement("input");
        const title = document.createElement('p')
        title.appendChild(document.createTextNode(books[i].getAuthor()))
	    button.type = "button";
	    button.value = "delete";
	    button.onclick = deleteBook;

        userContainer.appendChild(title)
        userContainer.appendChild(button)
        row.appendChild(userContainer)
        i++;
    }
    rowsContainer.appendChild(row);

	}
	overallContainer[0].replaceChild(rowsContainer,overallContainer[0].firstChild)

	
}
switchToBook();
function switchToBook(){
	const rowsContainer = document.createElement('div');
	const bookHeader = document.createElement('h1')
	bookHeader.appendChild(document.createTextNode('BookShelf'))
	const searchBook = document.createElement('input')
	searchBook.className = 'form-control shelf-search'
	searchBook.setAttribute('type','text')
	searchBook.setAttribute('placeholder','Search Title')
	bookHeader.appendChild(searchBook)
	rowsContainer.appendChild(bookHeader)
	rowsContainer.className = "rows-container"
	let i = 0;
	while (i < books.length) {
    const row = document.createElement('ul');
    row.className = 'book-row'

    for (let j = 0; j < 5; j++) {
    	if(i >= books.length){
    		break;
    	}
        const bookContainer = document.createElement('li');
        const bookImg  =document.createElement('img')
        bookImg.src = books[i].getImage();
        const button = document.createElement("input");
        const title = document.createElement('p')
        title.appendChild(document.createTextNode(books[i].getBookTitle()))
	    button.type = "button";
	    button.value = "delete";
	    button.onclick = deleteBook;

        bookContainer.appendChild(bookImg)
        bookContainer.appendChild(title)
        bookContainer.appendChild(button)
        row.appendChild(bookContainer)
        i++;
    }
    rowsContainer.appendChild(row);

	}
	overallContainer[0].replaceChild(rowsContainer,overallContainer[0].firstChild)
	// overallContainer[0].appendChild(rowsContainer)
}
function switchToSetting(){
	log('set')
}

function deleteBook(e){
	e.preventDefault()
	log(e.target)
}