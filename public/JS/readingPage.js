const log = console.log;

//get the id of book and chapter from somewhere
const path = window.location.pathname.split("/")
let book_id = path[1];
log(book_id)
let chapter_index = parseInt(path[2]);
log(chapter_index)
//

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

    log(chapters);
    chapters.then((array)=>{
        nameBox.innerHTML = array[chapter_index].chapterTitle;
        contentBox.innerHTML = array[chapter_index].content;
    });

}

let chapters = getChaptersReading(book_id);
updateReadingPage(chapters);


// those two functions will be assign to the onclick of the buttons on 4 corner of the reading pages
function showNextChapter(){
    chapter_index += 1;
    updateReadingPage(chapters);
}

function showLastChapter(){
    chapter_index -= 1;
    updateReadingPage(chapters);
}

function activateButtons(){
    let upperLeftButton = document.getElementById('upperLeftButton');
    let upperRightButton = document.getElementById('upperRightButton');
    let lowerLeftButton = document.getElementById('lowerLeftButton');
    let lowerRightButton = document.getElementById('lowerRightButton');

    upperLeftButton.onclick = showLastChapter;
    lowerRightButton.onclick = showNextChapter;
    upperRightButton.onclick = showNextChapter;
    lowerLeftButton.onclick = showLastChapter;
}

//activate the buttons' functions
activateButtons();

log("end of hard code")