'use strict';
const log = console.log;
const currentLocation = window.location.href;
const url = "/db"+new URL(currentLocation).pathname;
async function getUser() {
    return fetch(url).then((res) => {
        if(res.status !== 200){
            alert("Error finding User");
            return
        }
        return res.json()
    }).then((userJson) => {
            return userJson;
        }).catch(error => log(error));
}


let profileUser;


// **NOTE**: for this page we use profileUser as the user that this profile represents.
//          Sample user is stored in classes.js and realistically a server call would be
//          needed to load the user data initially for use by this page.

// variable to keep track if the viewer is the owner of the profile
// this would require a server call to check if the current logged in user is the owner or not
// profileOwner will be true all the time for admins
let profileOwner = true;
// create a user that is to be used for example purposes as if they are not the owner of the profile
const viewingUser = userCreator("sampleViewer", "sv@domain.com", "123", false);

// button that changes the viewers authentification for testing purposes
const changeAuthButton = document.querySelector("#change-auth");
changeAuthButton.addEventListener('click', changeAuthentification);

// SETTINGS:
// Settings form elements:
const emailaddress = document.querySelector("#emailaddress");
const username = document.querySelector("#username");
const pass = document.querySelector("#password");
const descriptionEditable = document.querySelector("#description");

// Settings Buttons:
// edit
const editButton = document.querySelector("#editbutton");
editButton.addEventListener('click', changeEditable);
// confirm
const confirmButton = document.querySelector("#confirmbutton");
confirmButton.addEventListener('click', confirmChanges);
// cancel
const cancelButton = document.querySelector("#cancelbutton");
cancelButton.addEventListener('click', cancelChanges);

// PROFILE:
// profile info elements
const profileHeader = document.querySelector(".profileheader");
const followers = document.querySelector("#followerCount");
const following = document.querySelector("#followingCount");
const writtenCount = document.querySelector("#writenCount");
const description = document.querySelector(".profiletextcontainer > p");

// BOOK CREATION:
// book creation fields:
const newBookTitleForm = document.querySelector("#book-title");
const newBookGenreForm = document.querySelector("#book-genre");
const newBookDescriptionForm = document.querySelector("#book-description");
const newBookImgForm = document.querySelector("#book-image-upload");
const chapterListDiv = document.querySelector("#chapter-list");
const bookModal = document.querySelector(".book-modal");
const chapterModal = document.querySelector("#chapter-modal");

const newBookButton = document.querySelector("#new-book-button");
const coverUpload = document.querySelector("#uploadCover");

// book creation buttons:
const bookCancelButton = document.querySelector("#book-cancelbutton");
bookCancelButton.addEventListener('click', cancelAllBooksFields);

const submitBookButton = document.querySelector("#book-submitbutton");
submitBookButton.addEventListener('click', addNewAuthoredBook);

// CHAPTER CREATION:
// chapter creation fields
// const chapterNumField = document.querySelector("#chapter-num");
const chapterNameField = document.querySelector("#chapter-name");
const chapterContentField = document.querySelector("#chapter-content");
const chapterListGroup = document.querySelector("#chap-list-group");

// Chapter Buttons:
const newChapterButton = document.querySelector("#add-chapter");

const chapterCloseButton = document.querySelector("#chapter-close");
chapterCloseButton.addEventListener("click", clearChapterFields);

const chapterSubmitButton = document.querySelector("#chapter-submit");
chapterSubmitButton.addEventListener("click", submitNewChapter);


// Notification info elements
const notiListGroup = document.querySelector("#not-list-group");
const notClearButton = document.querySelector("#clear");
notClearButton.addEventListener("click", clearNotifications);

// Navigation bar selectors and create click events:
//Bookshelf Selector
const shelfButton = document.querySelector("#navShelf");
shelfButton.addEventListener('click', setUpShelf);
// Settings Selector
const settingsButton = document.querySelector("#navSettings");
settingsButton.addEventListener('click', setUpSettings);
//Authored Selector
const authoredButton = document.querySelector("#navAuthored");
authoredButton.addEventListener('click', setUpAuthorShelf);
// Following Selector
const followingButton = document.querySelector("#navFollowing");
followingButton.addEventListener('click', setUpFollowingList);
// Notifications Selector
const notificationButton = document.querySelector("#navNotifications");
notificationButton.addEventListener('click', setUpNotificationList);


// Search Bar
const searchBox = document.querySelector(".shelf-search");
searchBox.addEventListener("keyup", updateShelf);

// Follow button:
const followButton = document.querySelector("#follow-button");
followButton.addEventListener('click', followOrUnfollow);

// Main content holder and Carousel element
const mainContent = document.querySelector("#main-content-containter");
const carouselInner = document.querySelector(".carousel-inner");


// variables to reference what is currently selected as the main content:
let curNav = shelfButton;
let curDiv = document.querySelector("#book-shelf");

// variable to tell if the modal is in edit or create mode
let edit = false;


// MAIN CONTENT SETUP FUNCTIONS:

/** Sets up the carousel with all the books required for My Bookshelf and Authored view.
 *  Each carousel page has a maximum of 15 books. There are a maximum of 3 rows per page,
 * each containing a maximum of 5 books.*/
function setUpCarousel(bookList) {
    // remove any children from before (reuqired if there have been updates to any book lists)
    while (carouselInner.firstChild) {
        carouselInner.removeChild(carouselInner.firstChild);
    }

    // create new indicator list for carousel
    const indList = document.createElement("ol");
    indList.className = "carousel-indicators";

    // iterate over the number of carousel pages required (15 books per page)
    for (let i = 0; i < Math.ceil(bookList.length / 15); i++) {
        //create new page and indicator:
        const newCarousel = document.createElement("DIV");
        const newCarIndicator = document.createElement("li");
        newCarIndicator.setAttribute("data-target", "#book-shelf");
        newCarIndicator.setAttribute("data-slide-to", i.toString());

        // set the first page as active:
        if (i === 0) {
            newCarousel.className = "carousel-item active";
            newCarIndicator.className = "active";
        } else {
            newCarousel.className = "carousel-item";
        }

        // create container for the rows:
        const newCarouselRowCont = document.createElement("DIV");
        newCarouselRowCont.className = "rows-container";
        newCarousel.appendChild(newCarouselRowCont);

        // determines how many books are going to be on the page
        const booksleftPage = Math.min(15, bookList.length - i * 15);

        // create a row for each remaining rows required:
        // requires server call for book list
        for (let j = 0; j < Math.ceil(bookList.length / 5); j++) {
            const newCarouselUl = document.createElement("ul");
            newCarouselUl.className = "book-row";
            newCarouselRowCont.appendChild(newCarouselUl);

            // create a book for each remaining books required in current row
            for (let b = 0; b < Math.min(5, booksleftPage - j * 5); b++) {
                // new book list container and image:
                const newLi = document.createElement("li");
                const newImg = document.createElement("img");

                const bookToAdd = bookList[(i * 15 + j * 5 + b)];
                newImg.src = bookToAdd.image;
                newImg.title = bookToAdd.bookTitle;
                newImg.onclick = function () {
                    location.href = "/books/" + String(bookToAdd.id);
                };

                // check if the "viewer" is the profile owner.
                if (profileOwner) {
                    // if so allow add delete buttons
                    const bookDeleteButton = document.createElement("button");
                    bookDeleteButton.innerHTML = "x";
                    bookDeleteButton.className = "book-delete";
                    if (curNav === shelfButton) {
                        bookDeleteButton.onclick = removeBookBookshelf;
                    } else {
                        bookDeleteButton.onclick = removeWrittenBook;
                    }
                    newLi.appendChild(bookDeleteButton);
                }

                // if authored view add edit buttons:
                if (profileOwner && curNav === authoredButton) {
                    const bookEditButton = document.createElement("button");
                    bookEditButton.innerHTML = "Edit";
                    bookEditButton.className = "book-edit";
                    bookEditButton.classList.add("btn", "btn-secondary");
                    bookEditButton.setAttribute("data-toggle", "modal");
                    bookEditButton.setAttribute("data-target", ".book-modal");
                    bookEditButton.onclick = editBook;
                    newLi.appendChild(bookEditButton);
                }

                // add elements to page
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

/** Sets up the user page with the current user information:
 * called immediately on startup.
 */
function setUpUserPage() {
    // update all user information elements
    profileHeader.innerHTML = profileUser.name;
    followers.innerHTML = profileUser.followers;
    following.innerHTML = profileUser.following.length;
    writtenCount.innerHTML = profileUser.writtenBook.length;
    description.innerHTML = profileUser.description;
    // update placeholders for settings
    username.placeholder = profileUser.name;
    emailaddress.placeholder = profileUser.email;
    descriptionEditable.placeholder = profileUser.description;
    // set up bookshelf as main content
    setUpCarousel(profileUser.bookshelf);

}















(function(){
    getUser(url).then(res =>{
        profileUser = res;
        // profileOwner = getCookie("id") === res.id;
        log(res);
        setUpUserPage();
        setUpPic();
        setUpCoverForm();
    })

})();



















// setUpUserPage();

/** Called when Bookshelf is selected in that nav menu.
 * Changes nav element styling and sets up bookshelf for main content
 */
function setUpShelf(e) {
    e.preventDefault();
    changeActive(shelfButton, document.querySelector("#book-shelf"));

    // clear search bars
    searchBox.value = '';

    setUpCarousel(profileUser.bookshelf);
    document.querySelector("#book-shelf").querySelector("h1").innerHTML = "BookShelf";
}

/** Called when Settings is seleted in that nav menu.
 * Changes nav element styling and sets up Settings for main content */
function setUpSettings(e) {
    e.preventDefault();
    changeActive(settingsButton, document.querySelector("#settings"));
}

/** Helper function to adjust html elements for when a viewer unfollows a user  */
function removeFollowerTotal(e) {
    e.preventDefault();
    const elem = e.target.parentNode;
    // const name = elem.querySelector("h3").innerHTML;

    const fid = elem.dataset.followId;

    elem.parentNode.removeChild(elem);

    const patchUrl = url + "/" + fid.toString();
    
    fetch(patchUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH'                                       
      }).then((res) => {
        if(res.status !== 200){
            alert("Error removing follow");
            return
        }
        return res.json()
    }).then((userJson) => {
            return userJson;
        }).then(res => {
            if(res.resolved){
                for (let j = 0; j < profileUser.following.length; j++) {
                    if (profileUser.following[j].id === fid) {
                        profileUser.following.splice(j, 1);
                        break;
                    }
                }
                following.innerHTML = profileUser.following.length;
            }
            
        }).catch(error => log(error));

    // profileUser.removeFollowing(name);
    // following.innerHTML = profileUser.following.length;
}

/** Called when Following is selected in that nav menu.
 * Changes nav element styling and sets up Following for main content */
function setUpFollowingList(e) {
    e.preventDefault();

    //remove any existing list
    const followList = document.querySelector("#following-list");
    while (followList.firstChild) {
        followList.removeChild(followList.firstChild);
    }

    // switch main content to Following content
    changeActive(followingButton, document.querySelector("#following"));

    // create a list element for each follower of profileUser and add it to the list
    for (let i = 0; i < profileUser.following.length; i++) {
        const newFollowCont = document.createElement("li");
        newFollowCont.className = "following-container";
        newFollowCont.dataset.followId = profileUser.following[i].id;

        const followingImg = document.createElement("img");
        followingImg.src = profileUser.following[i].image;
        followingImg.onclick = function () {
            location.href = "/profile/" + String(profileUser.following[i].id);
        };

        const followingInfo = document.createElement("div");
        followingInfo.className = "following-info";
        

        const followingName = document.createElement("h3");
        followingName.innerHTML = profileUser.following[i].name;
        followingName.onclick = function () {
            location.href = "/profile/" + String(profileUser.following[i].id);
        };

        followingInfo.appendChild(followingName);

        const followingWritten = document.createElement("h4");
        followingWritten.innerHTML = "Books Written: ";

        const followingWrittenCount = document.createElement("span");
        followingWrittenCount.innerHTML = profileUser.following[i].writtenCount;

        const unFollowButton = document.createElement("button");
        unFollowButton.className = "btn btn-danger";
        unFollowButton.innerHTML = "Unfollow";
        unFollowButton.onclick = removeFollowerTotal;

        followingWritten.appendChild(followingWrittenCount);
        followingInfo.appendChild(followingWritten);

        newFollowCont.appendChild(followingImg);
        newFollowCont.appendChild(followingInfo);
        newFollowCont.appendChild(unFollowButton);
        followList.appendChild(newFollowCont);
    }
}

/** Called when Authored is selected in that nav menu.
 * Changes nav element styling and sets up Authored for main content */
function setUpAuthorShelf(e) {
    e.preventDefault();
    changeActive(authoredButton, document.querySelector("#book-shelf"));

    searchBox.value = '';
    setUpCarousel(profileUser.writtenBook);
    document.querySelector("#book-shelf").querySelector("h1").innerHTML = "Authored Books";
}

/** Called when Notification is selected in that nav menu.
 * Changes nav element styling and sets up Notification for main content */
function setUpNotificationList(e) {
    e.preventDefault();

    while (notiListGroup.firstChild) {
        notiListGroup.removeChild(notiListGroup.firstChild);
    }
    changeActive(notificationButton, document.querySelector("#notifications"));
    for (let i = 0; i < profileUser.newMessages.length; i++) {
        const bookNot = profileUser.newMessages[i];
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

    for (let i = 0; i < profileUser.oldMessages.length; i++) {
        const bookNot = profileUser.newMessages[i];
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

/** Update the shelf after a search is queried. Verifies if shelf is authored shelf or a bookshelf */
function updateShelf(e) {
    e.preventDefault();
    let newList = profileUser.bookshelf;
    if (curNav == authoredButton) {
        newList = profileUser.writtenBook;
    }
    if (searchBox.value === '') {
        setUpCarousel(newList);
        return;
    }
    setUpCarousel(fuzzyBookSearch(searchBox.value, newList));
}

/** Changes the active main content element*/
function changeActive(elem, newDiv) {
    curNav.classList.remove("active");
    elem.classList.add("active");
    curNav = elem;

    curDiv.classList.remove("active");
    curDiv.classList.add("fade");
    newDiv.classList.remove("fade");
    newDiv.classList.add("active");
    curDiv = newDiv;
}

/** Changes the Settings forms to allow editing of the user's info */
function changeEditable(e) {
    e.preventDefault();
    cancelButton.style.display = "inline";

    confirmButton.disabled = false;
    confirmButton.className = "btn btn-success";

    emailaddress.value = profileUser.email;
    emailaddress.readOnly = false;

    username.value = profileUser.name;
    username.readOnly = false;

    // pass.value = profileUser.password;
    pass.value = '';
    pass.readOnly = false;

    descriptionEditable.value = profileUser.description;
    descriptionEditable.readOnly = false;
}

/** Confirms the edit changes in the Settings */
function confirmChanges(e) {
    e.preventDefault();
    // update User values
    // requires server call to update user data

    const patchUrl = url;
    
    fetch(patchUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            name: username.value,
            email: emailaddress.value,
            password: pass.value,
            description: descriptionEditable.value
        })
      }).then((res) => {
        if(res.status !== 200){
            alert("Error updating user info");
            return
        }
        return res.json()
    }).then((userJson) => {
            return userJson;
        }).then(res => {
            if(res.resolved){
                profileUser.email = emailaddress.value;
                profileUser.name = username.value;
                profileUser.password = pass.value;
                profileUser.description = descriptionEditable.value;
            }
            
        }).catch(error => log(error));

    
    

    // reset buttons
    confirmButton.disabled = true;
    confirmButton.className = "btn btn-secondary";
    cancelButton.style.display = "none";

    //update profile html elements
    profileHeader.innerHTML = profileUser.name;
    username.innerHTML = profileUser.name;
    description.innerHTML = profileUser.description;

    // update editable fields
    username.readOnly = true;
    username.placeholder = profileUser.name;
    emailaddress.readOnly = true;
    emailaddress.placeholder = profileUser.email;
    descriptionEditable.readOnly = true;
    descriptionEditable.placeholder = profileUser.description;
    pass.readOnly = true;
}

/** Cancels any changes that were made while editing settings and resets the forms */
function cancelChanges(e) {
    e.preventDefault();

    username.readOnly = true;
    username.value = '';
    username.placeholder = profileUser.name;
    emailaddress.readOnly = true;
    emailaddress.placeholder = profileUser.email;
    emailaddress.value = '';
    descriptionEditable.readOnly = true;
    descriptionEditable.value = '';
    descriptionEditable.placeholder = profileUser.description;
    pass.readOnly = true;
    pass.value = '';

    confirmButton.disabled = true;
    confirmButton.className = "btn btn-secondary";
    cancelButton.style.display = "none";
}

/** Removes an html book element from the Bookshelf as well as makes a call to remove it from the user*/
function removeBookBookshelf(e) {
    e.preventDefault();
    const bookToRemove = e.target.parentNode.bookReference;
    //remove the book from user (reuqires server call)
    const bookid = bookToRemove.id;

    const patchUrl = url + "/bookshelf/" + bookid.toString();
    
    fetch(patchUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH'                                       
      }).then((res) => {
        if(res.status !== 200){
            alert("Error removing follow");
            return
        }
        return res.json()
    }).then((userJson) => {
            return userJson;
        }).then(res => {
            if(res.resolved){
                for (let j = 0; j < profileUser.bookshelf.length; j++) {
                    if (profileUser.bookshelf[j].id === bookid) {
                        profileUser.bookshelf.splice(j, 1);
                        break;
                    }
                }
                e.target.parentNode.removeChild(e.target);
                setUpCarousel(profileUser.bookshelf);
            }
            
        }).catch(error => log(error));


    // profileUser.removeBookFromBookshelf(bookToRemove);
    
}

/** Removes an html book element from the Authored Shelf as well as makes a call to remove it from the user
 * Requires server call.
 */
function removeWrittenBook(e) {
    e.preventDefault();
    const bookToRemove = e.target.parentNode.bookReference;
    //remove the book from user (reuqires server call)
    const bookid = bookToRemove.id;

    const deleteUrl = url + "/written/" + bookid.toString();

    fetch(deleteUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'                                       
      }).then((res) => {
        if(res.status !== 200){
            alert("Error removing follow");
            return
        }
        return res.json()
    }).then((userJson) => {
            return userJson;
        }).then(res => {
            if(res.resolved){
                for (let j = 0; j < profileUser.writtenBook.length; j++) {
                    if (profileUser.writtenBook[j].id === bookid) {
                        profileUser.bookshelf.splice(j, 1);
                        break;
                    }
                }

                writtenCount.innerHTML = profileUser.writtenBook.length;
                e.target.parentNode.removeChild(e.target);
                setUpCarousel(profileUser.writtenBook);
            }
            
        }).catch(error => log(error));

    // profileUser.removeBookFromWritten(bookToRemove);
    // deleteBookForAllUsers(bookToRemove);
}

/** Changes the view of the page from owner to non-owner.
 * For demonstration purposes.
 */
function changeAuthentification(e) {
    e.preventDefault();
    // switch owner value
    profileOwner = !profileOwner;

    if (profileOwner) {
        // reveal everything except follow button
        followButton.style.display = "none";
        followingButton.style.display = "block";
        settingsButton.style.display = "block";
        notificationButton.style.display = "block";
        newBookButton.style.display = "block";

    } else {
        //Viewer is not owner:
        // hide everything except follow button
        followButton.style.display = "inline-block";
        followingButton.style.display = "none";
        settingsButton.style.display = "none";
        notificationButton.style.display = "none";
        newBookButton.style.display = "none";

        // set up the follow button based on if they are following the user already or not
        if (viewingUser.isFollowing(profileUser.name)) {
            followButton.classList.add("btn-danger");
            followButton.classList.remove("btn-success");
            followButton.innerHTML = "UnFollow";
        } else {
            followButton.classList.add("btn-success");
            followButton.classList.remove("btn-danger");
            followButton.innerHTML = "Follow";
        }
    }
    curNav.click();
}

/** Cancel any edits made to a book creations form */
function cancelAllBooksFields(e) {
    newBookDescriptionForm.value = '';
    newBookTitleForm.value = '';
    newBookGenreForm.value = '';

    chapterListDiv.style.display = "none";
}

/** Clear fields of chapter creation/edit form */
function clearChapterFields(e) {
    // chapterNumField.value = '';
    chapterNameField.value = '';
    chapterContentField.value = '';
}

/** Create a new Book based off the form elements. Add the book the the user's authored list */
function addNewAuthoredBook(e) {
    const d = new Date();
    //requires server call to add new book
    const posturl = url + "/createbook";

    const bookTitle = newBookTitleForm.value;
    const genre = newBookGenreForm.value;
    const description = newBookDescriptionForm.value;

    fetch(posturl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            bookTitle: bookTitle,
            genre: genre,
            description: description
        })                                   
      }).then((res) => {
        if(res.status !== 200){
            alert("Error adding book");
            return
        }
        return res.json()
    }).then((bookJson) => {
            return bookJson;
        }).then(res => {
            if(res){
                profileUser.writtenBook.push(res);
                //update html if main content is authored
                if (curNav === authoredButton) {
                    setUpCarousel(profileUser.writtenBook);
                }
                //update html profile stat
                writtenCount.innerHTML = profileUser.writtenBook.length;
            }
            
        }).catch(error => log(error));
    


    // const newBook = new Book(newBookTitleForm.value, profileUser, d.getDate(), "img/TimeRaiders.jpg", newBookGenreForm.value);
    // newBook.setDescription(newBookDescriptionForm.value);
    // profileUser.writtenBook.push(newBook);

    
    cancelAllBooksFields(e);
}

/** Function to add the chapters to the book modal for the current book being edited. */
function updateChapList() {
    // clear current list if any
    while (chapterListGroup.firstChild) {
        chapterListGroup.removeChild(chapterListGroup.firstChild);
    }

    // add a chapter list element for each chapter of the current book
    for (let i = 0; i < bookModal.bookReference.chapters.length; i++) {
        const currentChapter = bookModal.bookReference.chapters[i];
        const chapterElement = document.createElement("li");
        chapterElement.className = "list-group-item";
        const chapText = document.createTextNode("Chapter " + (i+1).toString() + ": " + currentChapter.chapterTitle);
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

/** Called when want to edit a book that user has created */
function editBook(e) {
    e.preventDefault();

    // fill in fields with current book data
    bookModal.bookReference = e.target.parentNode.bookReference;
    newBookDescriptionForm.value = bookModal.bookReference.description;
    newBookTitleForm.value = bookModal.bookReference.bookTitle;
    newBookGenreForm.value = bookModal.bookReference.genre;
    newBookImgForm.value = '';

    // update html elements
    updateChapList();
    chapterListDiv.style.display = 'block';
    // change the submit button to do updates instead of create new books
    submitBookButton.removeEventListener('click', addNewAuthoredBook);
    submitBookButton.addEventListener('click', updateBook);
}

/** Create a new chapter for the book that is being edited currently */
function submitNewChapter(e) {
    // if in editing mode change the current chapter
    log(bookModal.bookReference)
    const bookId = bookModal.bookReference.id;

    const chapterTitle = chapterNameField.value;
    const content = chapterContentField.value;
    if (edit === true) {
        // chapterModal.chapReference.num = parseInt(chapterNumField.value, 10);

        const chapterId = chapterModal.chapReference._id;
        
        const patchUrl = url + "/chapter/" + bookId.toString() + "/" + chapterId.toString();

        fetch(patchUrl, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({
                chapterTitle: chapterTitle,
                content: content
            })
          }).then((res) => {
            if(res.status !== 200){
                alert("Error updating chapter info");
                return
            }
            return res.json()
        }).then((userJson) => {
                return userJson;
            }).then(res => {
                if(res.resolved){
                    // update chapter list by replacing chapter with new chapter
                    for (let j = 0; j < bookModal.bookReference.chapters.length; j++) {
                        if (bookModal.bookReference.chapters[j]._id === chapterId) {
                            bookModal.bookReference.chapters[j].chapterTitle = chapterTitle;
                            bookModal.bookReference.chapters[j].content = content;
                            break;
                        }
                    }
                    clearChapterFields(e);
                    updateChapList();
                }
                
            }).catch((error) => {
                log(error)
            });


        // chapterModal.chapReference.chapterTitle = chapterNameField.value;
        // chapterModal.chapReference.setContent(chapterContentField.value);
    }
    //if not in editing mode create and add a new chapter to the book
    // requires a server call
    else {
        // const newChap = new Chapter(parseInt(chapterNumField.value, 10), chapterNameField.value);
        // newChap.setContent(chapterContentField.value);

        const postUrl = url + "/booksChapter/" + bookId.toString();

        log(postUrl)

        fetch(postUrl, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                chapterTitle: chapterTitle,
                content: content
            })
          }).then((res) => {
            if(res.status !== 200){
                alert("Error creating chapter");
                return
            }
            return res.json()
        }).then((userJson) => {
                return userJson;
            }).then(res => {
                if(res){
                    console.log(res)
                    bookModal.bookReference.chapters.push(res);
                    clearChapterFields(e);
                    updateChapList();
                }
                
            }).catch(error => log(error));

        // bookModal.bookReference.addChapter(newChap);
    }
    // update html
    edit = false;
    
}

/** Called when wanting to submit book edits*/
function updateBook(e) {
    //update book data (requires server call)

    const bookId = bookModal.bookReference.id;

    const description = newBookDescriptionForm.value;
    const bookTitle = newBookTitleForm.value;
    const genre = newBookGenreForm.value;
        
    const patchUrl = url + "/book/" + bookId.toString();

    fetch(patchUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            bookTitle: bookTitle,
            genre: genre,
            description: description
        })
      }).then((res) => {
        if(res.status !== 200){
            alert("Error updating user info");
            return
        }
        return res.json()
    }).then((userJson) => {
            return userJson;
        }).then(res => {
            if(res.resolved){
                bookModal.bookReference.description = description;
                bookModal.bookReference.bookTitle = bookTitle;
                bookModal.bookReference.genre = genre;
            }
        }).catch((error) => {
            log(error)
        });


    // restore submit button functionality to "create new book"
    submitBookButton.removeEventListener('click', updateBook);
    submitBookButton.addEventListener('click', addNewAuthoredBook);
    cancelAllBooksFields(e);
}

/** Remove a book chapter from html and book's chapter list
 * Requires a server call to update book.
 */
function deleteBookChapter(e) {
    e.preventDefault();
    const chapToDelete = e.target.parentNode.chapReference
    const bookId = bookModal.bookReference.id;
    const chapterId = chapToDelete._id;

    const deleteUrl = url + "/chapter/" + bookId.toString() + "/" + chapterId.toString();

    fetch(deleteUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      }).then((res) => {
        if(res.status !== 200){
            alert("Error updating user info");
            return
        }
        return res.json()
    }).then((userJson) => {
            return userJson;
        }).then(res => {
            if(res.resolved){
                for (let j = 0; j < bookModal.bookReference.chapters.length; j++) {
                    if (bookModal.bookReference.chapters[j]._id === chapterId) {
                        bookModal.bookReference.chapters.splice(j, 1);
                        break;
                    }
                }
                e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            }
        }).catch((error) => {
            log(error)
        });
    // const chapToDelete = e.target.parentNode.chapReference;
    // bookModal.bookReference.deleteChapter(chapToDelete.num);
}

/** Called when opening book editor. Sets the book to be edited and
 * flags the edit variable to be true.
 */
function setEdit(e) {
    edit = true;
    chapterModal.chapReference = e.target.parentNode.chapReference;
}

/** Used only when viewer is not profile owner. Provides functionality for follow/unfollow button.
 * Makes viewer follow the user if they are not already, or unfollow if they are already following.
 * Requires server request. */
function followOrUnfollow(e) {
    e.preventDefault();
    if (followButton.innerHTML === "Follow") {
        // add user to follow list and update followee number

        const followUrl = "/db/follow";

        log(profileUser.id)
        log(profileUser.id=== getCookie("id"))
        log(getCookie("id"))
        log(decodeURIComponent(getCookie("name")))

        fetch(followUrl, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                following: getCookie("id"),
                beingFollowed: profileUser.id
            })
          }).then((res) => {
            if(res.status !== 200){
                alert("Error updating user info");
                return
            }
            return res.json()
        }).then((userJson) => {
                return userJson;
            }).then(res => {
                if(res.resolved){
                    // viewingUser.following.push(profileUser);
                    followButton.classList.add("btn-danger");
                    followButton.classList.remove("btn-success");
                    followButton.innerHTML = "UnFollow";
                    profileUser.followers += 1;
                    followers.innerHTML = profileUser.followers;
                }
            }).catch((error) => {
                log(error)
            });



        
    } else {
        // remove user to follow list and update followee number

        const followUrl = "/db/unfollow";

        fetch(followUrl, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                following: getCookie("id"),
                beingFollowed: profileUser.id
            })
          }).then((res) => {
            if(res.status !== 200){
                alert("Error updating user info");
                return
            }
            return res.json()
        }).then((userJson) => {
                return userJson;
            }).then(res => {
                if(res.resolved){
                    // viewingUser.removeFollowing(profileUser.name);
                    followButton.classList.add("btn-success");
                    followButton.classList.remove("btn-danger");
                    followButton.innerHTML = "Follow";
                    profileUser.followers -= 1;
                    followers.innerHTML = profileUser.followers;
                    
                }
            }).catch((error) => {
                log(error)
            });
    }
    
}

/** Handles the clear button in the notification view.
 * Remove all notifications from user.
 * Requires server request.
 */
function clearNotifications(e) {
    e.preventDefault();
    while (notiListGroup.firstChild) {
        notiListGroup.removeChild(notiListGroup.firstChild);
    }
    profileUser.newMessages = [];
    profileUser.oldMessages = [];
}

/** Set up the profile picture box. If the user is the profile owner, profile picture changing will be enabled.
 *  If not, the user will not be able to do anything.
 *  The change of profile pictures will be randomly generated from the adorable avatars api. */
function setUpPic() {
    // TODO - Alert boxes if success
    // First set up the image box to be the user's profile photo in db
    const profileImg = document.getElementById("profileImage");
    profileImg.src = profileUser.image;
    if (profileOwner){
        // Enable change of profile image if user is the owner
        profileImg.onclick = async function () {
            const newAvatar = (await getAvatar()).avatar;

            profileImg.src = newAvatar;

            const patchUrl = url + "/update/img";
            log(patchUrl);
            fetch(patchUrl, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({
                    image: newAvatar
                })
            })
                .then((res) => {
                if (res.status !== 200) {
                    alert("Error updating user info");
                    return;
                }
                profileUser.img = newAvatar;
                return res.json();

            })
                .catch(error => log(error));
        };
    } else {
        profileImg.classList.remove("hover");
    }

}

/** A async function to get a avatar from the server. */
async function getAvatar() {
    return await fetch("/db/randomavatar/")
        .then((res) => {
            return res.json();
        })
        .catch(error => log(error));

}

function setUpCoverForm(){
    const url = "/upload/" + profileUser.id;
    coverUpload.action = url;

}
