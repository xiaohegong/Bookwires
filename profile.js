'use strict';

//create sample bookshelf and followerlist for testing purposes
// this requires an actual server call to get the user whose profile it is
const sampleBooks = []
for(let p=0; p<7; p++){
    sampleBooks.push(new Book('Harry Potter', fakeUser[2],'1999/10/1','img/harryPotter.jpg','fantasy'));
    sampleBooks.push(new Book('Time Raiders', fakeUser[0],'2002/4/5','img/TimeRaiders.jpg','fantasy'));
    sampleBooks.push(new Book('Wandering Earth', fakeUser[1],'2008/8/8','img/WanderingEarth.jpg','Sci-fi'));
    sampleBooks.push(new Book('ThreeBody Problem', fakeUser[1],'2010/5/3','img/threebody.jpg','Sci-fi'));
    sampleUser.following.push(sampleUser);
    
}
sampleBooks.push(new Book('ThreeBody Problem', fakeUser[1],'2010/5/3','img/threebody.jpg','Sci-fi'));
sampleUser.bookshelf = sampleBooks;

// variable to keep track if the viewer is the owner of the profile
let profileOwner = true;
// button that changes the viewers authentification for testing purposes
const changeAuthButton = document.querySelector("#change-auth");
changeAuthButton.addEventListener('click', changeAuthentification);

// create a user that is to be used if not the owner of the profile
// this would require a server call to check if the current logged in user
// is the owner or not
const viewingUser = userCreater("sampleViewer","sv@domain.com","123");

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

// handle searching in bookshelf
const searchButton = document.querySelector("#search-button");
searchButton.addEventListener('click', updateShelf);
const searchBox = document.querySelector(".shelf-search");

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

// follow button:
const followButton = document.querySelector("#follow-button");

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

                if(profileOwner && curNav===shelfButton){
                    const bookDeleteButton = document.createElement("button");
                    bookDeleteButton.innerHTML = "x";
                    bookDeleteButton.className = "book-delete";
                    bookDeleteButton.onclick = removeBookBookshelf;
                    newLi.appendChild(bookDeleteButton);
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

    if(searchBox.value === ''){
        return
    }
    setUpCarousel(fuzzyBookSearch(searchBox.value, sampleUser.bookshelf));
    document.querySelector("#book-shelf").querySelector("h1").innerHTML = "My Bookshelf"

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

function changeAuthentification(e){
    e.preventDefault();
    profileOwner = !profileOwner;

    if(profileOwner){
        followButton.style.display = "none";
        followingButton.style.display = "block";
        settingsButton.style.display = "block";
    }
    else{
        followButton.style.display = "inline-block";
        followingButton.style.display = "none";
        settingsButton.style.display = "none";
    }

    curNav.click();
}