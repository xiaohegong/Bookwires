const log = console.log;

//get the id of book and chapter from somewhere
const path = window.location.pathname.split("/")
let book_id = path[1];
let chapter_index = parseInt(path[2]);
log(book_id);
log(chapter_index);

function getChaptersReading(book_id){
    let url = '/db/reading/'+book_id;
    log(url);
    return fetch(url).then((res) => res.json())
        .then((chapJson) => {
            log(chapJson);
            //when we enter a reading page, we update the current page and show the content automatically

            return chapJson;
        }).catch(error => log(error));
}




function updateReadingPage(chapters){
    //get the elements we want to update
    let nameBox = document.getElementById('chapterNameBox');
    let contentBox = document.getElementById('mainText');

    //log(chapters);
    chapters.then((array)=>{
        nameBox.innerHTML = array[chapter_index].chapterTitle;
        contentBox.innerHTML = array[chapter_index].content;
    });

}


function activateButtons(chapters) {
    let upperLeftButton = document.getElementById('upperLeftButton');
    let upperRightButton = document.getElementById('upperRightButton');
    let lowerLeftButton = document.getElementById('lowerLeftButton');
    let lowerRightButton = document.getElementById('lowerRightButton');

    let chapter_num_totally = 0;
    log(chapters);
    chapters.then((array)=>{
        chapter_num_totally = array.length;
        resolve(chapter_num_totally);
    });


    if(chapter_index<chapter_num_totally) {
        //TODO
        log('can go next')
        upperRightButton.children[0].href = "/" + book_id + "/" + (chapter_index + 1);
        lowerRightButton.children[0].href = "/" + book_id + "/" + (chapter_index + 1);
    }
    if (chapter_index > 0) {
        log('can go back')
        upperLeftButton.children[0].href = "/" + book_id + "/" + (chapter_index - 1);
        lowerLeftButton.children[0].href = "/" + book_id + "/" + (chapter_index - 1);
    }
}
//call of functions
let chapters = getChaptersReading(book_id);
updateReadingPage(chapters);
activateButtons(chapters);

log("end of hard code")