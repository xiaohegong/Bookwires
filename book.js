'use strict';
const log = console.log;


const bookNav = document.getElementsByClassName('book-nav');
const chapters = document.getElementById("chapters");
const chapterTable = document.getElementById("chapterTable");

// Let's create a new chapter
for (let i = 0; i < 4; i++) {
	const nextLine = document.createElement('tr')
	
	for(let j = 0; j < 3; j++){
		const newPost = document.createElement('td')
		newPost.className = 'chapter'
		const chapterOne = new Chapter(''+(i*3+j+1),'hello')
		const newPostTitle = document.createTextNode(chapterOne.getDescription())
		const newPostTitleContainer = document.createElement('p')
		newPostTitleContainer.appendChild(newPostTitle)
		newPost.appendChild(newPostTitleContainer)
		nextLine.appendChild(newPost);
	}
	chapterTable.appendChild(nextLine);
	
}

//create author information
const author = document.getElementById('authorInfo');
const authorDetail = document.getElementById('authorDetail');
const authorImage  =document.createElement('img');
authorImage.className = 'authorPic';
authorImage.src = 'img/profile.png'
author.insertBefore(authorImage,authorDetail)
// author.appendChild(authorImage);

const name = document.createTextNode('Xie Wu')
const nameContainer = document.createElement('h3')
nameContainer.appendChild(name)
author.insertBefore(nameContainer,authorDetail)

// author.appendChild(nameContainer);

//other book written by this author
const otherBook = document.getElementById('authorOtherBook')
const bookImageContainer = document.createElement('div');
bookImageContainer.className = 'otherBookContainer';
const leftArrow  =document.createElement('img');
leftArrow.src = 'img/left.png'
leftArrow.className = 'arrow'
bookImageContainer.appendChild(leftArrow)


const bookImage  =document.createElement('img');
bookImage.className = "otherBook"
bookImage.src = 'img/wanderingEarth.jpg'
bookImageContainer.appendChild(bookImage)

const rightArrow  =document.createElement('img');
rightArrow.src = 'img/right.png'
rightArrow.className = 'arrow'
bookImageContainer.appendChild(rightArrow)
otherBook.appendChild(bookImageContainer)

const bookname = document.createTextNode('BOOK NAME')
const booknameContainer = document.createElement('h3')
booknameContainer.appendChild(bookname)
otherBook.appendChild(booknameContainer)

const bookdesription = document.createTextNode('as qwd  asd f ew dcvdsvewsd  w dsf w f d fesf ')
const bookdesriptionContainer = document.createElement('p')
bookdesriptionContainer.appendChild(bookdesription)
otherBook.appendChild(bookdesriptionContainer)


//create comments
const commentsArea = document.getElementById('commentsArea')
const newComments = document.createElement('div')






