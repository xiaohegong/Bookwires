const log = console.log;

//get the id of book and chapter from somewhere, which i haven't got the idea how to do so
const book_id = 123;
const chap_id = 456;
//////////////////////////

function getChapterReading(book_id,chap_id){
    let url = '/db/reading/'+book_id+'/'+chap_id;
    log(url);
    return fetch(url).then((res) => res.json())
        .then((chapJson) => {
            log(chapJson);
            return chapJson;
        }).catch(error => log(error));
}


function updateReadingPage(chapterReading){
    //get the attibutes ready, should be two string
    const chapterTitle = chapterReading.chapterTitle;
    const chapterContent = chapterReading.content;

    //get the elements we want to update
    let nameBox = document.getElementById('chapterNameBox');
    let contentBox = document.getElementById('mainText');

    nameBox.innerHTML = chapterTitle;
    contentBox.innerHTML = chapterContent;
}

let chap = getChapterReading(book_id,chap_id);
updateReadingPage(chap);


////////////////////////////////////
//TODO 4 buttons
////////////////////////////////////
