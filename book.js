'use strict';
const log = console.log;

// const Chapter = require('./Chapter');
class Chapter{
	constructor(num,chapterName){
		this.num = num;
		this.chapterName = chapterName;
	}
	getNum(){
		log("num:"+this.num)
		return this.num;
	}
	getName(){
		return this.chapterName;
	}

	getDescription(){
		return 'chapter ' + this.num + ' : ' + this.chapterName;
	}
}

const bookNav = document.getElementsByClassName('book-nav');
log(bookNav);

const chapters = document.getElementById("chapters");
log(chapters);

const chapterTable = document.getElementById("chapterTable");

// Let's create a new chapter
for (let i = 0; i < 3; i++) {
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
bookImageContainer.className = 'zoom otherBook';
const bookImage  =document.createElement('img');
bookImage.src = 'img/wanderingEarth.jpg'
bookImageContainer.appendChild(bookImage)
otherBook.appendChild(bookImageContainer)




