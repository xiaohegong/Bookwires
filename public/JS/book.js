'use strict';
const log = console.log;
const currentLocation = window.location.href;
const url = "/db" + new URL(currentLocation).pathname;
const bookId = url.split("/")[3];

const read = document.getElementById("read");

async function getInfo(url) {
    return fetch(url).then((res) => res.json())
        .then((bookJson) => {
            return bookJson;
        }).catch(error => log(error));
}

const save = document.getElementById("save");

if (document.cookie) {
    const cookie = Cookies.get();

    let data = {
        user: getCookie("id"),
        book: bookId

    };
    const request = new Request('/db/userReadingChapter/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });
    getInfo(request).then(res => {
        if (res.length === 0) {
            read.href = "/books/" + bookId + "/" + 0;
        } else {
            read.href = "/books/" + bookId + "/" + res.chapter_num;
            save.innerText = "SAVED";
            save.onclick = function (e) {
                e.preventDefault();
            };
        }

    }).catch(error => {
        log(error);
    });

} else {
    read.href = "/books/" + bookId + "/" + 0;

}
// getInfo(url).then(book=>{
//     read.href = "/books/"+bookId+"/"+0;
//
// });

const commentBox = document.getElementById('commentBox');
const enterBtn = document.getElementById("enterBtn");
const cancelBtn = document.getElementById("cancelBtn");
const ratingBtn = document.getElementsByClassName("rating")[0];


ratingBtn.onclick = function rateBook() {
    const input = document.getElementsByName("rating");
    if (document.cookie) {

        for (let i = 0, length = input.length; i < length; i++) {
            if (input[i].checked) {
                // do whatever you want with the checked radio
                getInfo(url).then(res => {
                    return (res.numOfRate * res.rating + parseInt(input[i].value)) / (res.numOfRate + 1);
                }).then(res => {
                    const data = {
                        book: bookId,
                        rate: res
                    };
                    const request = new Request('/db/rateBook', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                    });
                    return getInfo(request);
                }).then(res => {
                    ratingBtn.disabled = true;
                }).catch(error => {
                    log(error);
                });

                break;
            }
        }
    } else {
        location.href = "/login";
    }
};

// Call back function for cancel button
cancelBtn.onclick = function cancelComment() {
    commentBox.value = "";
};


// Call back function for enter button
enterBtn.onclick = function enterComment() {
    if (document.cookie) {
        let data = {
            user: getCookie("id"),
            content: commentBox.value
        };
        getInfo(url).then(book => {

            const request = new Request('/db/booksComment/' + book._id, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            });
            return getInfo(request);
        }).then(res => {
            addCommentToTable(data);
        }).catch(error => {
            log(error);
        }).catch(error => {
            log(error);
        });
        commentBox.value = "";
    } else {
        location.href = "/login";
    }


    // book.newComment(comment);// server call that save the comment into database


};

save.onclick = function saveToShelf(e) {
    e.preventDefault();
    if (document.cookie) {

        getInfo(url).then(book => {
            let data = {
                user: getCookie("id"),
                book: book._id
            };
            const request = new Request('/db/BookToRead/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            });
            return getInfo(request);
        }).then(res => {
            save.innerText = "SAVED";
            save.onclick = function (e) {
                e.preventDefault();
            };
        }).catch(error => {
            log(error);
        });
    } else {
        location.href = "/login";
    }

};


function addCommentToTable(comment) {
    getInfo("/db/users/" + comment.user).then(res => {
        const newComments = document.createElement('div');
        commentsArea.appendChild(newComments);
        newComments.className = 'comment';
        const CommentUserImage = document.createElement('img');
        CommentUserImage.src = res.image;
        CommentUserImage.className = 'CommentUserImage';
        newComments.appendChild(CommentUserImage);

        const CommentUserNameContainer = document.createElement('h5');
        CommentUserNameContainer.className = 'CommentUserName';
        const CommentUserName = document.createTextNode(res.name);
        CommentUserNameContainer.appendChild(CommentUserName);
        newComments.appendChild(CommentUserNameContainer);

        const UserCommentContainer = document.createElement('p');
        const UserComment = document.createTextNode(comment.content);
        UserCommentContainer.appendChild(UserComment);
        newComments.appendChild(UserCommentContainer);
        if (document.cookie && Cookies.get().admin === "true") {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = "delete";
            deleteButton.className = "btn btn-info deleteButton";
            deleteButton.onclick = function () {
                let data = {
                    comment: comment._id,
                    book: bookId
                };
                const request = new Request('/db/deleteComment', {
                    method: 'DELETE',
                    body: JSON.stringify(data),
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                });
                getInfo(request).then(res => {
                    deleteButton.parentElement.parentElement.removeChild(deleteButton.parentElement);
                });

            };
            newComments.appendChild(deleteButton);
            newComments.appendChild(UserCommentContainer);
        }
    }).catch(error => {
        log(error);
    });

}

function addOtherBook(book, i) {
    const slider = document.getElementsByClassName("carousel-inner");
    const bookImage = document.createElement('img');
    bookImage.src = book.image;
    bookImage.className = 'otherBookImg';
    slider[0].children[i].appendChild(bookImage);
    const bookname = document.createTextNode(book.bookTitle);
    const li = document.createElement('a');
    li.href = "/books/" + String(book._id);
    const otherbooknameContainer = document.createElement('h3');
    otherbooknameContainer.className = 'center';
    otherbooknameContainer.appendChild(bookname);
    li.appendChild(otherbooknameContainer);
    slider[0].children[i].appendChild(li);
}

const chapters = document.getElementById("chapters");
const chapterTable = document.getElementById("chapterTable");
const bookInformation = document.getElementById("bookInformation");


(function () {
    getInfo(url).then(res => {
        const authorTitle = document.createTextNode(res.bookTitle);
        const bookdesription = document.createTextNode(res.description);
        const bookNameContainer = document.createElement('h1');
        const zoom = document.getElementsByClassName("zoom")[0];
        const bookImage = document.createElement('img');

        bookImage.src = res.image;
        zoom.appendChild(bookImage);

        bookNameContainer.appendChild(authorTitle);

        //AuthorNameContainer.href = 'www.google.ca'
        const desriptionContainer = document.createElement('p');
        desriptionContainer.appendChild(bookdesription);
        bookInformation.insertBefore(bookNameContainer, bookInformation.lastElementChild);

        bookInformation.insertBefore(desriptionContainer, bookInformation.lastElementChild);
        return getInfo("/db/users/" + res.user);
    }).then(res => {
        (function () {
            const authorName = document.createTextNode(res.name);
            const AuthorNameContainer = document.createElement('h3');
            AuthorNameContainer.user = res;
            AuthorNameContainer.appendChild(authorName);
            bookInformation.insertBefore(AuthorNameContainer, bookInformation.lastElementChild.previousSibling);
        })();


        //Author Bar
        const authorName = document.createTextNode(res.name);
        const author = document.getElementById('authorInfo');
        const authorDetail = document.getElementById('authorDetail');
        const authorImageContainer = document.createElement('a');
        authorImageContainer.href = "/profile/" + res._id;
        const authorImage = document.createElement('img');
        authorImage.className = 'authorPic';
        authorImage.src = res.image;
        authorImageContainer.appendChild(authorImage);
        author.insertBefore(authorImageContainer, authorDetail);
        const nameContainer = document.createElement('h3');
        nameContainer.appendChild(authorName);
        author.insertBefore(nameContainer, authorDetail);

        // author.appendChild(nameContainer);


        //other books

        for (let i = 0; i < res.writtenBook.length; i++) {
            getInfo("/db/books/" + res.writtenBook[i]).then(book => {
                if (book != null) {
                    addOtherBook(book, i);
                } else {
                    log("NO BOOK");
                }

            });
        }

    }).catch(error => {
        log(error);
    });

})();


//create chapters
let i = 0;
getInfo(url).then(res => {
    while (i < res.chapters.length) {
        const nextLine = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            if (i >= res.chapters.length) {
                break;
            }
            const newPost = document.createElement('td');
            newPost.className = 'Chapter';
            const newPostTitle = document.createTextNode((i + 1) + " : " + res.chapters[i].chapterTitle);
            const newPostTitleContainer = document.createElement('a');
            newPostTitleContainer.href = "/books/" + res._id + "/" + i;
            newPostTitleContainer.appendChild(newPostTitle);
            newPost.appendChild(newPostTitleContainer);
            nextLine.appendChild(newPost);
            i++;
        }
        chapterTable.appendChild(nextLine);

    }

}).catch(error => {
    log(error);
});


//create author information


//other book written by this author

//create comments
const commentsArea = document.getElementById('commentsArea');
getInfo(url).then(res => {
    for (let i = 0; i < res.comments.length; i++) {
        // const comment = res.comments[i].content;
        addCommentToTable(res.comments[i]);
    }
}).catch(error => {
    log(error);
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




