'use strict';
const log = console.log;
const currentLocation = window.location.href;
async function getBook() {
    const url = "/db"+new URL(currentLocation).pathname;
    return fetch(url).then((res) => res.json())
        .then((bookJson) => {
            return bookJson;
        }).catch(error => log(error));
}
getBook().then(res=>log(res.image));

const save = document.getElementById("save");
const commentBox = document.getElementById('commentBox');
const enterBtn = document.getElementById("enterBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Check whether this is the admin's view
const isAdmin = function () {
    return window.location.pathname.includes("admin");
};

// Call back function for cancel button
cancelBtn.onclick = function cancelComment() {
    commentBox.value = "";
};


// Call back function for enter button
enterBtn.onclick = function enterComment() {
    const comment = new Comment(fakeUser[0], commentBox.value);
    book.newComment(comment);// server call that save the comment into database
    commentBox.value = "";
    addCommentToTable(comment);
};

save.onclick = function saveToShelf(e) {
    e.preventDefault();
    book.save(fakeUser[0]); // server call that update the corresponding info
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

    if (isAdmin()) {
        const deleteButton = document.createElement('button');
        deleteButton.innerText = "delete";
        deleteButton.className = "btn btn-info deleteButton";
        deleteButton.onclick = function () {
            deleteButton.parentElement.parentElement.removeChild(deleteButton.parentElement);
        };
        newComments.appendChild(deleteButton);
        newComments.appendChild(UserCommentContainer);
    }
}

const chapters = document.getElementById("chapters");
const chapterTable = document.getElementById("chapterTable");
const bookInformation = document.getElementById("bookInformation");


// Let's create a new chapter
(function () {
    getBook().then(res=>{
        const authorTitle = document.createTextNode(res.bookTitle);
        //TEMP
        const authorName = document.createTextNode("WUXE");
        const bookdesription = document.createTextNode(res.description);
        const bookNameContainer = document.createElement('h1');
        const zoom = document.getElementsByClassName("zoom")[0];
        const bookImage = document.createElement('img');

        bookImage.src = res.image;
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
    });

})();

let i = 0;
getBook().then(res=>{
    while (i < res.chapters.length) {
        const nextLine = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            if (i >= res.chapters.length) {
                break;
            }
            const newPost = document.createElement('td');
            newPost.className = 'Chapter';
            const newPostTitle = document.createTextNode(res.chapters[i].chapterTitle);
            const newPostTitleContainer = document.createElement('a');
            newPostTitleContainer.href = "public/HTML/ReadingPage.html";
            newPostTitleContainer.appendChild(newPostTitle);
            newPost.appendChild(newPostTitleContainer);
            nextLine.appendChild(newPost);
            i++;
        }
        chapterTable.appendChild(nextLine);

    }

});


//create author information
const author = document.getElementById('authorInfo');
const authorDetail = document.getElementById('authorDetail');
const authorImageContainer = document.createElement('a');
authorImageContainer.href = "public/HTML/profile.html";
const authorImage = document.createElement('img');
// authorImage.className = 'authorPic';
// authorImage.src = book.author.getImage();
// authorImageContainer.appendChild(authorImage);
// author.insertBefore(authorImageContainer, authorDetail);
// author.appendChild(authorImage);


// const nameContainer = document.createElement('h3');
// const authorName = document.createTextNode(book.getAuthor());
// nameContainer.appendChild(authorName);
// author.insertBefore(nameContainer, authorDetail);

// author.appendChild(nameContainer);

//other book written by this author
const slider = document.getElementsByClassName("carousel-inner");

for (let i = 0; i < 3; i++) {
    const bookImage = document.createElement('img');
    bookImage.src = '../img/WanderingEarth.jpg';
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
getBook().then(res=>{
    for (let i = 0; i < res.comments.length; i++) {
        const comment = res.comments[i].content;
        addCommentToTable(comment);
    }
});



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




