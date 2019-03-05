'use strict';
const log = console.log;

// testing book
const book = fakeBooks[1];
const save = document.getElementById("save");

const commentBox = document.getElementById('commentBox');

function cancelComment() {
    commentBox.value = "";
}

function enterComment() {
    const comment = new Comment(fakeUser[0], commentBox.value);
    book.newComment(comment);
    commentBox.value = "";
    addCommentToTable(comment);

}

save.onclick = function saveToShelf() {
    book.save(fakeUser[0]);
};

function addCommentToTable(comment) {
    const newComments = document.createElement('div');
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

const chapters = document.getElementById("chapters");
const chapterTable = document.getElementById("chapterTable");
const bookInformation = document.getElementById("bookInformation");


// Let's create a new chapter
(function () {
    const authorTitle = document.createTextNode(book.getBookTitle());
    const authorName = document.createTextNode(book.getAuthor());
    const bookdesription = document.createTextNode(book.getDescription());
    const bookNameContainer = document.createElement('h1');
    const zoom = document.getElementsByClassName("zoom")[0];
    const bookImage = document.createElement('img');
    bookImage.src = book.getImage();
    zoom.appendChild(bookImage);

    bookNameContainer.appendChild(authorTitle);
    const AuthorNameContainer = document.createElement('h3');
    AuthorNameContainer.appendChild(authorName);
    //AuthorNameContainer.href = 'www.google.ca'
    const desriptionContainer = document.createElement('p');
    desriptionContainer.appendChild(bookdesription);
    bookInformation.insertBefore(bookNameContainer, bookInformation.lastElementChild);
    bookInformation.insertBefore(AuthorNameContainer, bookInformation.lastElementChild);
    bookInformation.insertBefore(desriptionContainer, bookInformation.lastElementChild);
})();

let i = 0;
while (i < book.getTotalChapter()) {
    const nextLine = document.createElement('tr');

    for (let j = 0; j < 3; j++) {
        if (i >= book.getTotalChapter()) {
            break;
        }
        const newPost = document.createElement('td');
        newPost.className = 'Chapter';
        const newPostTitle = document.createTextNode(book.getChapter(i).getDescription());
        const newPostTitleContainer = document.createElement('a');
        newPostTitleContainer.href = "ReadingPage.html";
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
const authorImageContainer = document.createElement('a');
authorImageContainer.href = "profile.html";
const authorImage = document.createElement('img');
authorImage.className = 'authorPic';
authorImage.src = book.author.getImage();
authorImageContainer.appendChild(authorImage);
author.insertBefore(authorImageContainer, authorDetail);
// author.appendChild(authorImage);


const nameContainer = document.createElement('h3');
const authorName = document.createTextNode(book.getAuthor());
nameContainer.appendChild(authorName);
author.insertBefore(nameContainer, authorDetail);

// author.appendChild(nameContainer);

//other book written by this author
const slider = document.getElementsByClassName("carousel-inner");

for (let i = 0; i < 3; i++) {
    const bookImage = document.createElement('img');
    bookImage.src = 'img/WanderingEarth.jpg';
    bookImage.className = 'otherBookImg';
    slider[0].children[i].appendChild(bookImage);
    const bookname = document.createTextNode('BOOK NAME');
    const otherbooknameContainer = document.createElement('h3');
    otherbooknameContainer.className = 'center';
    otherbooknameContainer.appendChild(bookname);
    slider[0].children[i].appendChild(otherbooknameContainer);
}


//create comments
const commentsArea = document.getElementById('commentsArea');

for (let i = 0; i < book.comments.length; i++) {
    const comment = book.comments[i];
    addCommentToTable(comment);
}

// Code for animated menu bar
const comments = document.getElementById("comments");
$('.nav-link').on('click', function () {
    $('.active-link').removeClass('active-link');
    $(this).addClass('active-link');

    if ($(this).children()[0].innerText === "Comments") {
        changeDisplayedText(comments, chapters);
    } else {
        changeDisplayedText(chapters, comments);
    }

});

// Set the displayed text in the box by menu selection
function changeDisplayedText(selected, unselected) {
    selected.style.display = "block";
    unselected.style.display = "none";
}




