'use strict';
const log = console.log;


const bookNav = document.getElementsByClassName('book-nav');
const chapters = document.getElementById("chapters");
const chapterTable = document.getElementById("chapterTable");

// testing book
const book = fakeBooks[1]
// Let's create a new chapter
for (let i = 0; i < 2; i++) {
    const nextLine = document.createElement('tr');

    for (let j = 0; j < 3; j++) {
        const newPost = document.createElement('td');
        newPost.className = 'Chapter';
        const newPostTitle = document.createTextNode(book.getChapter(i * 3 + j).getDescription());
        const newPostTitleContainer = document.createElement('p');
        newPostTitleContainer.appendChild(newPostTitle);
        newPost.appendChild(newPostTitleContainer);
        nextLine.appendChild(newPost);
    }
    chapterTable.appendChild(nextLine);

}

//create author information
const author = document.getElementById('authorInfo');
const authorDetail = document.getElementById('authorDetail');
const authorImage = document.createElement('img');
authorImage.className = 'authorPic';
authorImage.src = 'img/profile.png';
author.insertBefore(authorImage, authorDetail);
// author.appendChild(authorImage);

const name = document.createTextNode(book.getAuthor());
const nameContainer = document.createElement('h3');
nameContainer.appendChild(name);
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
const booknameContainer = document.createElement('h3');
booknameContainer.appendChild(bookname);
otherBook.appendChild(booknameContainer);

const bookdesription = document.createTextNode('as qwd  asd f ew dcvdsvewsd  w dsf w f d fesf ');
const bookdesriptionContainer = document.createElement('p');
bookdesriptionContainer.appendChild(bookdesription);
otherBook.appendChild(bookdesriptionContainer);


//create comments
const commentsArea = document.getElementById('commentsArea');
const newComments = document.createElement('div');
commentsArea.appendChild(newComments);
newComments.className = 'comment';
const CommentUserImage = document.createElement('img');
CommentUserImage.src = "img/profile.png";
CommentUserImage.className = 'CommentUserImage';
newComments.appendChild(CommentUserImage);

const CommentUserNameContainer = document.createElement('h5');
CommentUserNameContainer.className = 'CommentUserName';
const CommentUserName = document.createTextNode("Qiling Zhang");
CommentUserNameContainer.appendChild(CommentUserName);
newComments.appendChild(CommentUserNameContainer);

const UserCommentContainer = document.createElement('p');
const UserComment = document.createTextNode("good book good book good book good book good book good book good book");
UserCommentContainer.appendChild(UserComment);
newComments.appendChild(UserCommentContainer);








