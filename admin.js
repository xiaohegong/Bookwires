'use strict';
const log = console.log;

const books = fakeBooks;


const overallContainer = document.getElementsByClassName("carousel-item active")
log(overallContainer)

function switchToUser(){
	log('USer')
}
switchToBook();
function switchToBook(){
	const rowsContainer = document.createElement('div');
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
        bookContainer.appendChild(bookImg)
        row.appendChild(bookContainer)
        i++;
    }
    rowsContainer.appendChild(row);

	}
	overallContainer[0].appendChild(rowsContainer)
}
function switchToSetting(){
	log('set')
}