'use strict';



// variable to keep track if the viewer is the owner of the profile
let profileOwner = true;
// button that changes the viewers authentification for testing purposes
const changeAuthButton = document.querySelector("#change-auth");
changeAuthButton.addEventListener('click', changeAuthentification);

// create a user that is to be used if not the owner of the profile
// this would require a server call to check if the current logged in user
// is the owner or not
const viewingUser = userCreator("sampleViewer","sv@domain.com","123", false);

// get settings form elements:
const emailaddress = document.querySelector("#emailaddress");
const username = document.querySelector("#username");
const pass = document.querySelector("#password");
const descriptionEditable = document.querySelector("#description");

// get custom profile info elements
const profileHeader = document.querySelector(".profileheader");
const followers = document.querySelector("#followerCount");
const following = document.querySelector("#followingCount");
const writtenCount = document.querySelector("#writenCount");
const description = document.querySelector(".profiletextcontainer > p");

// get book creation fields:
const newBookTitleForm = document.querySelector("#book-title");
const newBookGenreForm = document.querySelector("#book-genre");
const newBookDescriptionForm = document.querySelector("#book-description");
const newBookImgForm = document.querySelector("#book-image-upload");
const chapterListDiv = document.querySelector("#chapter-list");
const bookModal = document.querySelector(".book-modal");
const chapterModal = document.querySelector("#chapter-modal");

// chapter creation fields
const chapterNumField = document.querySelector("#chapter-num");
const chapterNameField = document.querySelector("#chapter-name");
const chapterContentField = document.querySelector("#chapter-content");
const chapterListGroup = document.querySelector("#chap-list-group");

// get navigation bar selectors and create click events:
const navSettings = document.querySelector(".nav").children;
//Bookshelf
const shelfButton = document.querySelector("#navShelf");
shelfButton.addEventListener('click', setUpShelf);
// Settings:
const settingsButton = document.querySelector("#navSettings");
settingsButton.addEventListener('click', setUpSettings);
//Authored:
const authoredButton = document.querySelector("#navAuthored");
authoredButton.addEventListener('click', setUpAuthorShelf);
// Following:
const followingButton = document.querySelector("#navFollowing");
followingButton.addEventListener('click', setUpFollowingList);
// notifications:
const notiListGroup = document.querySelector("#not-list-group");
const notificationButton = document.querySelector("#navNotifications");
notificationButton.addEventListener('click', setUpNotificationList);
const notClearButton = document.querySelector("#clear");
notClearButton.addEventListener("click", clearNotifications);

// handle searching in bookshelf
const searchBox = document.querySelector(".shelf-search");
searchBox.addEventListener("keyup", updateShelf)

// Handle Settings editable:
const editButton = document.querySelector("#editbutton");
editButton.addEventListener('click', changeEditable);

const confirmButton = document.querySelector("#confirmbutton");
confirmButton.addEventListener('click', confirmChanges);

const cancelButton = document.querySelector("#cancelbutton");
cancelButton.addEventListener('click', cancelChanges);

// get main content holder and carousel element
const mainContent = document.querySelector("#main-content-containter");
const carouselInner = document.querySelector(".carousel-inner");

// variables to reference what is currently selected as the main content:
let curNav = shelfButton;
let curDiv = document.querySelector("#book-shelf");

let edit = false;

// follow button:
const followButton = document.querySelector("#follow-button");
followButton.addEventListener('click', followOrUnfollow);

// book creation buttons:
const bookCancelButton = document.querySelector("#book-cancelbutton");
bookCancelButton.addEventListener('click', cancelAllBooksFields);

const submitBookButton = document.querySelector("#book-submitbutton");
submitBookButton.addEventListener('click', addNewAuthoredBook);

const newChapterButton = document.querySelector("#add-chapter");
// newChapterButton.addEventListener('click', createNewChapter);

const chapterCloseButton = document.querySelector("#chapter-close");
chapterCloseButton.addEventListener("click", clearChapterFields);

const chapterSubmitButton = document.querySelector("#chapter-submit");
chapterSubmitButton.addEventListener("click", submitNewChapter);

const newBookButton = document.querySelector("#new-book-button");


// Sets up the carousel with all the books required for My Bookshelf and Authored view
// each carousel page has a maximum of 15 books. There are a maximum of 3 rows, 
//each containing a maximum of 5 books
function setUpCarousel(bookList){
    // remove any children from before (reuqired if there have been updates to any book lists)
    while (carouselInner.firstChild) {
        carouselInner.removeChild(carouselInner.firstChild);
    }

    // create new indicator list for carousel
    const indList = document.createElement("ol");
    indList.className = "carousel-indicators";

    // iterate over the number of carousel pages required (15 books per page)
    for(let i=0; i < Math.ceil(bookList.length / 15); i++){
        //create new page and indicator:
        const newCarousel = document.createElement("DIV");
        const newCarIndicator = document.createElement("li");
        newCarIndicator.setAttribute("data-target", "#book-shelf");
        newCarIndicator.setAttribute("data-slide-to", i.toString());
        
        // set the first page as active:
        if(i==0){
            newCarousel.className = "carousel-item active";
            newCarIndicator.className = "active";
        }else{
            newCarousel.className = "carousel-item";
        }
        
        // create container for the rows:
        const newCarouselRowCont = document.createElement("DIV");
        newCarouselRowCont.className = "rows-container";
        newCarousel.appendChild(newCarouselRowCont);

        // determines how many books are going to be on the page
        const booksleftPage = Math.min(15, bookList.length - i*15);

        // create a row for each remaining rows required:
        for(let j=0; j < Math.ceil(bookList.length / 5); j++){
            const newCarouselUl = document.createElement("ul");
            newCarouselUl.className = "book-row";
            newCarouselRowCont.appendChild(newCarouselUl);
            
            // create a book for each remaining books required in current row
            for(let b=0; b<Math.min(5, booksleftPage - j*5); b++){
                // new book list container and image:
                const newLi = document.createElement("li");
                const newImg = document.createElement("img");
                const bookToAdd = bookList[(i*15 + j*5 + b)]
                newImg.src = bookToAdd.image;
                newImg.title = bookToAdd.bookTitle;
                newImg.onclick = function () {
                    location.href = "book.html";
                };

                if(profileOwner){
                    const bookDeleteButton = document.createElement("button");
                    bookDeleteButton.innerHTML = "x";
                    bookDeleteButton.className = "book-delete";
                    if(curNav===shelfButton){
                        bookDeleteButton.onclick = removeBookBookshelf;
                    }
                    else{
                        bookDeleteButton.onclick = removeWrittenBook;
                    }
                    
                    newLi.appendChild(bookDeleteButton);
                }

                if(profileOwner && curNav===authoredButton){
                    const bookEditButton = document.createElement("button");
                    bookEditButton.innerHTML = "Edit";
                    bookEditButton.className = "book-edit";
                    bookEditButton.classList.add("btn", "btn-secondary");
                    bookEditButton.setAttribute("data-toggle", "modal");
                    bookEditButton.setAttribute("data-target", ".book-modal");
                    bookEditButton.onclick = editBook;
                    newLi.appendChild(bookEditButton);
                }


                newLi.bookReference = bookToAdd;
                newLi.appendChild(newImg);
                newCarouselUl.appendChild(newLi);
                
            }
        }

        // add page and indicator to carousel:
        indList.appendChild(newCarIndicator);
        carouselInner.appendChild(indList);
        carouselInner.appendChild(newCarousel);
        
    }
}

// sets up the user page with the current user information:
function setUpUserPage(){

    // update all user information elements
    profileHeader.innerHTML = sampleUser.name;
    followers.innerHTML = sampleUser.followers;
    following.innerHTML = sampleUser.following.length;
    writtenCount.innerHTML = sampleUser.writtenBook.length;
    description.innerHTML = sampleUser.description;

    username.placeholder = sampleUser.name;
    emailaddress.placeholder = sampleUser.mailAddress;
    descriptionEditable.placeholder = sampleUser.description;
    setUpCarousel(sampleUser.bookshelf);

}
setUpUserPage();

function setUpShelf(e){
    e.preventDefault();
    changeActive(shelfButton, document.querySelector("#book-shelf"));

    // clear search bars
    searchBox.value = '';

    setUpCarousel(sampleUser.bookshelf);
    document.querySelector("#book-shelf").querySelector("h1").innerHTML = "BookShelf"
    
}

function setUpSettings(e){
    e.preventDefault();
    changeActive(settingsButton, document.querySelector("#settings"));
    
}

function removeFollowerTotal(e){
    e.preventDefault();
    const elem = e.target.parentNode;
    const name = elem.querySelector("h3").innerHTML;


    elem.parentNode.removeChild(elem);
    sampleUser.removeFollowing(name);
    following.innerHTML = sampleUser.following.length;
}

function setUpFollowingList(e){
    e.preventDefault();
    const followList = document.querySelector("#following-list");
    while (followList.firstChild) {
        followList.removeChild(followList.firstChild);
    }

    changeActive(followingButton, document.querySelector("#following"));
    for(let i=0;i<sampleUser.following.length;i++){
        const newFollowCont = document.createElement("li");
        newFollowCont.className = "following-container";

        const followingImg = document.createElement("img");
        followingImg.src = sampleUser.following[i].image;
        newFollowCont.appendChild(followingImg);
        followingImg.onclick = function () {
            location.href = "profile.html";
        };

        const followingInfo = document.createElement("div");
        followingInfo.className = "following-info";
        newFollowCont.appendChild(followingInfo);

        const followingName = document.createElement("h3");
        followingName.innerHTML = sampleUser.following[i].name;
        followingInfo.appendChild(followingName);
        followingName.onclick = function () {
            location.href = "profile.html";
        };

        const followingWritten = document.createElement("h4");
        followingWritten.innerHTML = "Books Written: "

        const followingWrittenCount = document.createElement("span");
        followingWrittenCount.innerHTML = sampleUser.following[i].writtenBook.length;
        followingWritten.appendChild(followingWrittenCount);

        followingInfo.appendChild(followingWritten);

        const unFollowButton = document.createElement("button");
        unFollowButton.className = "btn btn-danger";
        unFollowButton.innerHTML = "Unfollow";
        unFollowButton.onclick = removeFollowerTotal;

        newFollowCont.appendChild(unFollowButton);
        followList.appendChild(newFollowCont);
    }
}





function updateShelf(e){
    e.preventDefault();
    let newList = sampleUser.bookshelf;
    if(curNav == authoredButton){
        newList = sampleUser.writtenBook;
    }

    if(searchBox.value === ''){
        setUpCarousel(newList)
        return
    }
    setUpCarousel(fuzzyBookSearch(searchBox.value, newList));
}



function changeActive(elem, newDiv){
    curNav.classList.remove("active");
    elem.classList.add("active");
    curNav = elem;

    curDiv.classList.remove("active");
    curDiv.classList.add("fade")
    newDiv.classList.remove("fade");
    newDiv.classList.add("active");
    curDiv = newDiv;
}

function setUpAuthorShelf(e){
    e.preventDefault();
    changeActive(authoredButton, document.querySelector("#book-shelf"));

    searchBox.value = '';
    setUpCarousel(sampleUser.writtenBook);
    document.querySelector("#book-shelf").querySelector("h1").innerHTML = "Authored Books"
}

function setUpNotificationList(e){
    e.preventDefault();

    while(notiListGroup.firstChild){
        notiListGroup.removeChild(notiListGroup.firstChild);
    }    
    changeActive(notificationButton, document.querySelector("#notifications"));
    for(let i=0;i<sampleUser.newMessages.length; i++){
        const bookNot = sampleUser.newMessages[i];
        const notificationElement = document.createElement("li");
        notificationElement.className = "list-group-item";
        const notText = document.createTextNode("New Chapter for " + bookNot.bookTitle + " by " + bookNot.author.name);
        notificationElement.appendChild(notText);
        notificationElement.bookReference = bookNot;
        notificationElement.onclick = function () {
            location.href = "book.html";
        };

        notiListGroup.appendChild(notificationElement);
    }

    for(let i=0;i<sampleUser.oldMessages.length; i++){
        const bookNot = sampleUser.newMessages[i];
        const notificationElement = document.createElement("li");
        notificationElement.className = "list-group-item";
        const notText = document.createTextNode("New Chapter for " + bookNot.bookTitle + " by " + bookNot.author.name);
        notificationElement.appendChild(notText);
        notificationElement.bookReference = bookNot;
        notificationElement.onclick = function () {
            location.href = "book.html";
        };

        notiListGroup.appendChild(notificationElement);
    }
    
}


function changeEditable(e){
    e.preventDefault();
    cancelButton.style.display = "inline";

    confirmButton.disabled = false;
    confirmButton.className = "btn btn-success";

    emailaddress.value = sampleUser.mailAddress;
    emailaddress.readOnly = false;

    username.value = sampleUser.name;
    username.readOnly = false;

    pass.value = sampleUser.password;
    pass.readOnly = false;

    descriptionEditable.value = sampleUser.description;
    descriptionEditable.readOnly = false;
}

function confirmChanges(e){
    e.preventDefault();
    // update User values
    sampleUser.mailAddress = emailaddress.value;
    sampleUser.name = username.value;
    sampleUser.password = pass.value;
    sampleUser.description = descriptionEditable.value;

    // reset buttons
    confirmButton.disabled= true;
    confirmButton.className = "btn btn-secondary";
    cancelButton.style.display = "none";

    //update profile html elements
    profileHeader.innerHTML = sampleUser.name;
    username.innerHTML = sampleUser.name;
    description.innerHTML = sampleUser.description;

    // update editable fields
    username.readOnly = true;
    username.placeholder = sampleUser.name;
    emailaddress.readOnly = true;
    emailaddress.placeholder = sampleUser.mailAddress;
    descriptionEditable.readOnly = true;
    descriptionEditable.placeholder = sampleUser.description;
    ppass.readOnly = true;
}

function cancelChanges(e){
    e.preventDefault();

    username.readOnly = true;
    username.value = '';
    username.placeholder = sampleUser.name;
    emailaddress.readOnly = true;
    emailaddress.placeholder = sampleUser.mailAddress;
    emailaddress.value = '';
    descriptionEditable.readOnly = true;
    descriptionEditable.value = '';
    descriptionEditable.placeholder = sampleUser.description;
    pass.readOnly = true;
    pass.value = '';

    confirmButton.disabled= true;
    confirmButton.className = "btn btn-secondary";
    cancelButton.style.display = "none";


}

function removeBookBookshelf(e){
    e.preventDefault();
    const bookToRemove = e.target.parentNode.bookReference;
    sampleUser.removeBookfromBookshelf(bookToRemove);
    e.target.parentNode.removeChild(e.target);
    setUpCarousel(sampleUser.bookshelf);
}

function removeWrittenBook(e){
    e.preventDefault();
    const bookToRemove = e.target.parentNode.bookReference;
    sampleUser.removeBookfromWritten(bookToRemove);
    deleteBookForAllUsers(bookToRemove);
    e.target.parentNode.removeChild(e.target);
    setUpCarousel(sampleUser.writtenBook);
}

function changeAuthentification(e){
    e.preventDefault();
    profileOwner = !profileOwner;

    if(profileOwner){
        followButton.style.display = "none";
        followingButton.style.display = "block";
        settingsButton.style.display = "block";
        notificationButton.style.display = "block";
        newBookButton.style.display = "block";
    
    }
    else{
        followButton.style.display = "inline-block";
        followingButton.style.display = "none";
        settingsButton.style.display = "none";
        notificationButton.style.display = "none";
        newBookButton.style.display = "none";

        if(viewingUser.isFollowing(sampleUser.name)){
            followButton.classList.add("btn-danger"); 
            followButton.classList.remove("btn-success"); 
            followButton.innerHTML = "UnFollow";
        }
        else{
            followButton.classList.add("btn-success"); 
            followButton.classList.remove("btn-danger"); 
            followButton.innerHTML = "Follow";
        }
    }

    curNav.click();
}

function cancelAllBooksFields(e){
    newBookDescriptionForm.value = '';
    newBookTitleForm.value = '';
    newBookGenreForm.value = '';
    newBookImgForm.value = '';

    chapterListDiv.style.display = "none";
}

function clearChapterFields(e){
    chapterNumField.value = '';
    chapterNameField.value = '';
    chapterContentField.value = '';
}

function addNewAuthoredBook(e){
    const d = new Date();
    const newBook = new Book(newBookTitleForm.value, sampleUser, d.getDate(), "img/TimeRaiders.jpg", newBookGenreForm.value);
    newBook.setDescription(newBookDescriptionForm.value);
    sampleUser.writtenBook.push(newBook);

    if(curNav===authoredButton){
        setUpCarousel(sampleUser.writtenBook);
    }
    writtenCount.innerHTML = sampleUser.writtenBook.length;
    cancelAllBooksFields(e);
}

function updateChapList(){
    while(chapterListGroup.firstChild){
        chapterListGroup.removeChild(chapterListGroup.firstChild);
    }
    for(let i=0; i<bookModal.bookReference.chapters.length;i++){
        const currentChapter = bookModal.bookReference.chapters[i];
        const chapterElement = document.createElement("li");
        chapterElement.className = "list-group-item";
        const chapText = document.createTextNode("Chapter " + currentChapter.num + ": " + currentChapter.chapterName);
        chapterElement.appendChild(chapText);
        chapterElement.chapReference = currentChapter;
        
        const chapDeleteButton = document.createElement("button");
        chapDeleteButton.className = "chapter-edit-button";
        chapDeleteButton.classList.add("btn", "btn-danger");
        chapDeleteButton.innerHTML = "Delete";
        chapDeleteButton.addEventListener('click', deleteBookChapter);

        const chapEditButton = document.createElement("button");
        chapEditButton.className = "chapter-edit-button";
        chapEditButton.classList.add("btn", "btn-secondary");
        chapEditButton.innerHTML = "Edit";
        chapEditButton.setAttribute("data-toggle", "modal");
        chapEditButton.setAttribute("data-target", "#chapter-modal");
        chapEditButton.addEventListener("click", setEdit);

        chapterElement.appendChild(chapDeleteButton);
        chapterElement.appendChild(chapEditButton);
        chapterListGroup.appendChild(chapterElement);
    }
}

function editBook(e){
    e.preventDefault();
    

    // NEED TO CHANGE BUTTON FUNCTION

    bookModal.bookReference = e.target.parentNode.bookReference;

    newBookDescriptionForm.value = bookModal.bookReference.description;
    newBookTitleForm.value = bookModal.bookReference.bookTitle;
    newBookGenreForm.value = bookModal.bookReference.genre;
    newBookImgForm.value = '';

    updateChapList();
    chapterListDiv.style.display = 'block';

    submitBookButton.removeEventListener('click', addNewAuthoredBook);
    submitBookButton.addEventListener('click', updateBook);

    

}

function submitNewChapter(e){
    if(edit===true){
        chapterModal.chapReference.num = parseInt(chapterNumField.value, 10);
        chapterModal.chapReference.chapterName = chapterNameField.value;
        chapterModal.chapReference.setContent(chapterContentField.value);
    }
    else{
        const newChap = new Chapter(parseInt(chapterNumField.value, 10), chapterNameField.value);
        newChap.setContent(chapterContentField.value);

        bookModal.bookReference.addChapter(newChap);
    }
    edit = false;
    clearChapterFields(e);
    updateChapList();
}

function updateBook(e){

    bookModal.bookReference.description = newBookDescriptionForm.value;
    bookModal.bookReference.bookTitle = newBookTitleForm.value;
    bookModal.bookReference.genre = newBookGenreForm.value;

    submitBookButton.removeEventListener('click', updateBook);
    submitBookButton.addEventListener('click', addNewAuthoredBook);
    cancelAllBooksFields(e);
}

function deleteBookChapter(e){
    e.preventDefault();
    const chapToDelete = e.target.parentNode.chapReference;
    bookModal.bookReference.deleteChapter(chapToDelete.num);
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
}

function setEdit(e){
    edit = true;
    chapterModal.chapReference = e.target.parentNode.chapReference;
}

function followOrUnfollow(e){
    e.preventDefault();
    if(followButton.innerHTML === "Follow"){
        viewingUser.following.push(sampleUser);
        followButton.classList.add("btn-danger"); 
        followButton.classList.remove("btn-success"); 
        followButton.innerHTML = "UnFollow";
        sampleUser.followers += 1;
    }
    else{
        viewingUser.removeFollowing(sampleUser.name);
        followButton.classList.add("btn-success"); 
        followButton.classList.remove("btn-danger"); 
        followButton.innerHTML = "Follow";
        sampleUser.followers -= 1;
    }
    followers.innerHTML = sampleUser.followers;
}
function clearNotifications(e){
    e.preventDefault();
    while(notiListGroup.firstChild){
        notiListGroup.removeChild(notiListGroup.firstChild);
    }
    sampleUser.newMessages=[];
    sampleUser.oldMessages = [];
}