const log = console.log;

//get the id of book and chapter from somewhere
const path = window.location.pathname.split("/");
let book_id = path[2];
let chapter_index = parseInt(window.location.search.slice(1));

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
    const upperLeftButton = document.getElementById('upperLeftButton');
    const upperRightButton = document.getElementById('upperRightButton');
    const lowerLeftButton = document.getElementById('lowerLeftButton');
    const lowerRightButton = document.getElementById('lowerRightButton');

    log(chapters);
    chapters.then((array)=>{
        const chapter_num_totally = array.length-1;
        if(chapter_index<chapter_num_totally) {
            upperRightButton.children[0].href = "/book/" + book_id + "?" + (chapter_index + 1);
            lowerRightButton.children[0].href = "/book/" + book_id + "?" + (chapter_index + 1);
        }
    });
    if (chapter_index > 0) {
        upperLeftButton.children[0].href = "/book/" + book_id + "?" + (chapter_index - 1);
        lowerLeftButton.children[0].href = "/book/" + book_id + "?" + (chapter_index - 1);
    }
}
//call of functions
const chapters = getChaptersReading(book_id);
updateReadingPage(chapters);
activateButtons(chapters);

