'use strict';
const log = console.log;


const bookNav = document.getElementsByClassName('book-nav');
const chapters = document.getElementById("chapters");
const chapterTable = document.getElementById("chapterTable");
const bookInformation = document.getElementById("bookInformation");

// testing book
const book = fakeBooks[1];
// Let's create a new chapter
(function(){
	const authorTitle = document.createTextNode(book.getBookTitle());
	const authorName = document.createTextNode(book.getAuthor());
	const bookdesription = document.createTextNode(book.getDescription());
	const bookNameContainer = document.createElement('h1');
	bookNameContainer.appendChild(authorTitle);
	const AuthorNameContainer = document.createElement('h3');
	AuthorNameContainer.appendChild(authorName);
	//AuthorNameContainer.href = 'www.google.ca'
	const desriptionContainer = document.createElement('p');
	desriptionContainer.appendChild(bookdesription);
	bookInformation.insertBefore(bookNameContainer,bookInformation.lastElementChild)
	bookInformation.insertBefore(AuthorNameContainer,bookInformation.lastElementChild)
	bookInformation.insertBefore(desriptionContainer,bookInformation.lastElementChild)
})();

let i = 0;
while (i < book.getTotalChapter()) {
    const nextLine = document.createElement('tr');

    for (let j = 0; j < 3; j++) {
    	if(i >= book.getTotalChapter()){
    		break;
    	}
        const newPost = document.createElement('td');
        newPost.className = 'Chapter';
        const newPostTitle = document.createTextNode(book.getChapter(i).getDescription());
        const newPostTitleContainer = document.createElement('p');
        newPostTitleContainer.appendChild(newPostTitle);
        newPost.appendChild(newPostTitleContainer);
        nextLine.appendChild(newPost);
        i++;
    }
    chapterTable.appendChild(nextLine);

}

//create author information
const author = document.getElementById('authorInfo');
const authorDetail = document.getElementById('authorDetail');
const authorImage = document.createElement('img');
authorImage.className = 'authorPic';
authorImage.src = book.author.getImage();
author.insertBefore(authorImage, authorDetail);
// author.appendChild(authorImage);


const nameContainer = document.createElement('h3');
const authorName = document.createTextNode(book.getAuthor());
nameContainer.appendChild(authorName);
author.insertBefore(nameContainer, authorDetail);

// author.appendChild(nameContainer);

//other book written by this author
const otherBook = document.getElementById('authorOtherBook');
const bookImageContainer = document.createElement('div');
bookImageContainer.className = 'otherBookContainer';
const leftArrow = document.createElement('img');
leftArrow.src = 'img/left.png';
leftArrow.className = 'arrow';
bookImageContainer.appendChild(leftArrow);


const bookImage = document.createElement('img');
bookImage.className = "otherBook";
bookImage.src = 'img/wanderingEarth.jpg';
bookImageContainer.appendChild(bookImage);

const rightArrow = document.createElement('img');
rightArrow.src = 'img/right.png';
rightArrow.className = 'arrow';
bookImageContainer.appendChild(rightArrow);
otherBook.appendChild(bookImageContainer);

const bookname = document.createTextNode('BOOK NAME');
const otherbooknameContainer = document.createElement('h3');
otherbooknameContainer.appendChild(bookname);
otherBook.appendChild(otherbooknameContainer);

const otherbookdesription = document.createTextNode('as qwd  asd f ew dcvdsvewsd  w dsf w f d fesf ');
const otherbookdesriptionContainer = document.createElement('p');
otherbookdesriptionContainer.appendChild(otherbookdesription);
otherBook.appendChild(otherbookdesriptionContainer);


//create comments
const commentsArea = document.getElementById('commentsArea');
const newComments = document.createElement('div');
for(let i = 0; i < book.comments.length;i++){
	const comment = book.comments[i];
	commentsArea.appendChild(newComments);
	newComments.className = 'comment';
	const CommentUserImage = document.createElement('img');
	CommentUserImage.src = comment.user.getImage();
	CommentUserImage.className = 'CommentUserImage';
	newComments.appendChild(CommentUserImage);

	const CommentUserNameContainer = document.createElement('h5');
	CommentUserNameContainer.className = 'CommentUserName';
	const CommentUserName = document.createTextNode(comment.user.getName());
	CommentUserNameContainer.appendChild(CommentUserName);
	newComments.appendChild(CommentUserNameContainer);

	const UserCommentContainer = document.createElement('p');
	const UserComment = document.createTextNode(comment.getContent());
	UserCommentContainer.appendChild(UserComment);
	newComments.appendChild(UserCommentContainer);
}








