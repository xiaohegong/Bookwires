const log = console.log;

//get the id of book and chapter from somewhere
const path = window.location.pathname.split("/");
let book_id = path[2];
let chapter_index = parseInt(path[3]);
if (document.cookie) {
    let data = {
        user: getCookie("id"),
        chapter_num: chapter_index,
        book: book_id
    };
    const request = new Request('/db/updateReadingChapter', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then(res => {
        log(res);
    }).catch(error => {
        log(error);
    });
}


function getChaptersReading(book_id) {
    let url = '/db/reading/' + book_id;
    // log(url);
    return fetch(url).then((res) => res.json())
        .then((chapJson) => {
            //when we enter a reading page, we update the current page and show the content automatically

            return chapJson;
        }).catch(error => log(error));
}


function updateReadingPage(chapters) {
    //get the elements we want to update
    let name = document.getElementsByClassName("chapterName")[0];
    let contentBox = document.getElementById('mainText');

    // log(name);
    chapters.then((array) => {
        name.innerHTML = array[chapter_index].chapterTitle;
        contentBox.innerHTML = array[chapter_index].content;
    });

}


function activateButtons(chapters) {
    const upperLeftButton = document.getElementById('upperLeftButton');
    const upperRightButton = document.getElementById('upperRightButton');
    const lowerLeftButton = document.getElementById('lowerLeftButton');
    const lowerRightButton = document.getElementById('lowerRightButton');

    // log(chapters);
    chapters.then((array) => {
        const chapter_num_totally = array.length - 1;
        if (chapter_index < chapter_num_totally) {
            upperRightButton.children[0].href = "/books/" + book_id + "/" + (chapter_index + 1);
            lowerRightButton.children[0].href = "/books/" + book_id + "/" + (chapter_index + 1);
        }
    });
    if (chapter_index > 0) {
        upperLeftButton.children[0].href = "/books/" + book_id + "/" + (chapter_index - 1);
        lowerLeftButton.children[0].href = "/books/" + book_id + "/" + (chapter_index - 1);
    }
}

//call of functions
const chapters = getChaptersReading(book_id);
(chapters.then((array) => {
    if (array.length !== 0) {
        updateReadingPage(chapters);
        activateButtons(chapters);
    } else {
        swal({
            title: "No book content",
            text: "The author has not posted any chapters yet, please check back later!"
                + " You can still save the book and we will keep you updated.\n"
                + "You can also bug the author to publish more chapters by leaving a comment :)",
            icon: "error",
        }).then(function () {
            location.href = "./";
        });
    }
}));